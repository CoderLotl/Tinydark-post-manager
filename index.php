<?php
// --------------------------------------------------------------------------------
// [ INIT ] ****************************

// CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header('Access-Control-Allow-Origin: http://localhost:5173');
    header('Access-Control-Allow-Headers: *');
    header('Access-Control-Allow-Methods: *');
    header('Access-Control-Allow-Credentials: true');
    header('Content-Type: application/json; charset=UTF-8');
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    exit; // Stop further execution
}

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Methods: *');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=UTF-8');
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Error Handling
error_reporting(-1);
ini_set('display_errors', 1);

// Initial files
require __DIR__ . '/vendor/autoload.php'; // Classes Autoloader.
require __DIR__ . '/app/config/config.php'; // Initial configs.

// Use of initial libraries
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use Slim\Routing\RouteCollectorProxy;
use Model\Utilities\Log;

// Instantiating of the App
$app = AppFactory::create();

// Error middleware
$errorMiddleware = function ($request, $exception, $displayErrorDetails) use ($app)
{
    $statusCode = 500;
    $errorMessage = $exception->getMessage();
    $response = $app->getResponseFactory()->createResponse($statusCode);
    $response->getBody()->write(json_encode(['error' => $errorMessage]));
    Log::WriteLog('index_error.txt', $errorMessage . ' METHOD: ' . $_SERVER['REQUEST_METHOD']);
    return $response->withHeader('Content-Type', 'application/json');
};

// Add error middleware
$app->addErrorMiddleware(true, true, true)->setDefaultErrorHandler($errorMiddleware);

// Add parse body
$app->addBodyParsingMiddleware();

// --------------------------------------------------------------------------------
// [ SERVER ] ****************************

/////////////////////////////////////////////////////////////
#region - - - TEST ROUTES - - -

$app->get('/test', function (Request $request, Response $response)
{
    Log::WriteLog('test.txt', 'a');
    $payload = json_encode(array('method' => 'GET', 'msg' => "GET /test working (.htacces file is present)."));
    $response->getBody()->write($payload);
    return $response->withHeader('Content-Type', 'application/json');    
});
#endregion

/////////////////////////////////////////////////////////////
#region - - - SERVER ROUTES - - -

/**
 * The landing page.
 */

$app->get('[/]', \Model\Services\Manager::class . '::ReturnToFront')->add(\Model\Middlewares\Wards::class . '::AlreadyLoggedLogin');

#endregion

/////////////////////////////////////////////////////////////
#region - - - PUBLIC ROUTES - - -

/**
 * All the routes that lead to pages.
 */

 $app->get('/home', \Model\Services\Manager::class . '::ReturnToFront')->add(\Model\Middlewares\Wards::class . '::Auth');

 $app->get('/edit_post', \Model\Services\Manager::class . '::ReturnToFront')->add(\Model\Middlewares\Wards::class . '::Auth');

#endregion

/////////////////////////////////////////////////////////////
#region - - - INNER ROUTES - - -

/**
 * Routes only accessed by the front via requests. They don't return pages.
 */

$app->post('/login', \Model\Services\Manager::class . '::Login');

$app->post('/logout', \Model\Services\Manager::class . '::Logout');

$app->post('/check_logged_in', \Model\Middlewares\Wards::class . '::IsAllowed');

$app->post('/register/submit', \Model\Services\Manager::class . '::Register');

$app->post('/verify_account', \Model\Services\Manager::class . '::Verify');

$app->get('/posts/pages_count', \Model\Services\PostManager::class . '::CountPostsPages' );

$app->get('/posts/posts_content', \Model\Services\PostManager::class . '::ReturnPosts' );

$app->get('/posts/post', \Model\Services\PostManager::class . '::ReturnPost');

$app->get('/posts/get_tags', \Model\Services\PostManager::class . '::GetTags');

$app->post('/posts/create_posts', \Model\Services\PostManager::class . '::CreatePost')->add(\Model\Middlewares\Wards::class . '::IsAllowed');

$app->put('/posts/save_post_changes', \Model\Services\PostManager::class . '::SavePostChanges')->add(\Model\Middlewares\Wards::class . '::IsAllowed');

$app->delete('/posts/delete_post', \Model\Services\PostManager::class . '::DeletePost')->add(\Model\Middlewares\Wards::class . '::IsAllowed');

#endregion

// *************** ROUTE CATCHER ***************
// Serve the front-end HTML for any route that doesn't match defined routes.
$app->get('/{routes:.+}', \Model\Services\Manager::class . '::ReturnToFront');
//$app->post('/{routes:.+}', \Model\Services\Manager::class . '::ReturnToFront');

$app->run();