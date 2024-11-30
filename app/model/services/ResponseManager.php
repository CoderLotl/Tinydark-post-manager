<?php
namespace Model\Services;

use Model\Utilities\Log;
use Slim\Psr7\Response;
use Slim\Psr7\NonBufferedBody;

class ResponseManager
{
    private static function Redirect($request, $response, $page, $code)
    {
        return $response->withHeader('Location', "/{$page}")->withStatus($code);
    }
    
    public static function GetRequest($request)
    {        
        if($_SERVER['REQUEST_METHOD'] == 'GET' || $_SERVER['REQUEST_METHOD'] == 'DELETE')
        {
            $params = $request->getQueryParams();
        }
        else
        {
            $params = $request->getParsedBody();
        }        
        
        return $params;
    }

    public static function ReturnResponse($request, $response, $payload, $status = 200)
    {        
        $response->getBody()->write(json_encode(['response' => $payload]));
        return $response->withStatus($status);
    }

    public static function ReturnImageResponse($payload)
    {
        $response = new Response();        

        // Set the content type header
        $response = $response->withHeader('Content-Type', image_type_to_mime_type(IMAGETYPE_PNG)); // Adjust for desired format (JPG, PNG, etc.)
        
        // Use output buffering to capture the image data
        ob_start();
        imagepng($payload); // Replace with appropriate function for your format (imagejpeg, imagegif, etc.)
        $imageData = ob_get_contents();
        ob_end_clean();
        
        // Write the image data to the response body
        $response->getBody()->write($imageData);
        
        return $response;  
    }

    /**
     * @param mixed $function must be a functions to run in a loop. Must return a string.
     * @param int $interval the interval in seconds to wait after each iteration.
     * 
     * @return [type]
     */
    /*
    EXPLANATION:
    
    - NonBufferedBody:
        is a specific type of Stream implementation in Slim 4 that is optimized for streaming large responses
        directly to the client without buffering them in memory.
    - 'Content-Type', 'text/event-stream': 
        This informs the client that the content being sent is an Event Stream, a specific format used for sending server-sent events (SSE).
    - ''Cache-Control', 'no-cache': 
        This instructs the client not to cache the response, ensuring that it always receives the latest data from the server.
        This is crucial for real-time updates in SSE.     
    */
    public static function ReturnSSEResponse($request, $response, $function, int $interval, $eventType = null, $dataIsJSON = null)
    {
        $response = $response
        ->withBody(new NonBufferedBody())    
        ->withHeader('Content-Type', 'text/event-stream')    
        ->withHeader('Cache-Control', 'no-cache');

        $stream = $response->getBody();

        while(1)
        {
            $data = $function();

            if($eventType)
            {
                $stream->write("event: {$eventType}" . PHP_EOL);
            }

            if($data)
            {
                $data = json_encode($data);
                $stream->write("data: {$data}" . PHP_EOL . PHP_EOL);
            }            

            if (connection_aborted() || connection_status() == CONNECTION_TIMEOUT)
            {
                Log::WriteLog('conn_lost.txt', 'connection lost');
                break;
            }

            sleep($interval);
        }

        return $response;
    }
}
?>