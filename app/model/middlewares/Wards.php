<?php

namespace Model\Middlewares;
use Model\Services\AuthJWT;
use Model\Utilities\Log;
use Slim\Psr7\Response;
use Slim\Routing\RouteContext;
use Model\Services\ResponseManager;

class Wards
{
    /**
     * Used only at the initial GET {[/]}. Checks if the user is already logged.
     * Redirects the user to the /home.
     */
    public static function AlreadyLoggedLogin($request, $handler)
    {
        $cookies = $request->getCookieParams();
        if(isset($cookies['token']))
        {
            $token = $cookies['token'];
            if(AuthJWT::VerifyToken($token, $request, $handler))
            {
                $response = $handler->handle($request);
                return $response->withHeader('Location', '/home')->withStatus(302);
            }
        }
        else
        {
            return $handler->handle($request);
        }
    }

    /**
     * Used for checking if the user is logged.
     * If the user is logged allows them to continue. Else, redirects the user to /error,
     * which is caught by the route catcher at the index and works together with the front which
     * manages the error.
     */
    public static function Auth($request, $handler)
    {
        $cookies = $request->getCookieParams();
        if(isset($cookies['token']))
        {
            $token = $cookies['token'];
            if(AuthJWT::VerifyToken($token, $request, $handler) == true)
            {
                return $handler->handle($request);
            }
        }
        else
        {
            $response = $handler->handle($request);
            return $response->withHeader('Location', '/error')->withStatus(302);
        }
    }

    public static function IsAllowed($request, $handler, int $userType = null)
    {
        $cookies = $request->getCookieParams();        
        if(isset($cookies[COOKIE_NAME]))
        {            
            $token = $cookies[COOKIE_NAME];
            if(AuthJWT::VerifyToken($token, $request, $handler) == true)
            {
                if($userType!= null)
                {                    
                    $token = AuthJWT::GetData($token);                    
                    if($token->type == $userType)
                    {
                        return $handler->handle($request);
                    }
                    else
                    {
                        $response = new Response();
                        return ResponseManager::ReturnResponse($request, $response, "Unathorized request. You don't have enough rights for this.", 403);
                    }
                }

                return $handler->handle($request);
            }
        }
        
        $response = new Response();
        return ResponseManager::ReturnResponse($request, $response, "Unathorized request. Token inexistent or not valid.", 401);
    }

    /**
     * Checks if the entering connection is local. Filters any non-local connection and returns an error.
     * @param mixed $request
     * @param mixed $handler
     * 
     * @return [type]
     */
    public static function IsLocal($request, $handler)
    {
        $remoteAddress = $request->getServerParams()['REMOTE_ADDR'];
        if($remoteAddress != '127.0.0.1' && $remoteAddress != '::1')
        {
            $response = new Response();
            return ResponseManager::ReturnResponse($request, $response, 'Forbidden', 403);
        }
        
        return $handler->handle($request);
    }
}
