<?php

namespace Model\Services;
use Model\Services\DataAccess;

class PostManager
{
    // - - - - - - - - - - - - - PUBLIC FUNCTIONS

    public static function CountPostsPages($request, $response)
    {
        $params = self::GetRequest($request);
        $postsPerPage = $params['posts_per_page'];
        $count = DataAccess::Count(POSTS);
        return self::ReturnResponse($request, $response, ceil($count / $postsPerPage), 200);
    }

    public static function GetTags($request, $response)
    {        
        $tags = DataAccess::SelectDistinctColumn(POSTS, 'game');
        return self::ReturnResponse($request, $response, $tags, 200);
    }

    public static function ReturnPosts($request, $response)
    {
        $params = self::GetRequest($request);
        $posts = DataAccess::ReturnByGroups(POSTS, $params['page'], $params['posts_amount'], 'date');
        return self::ReturnResponse($request, $response, $posts, 200);
    }

    public static function ReturnPost($request, $response)
    {
        $params = self::GetRequest($request);
        $post_content = DataAccess::SelectWhere(POSTS, ['game', 'headline'], [$params['game'], $params['headline']]);        
        return self::ReturnResponse($request, $response, $post_content, 200);
    }

    public static function SavePostChanges($request, $response)
    {
        $params = self::GetRequest($request);
        $update = DataAccess::Update(
            POSTS,
            ['game', 'headline', 'content'],
            [$params['game'], $params['headline'], $params['content'] ],
            'object_id',
            $params['object_id']
        );
        if($update)
        {
            return self::ReturnResponse($request, $response, 'OK', 200);
        }
        else
        {
            return self::ReturnResponse($request, $response, 'ERROR UPDATING', 400);
        }
    }

    private static function GetRequest($request)
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
    
    private static function ReturnResponse($request, $response, $payload, $status = 200)
    {        
        $response->getBody()->write(json_encode(['response' => $payload]));        
        return $response->withStatus($status);
    }
}

?>