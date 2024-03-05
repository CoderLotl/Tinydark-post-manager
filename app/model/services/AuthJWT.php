<?php

namespace Model\Services;
use Firebase\JWT\JWT;
use Exception;

class AuthJWT
{
    private static $secretWord = '$SPL4B0$';
    private static $encrypt = ['HS256'];

    public static function NewToken($datos)
    {
        $now = time();
        $tokenId = base64_encode(random_bytes(32));
        $payload = array(
            'jti' => $tokenId,
            'iat' => $now,
            'exp' => $now + (3600),            
            'data' => $datos            
        );

        return JWT::encode($payload, self::$secretWord);
    }
    
    public static function VerifyToken($token, $request, $handler)
    {
        if(empty($token))
        {
            $response = $handler->handle($request);
            return $response->withStatus(498);
        }
        try
        {
            $decoded = JWT::decode(
                $token,
                self::$secretWord,
                self::$encrypt
            );
            if($decoded)
            {
                return true;
            }
            else
            {
                $response = $handler->handle($request);
                return $response->withStatus(498);
            }
        }
        catch(Exception $e)
        {
            return $e;
        }
        catch(\Firebase\JWT\ExpiredException $e)
        {
            $response = $handler->handle($request);
            return $response->withStatus(498);
        }
    }

    public static function GetData($token)
    {
        return JWT::decode(
            $token,
            self::$secretWord,
            self::$encrypt
        )->data;
    }
}