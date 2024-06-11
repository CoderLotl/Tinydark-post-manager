<?php

namespace Model\Middlewares;
use Model\Services\AuthJWT;
use Model\Utilities\Log;
use Slim\Psr7\Response;
use Slim\Routing\RouteContext;

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
                        return self::ReturnResponse($request, $response, "Unathorized request. You don't have enough rights for this.", 403);
                    }
                }

                return $handler->handle($request);
            }
        }
        
        $response = new Response();
        return self::ReturnResponse($request, $response, "Unathorized request. Token inexistent or not valid.", 401);
    }

    private static function ReturnResponse($request, $response, $payload, $status = 200)
    {        
        $response->getBody()->write(json_encode(['response' => $payload]));        
        return $response->withStatus($status);
    }
}