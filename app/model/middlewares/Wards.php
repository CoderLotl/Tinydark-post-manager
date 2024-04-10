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

    public static function IsAllowed($request, $handler)
    {
        $cookies = $request->getCookieParams();        
        if(isset($cookies['token']))
        {            
            $token = $cookies['token'];
            if(AuthJWT::VerifyToken($token, $request, $handler) == true)
            {
                return $handler->handle($request);
            }

            $response = new Response();
            return $response->withStatus(401);
        }
        else
        {
            $response = new Response();
            return $response->withStatus(401);
        }
    }
}