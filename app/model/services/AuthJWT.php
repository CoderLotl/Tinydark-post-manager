<?php

namespace Model\Services;
use Firebase\JWT\JWT;
use Exception;

class AuthJWT
{
    private static $secretWord = SECRET_WORD;
    private static $encrypt = ['HS256'];

    public static function NewToken($data)
    {
        $now = time();
        $tokenId = base64_encode(random_bytes(32));
        $payload = array(
            'jti' => $tokenId,
            'iat' => $now,
            'exp' => $now + (TOKEN_DURATION),
            'data' => $data            
        );

        return JWT::encode($payload, self::$secretWord);
    }

    public static function VerifyAuthorization($request, $response)
    {
        $cookies = $request->getCookieParams();
        $token = $cookies[COOKIE_NAME];

        if($token)
        {
            try
            {
                $decoded = JWT::decode
                (
                    $token,
                    self::$secretWord,
                    self::$encrypt
                );
                if($decoded)
                {
                    return self::ReturnResponse($request, $response, ''); // Default 200. User is logged.
                }
            }
            catch(Exception $e)
            {
                return self::ReturnResponse($request, $response, $e, 500);
            }
            catch(\Firebase\JWT\ExpiredException $e)
            {
                return self::ReturnResponse($request, $response, $e, 498);
            }
        }

        return self::ReturnResponse($request, $response, '', 401); // Error: there's no token.
    }
    
    public static function VerifyToken($token, $request, $handler)
    {
        // If there's no token...
        if(empty($token))
        {
            $response = $handler->handle($request);
            return $response->withStatus(498);
            // We return invalid or missing token.
        }
        try
        {
            $decoded = JWT::decode
            (
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

    private static function ReturnResponse($request, $response, $payload, $status = 200)
    {        
        $response->getBody()->write(json_encode(['response' => $payload]));        
        return $response->withStatus($status);
    }
}