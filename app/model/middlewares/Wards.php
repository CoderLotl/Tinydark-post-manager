<?php

namespace Model\Middlewares;
use Model\Services\AuthJWT;
use Model\Utilities\Log;
use Slim\Routing\RouteContext;

class Wards
{
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
            return $response->withStatus(401);
        }
    }
}