<?php

namespace Model\Services;

use DateTime;
use Model\Services\DataAccess;

class PostManager
{
    // - - - - - - - - - - - - - PUBLIC FUNCTIONS

    
    /**
     * Receives a number representing the amount of posts per page.
     * Returns the amount of pages required to visualize all the posts.
     * @param mixed $request
     * @param mixed $response
     * 
     * @return [type]
     */
    public static function CountPostsPages($request, $response)
    {
        $params = self::GetRequest($request);
        $postsPerPage = $params['posts_per_page'];
        $count = null;
        if($params['tag'] != 'All')
        {
            $count = DataAccess::Count(POSTS, 'game', $params['tag']);
        }
        else
        {
            $count = DataAccess::Count(POSTS);
        }

        return self::ReturnResponse($request, $response, ceil($count / $postsPerPage), 200);
    }

    /**
     * Returns the posts tags in the DB.
     * @param mixed $request
     * @param mixed $response
     * 
     * @return [type]
     */
    public static function GetTags($request, $response)
    {        
        $tags = DataAccess::SelectDistinctColumn(POSTS, 'game');
        return self::ReturnResponse($request, $response, $tags, 200);
    }

    /**
     * Returns all the posts corresponding to the page the client is requesting, considering the amount of posts per page.
     * The posts are sorted from newest to older.
     * @param mixed $request
     * @param mixed $response
     * 
     * @return [type]
     */
    public static function ReturnPosts($request, $response)
    {
        $params = self::GetRequest($request);
        $posts = null;
        if($params['tag'] != 'All')
        {
            $posts = DataAccess::ReturnByGroups(POSTS, $params['page'], $params['posts_amount'], 'date', true, 'game', $params['tag']);
        }
        else
        {
            $posts = DataAccess::ReturnByGroups(POSTS, $params['page'], $params['posts_amount'], 'date');
        }
        return self::ReturnResponse($request, $response, $posts, 200);
    }

    /**
     * Returns a single post, given the headline and the game tag.
     * @param mixed $request
     * @param mixed $response
     * 
     * @return [type]
     */
    public static function ReturnPost($request, $response)
    {
        $params = self::GetRequest($request);
        $post_content = DataAccess::SelectWhere(POSTS, ['game', 'headline'], [$params['game'], $params['headline']]);        
        return self::ReturnResponse($request, $response, $post_content, 200);
    }

    public static function CreatePost($request, $response)
    {
        $params = self::GetRequest($request);

        $date = new DateTime();
        $dateString = $date->format('Y-m-d H:i:s');

        $create = DataAccess::Insert(
            POSTS,
            ['game', 'headline', 'content', 'url', 'date'],
            [$params['game'], $params['headline'], $params['content'], $params['url'], $dateString]
        );
        if($create)
        {
            return self::ReturnResponse($request, $response, 'OK', 200);
        }
        else
        {
            return self::ReturnResponse($request, $response, 'ERROR UPDATING', 400);
        }
    }

    /**
     * Receives all the data of a post. Updates all the data of the post on the DB according to the data received.
     * @param mixed $request
     * @param mixed $response
     * 
     * @return [type]
     */
    public static function SavePostChanges($request, $response)
    {
        $params = self::GetRequest($request);
        $update = DataAccess::Update(
            POSTS,
            ['game', 'headline', 'content', 'url'],
            [$params['game'], $params['headline'], $params['content'], $params['url'] ],
            'id',
            $params['id']
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

    public static function DeletePost($request, $response)
    {
        $params = self::GetRequest($request);        
        $delete = DataAccess::Delete(POSTS, 'id', $params['id']);
        if($delete)
        {            
            return self::ReturnResponse($request, $response, true, 200);
        }
        return self::ReturnResponse($request, $response, false, 400);
    }

    // ------------------------------------------------------------------------------------

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