<?php
use Model\Services\DataAccess;
use Model\Utilities\Log;

// - - - - - [ INIT ]

if(!file_exists('./app/errors'))
{
    mkdir('./app/errors', 0777, true);    
}

define('SITE_URL', 'localhost');

define('APP_ROOT', dirname(dirname(__FILE__)));
define('DB', APP_ROOT . '/db/db.sqlite');
define('ERRORS', APP_ROOT . '/errors');
define('GMT', '+3'); // << - - - SET YOUR TIMEZONE HERE
define('APP_NAME', 'RPG'); // << - - - SET YOUR APP'S NAME HERE
define('SEND_MAIL', false); // << - - - IS IT SHOULD SEND A MAIL.
define('DEV_MODE', true);

// - - - - - [ TOKEN CONFIGURATION ]

define('COOKIE_NAME', 'token'); // The name of the cookie where we're going to store the token.
define('SECRET_WORD', '$SPL4B0$'); // The secret word used for encryptation.
define('TOKEN_DURATION', 86400); // The duration of the token in seconds.

DataAccess::$pdo = new PDO('sqlite:' . DB);
DataAccess::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// - - - - - [ SMTP ]

$smtpFile = APP_ROOT . '/config/smtp.json';
if(file_exists($smtpFile))
{
    $smtpData = json_decode(file_get_contents($smtpFile), true);
    define('SMTP_HOST', $smtpData['SMTP_HOST']);
    define('SMTP_USERNAME', $smtpData['SMTP_USERNAME']);
    define('SMTP_PASSWORD', $smtpData['SMTP_PASSWORD']);
    define('SMTP_FROM', $smtpData['SMTP_FROM']);
    define('SMTP_SENDER', $smtpData['SMTP_SENDER']);        
}
else
{
    define('SMTP_HOST', 'asd');
    define('SMTP_USERNAME', 'asd');
    define('SMTP_PASSWORD', 'asd');
    define('SMTP_FROM', 'asd');
    define('SMTP_SENDER', 'asd');
}

// - - - - - [ DB TABLES DEFINES ]

define('USERS', 'cc_users');
define('POSTS', 'gamenews');

// - - - - - [ POSTS CONFIG ]


?>
