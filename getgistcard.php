<?php
require(".env/github.php");
header("Content-Type: text/plain");

function get_http_response_code($url) {
  $headers = get_headers($url);
  return substr($headers[0], 9, 3);
}

$opts = [
  "http" => [
    "method" => "GET",
    'ignore_errors' => true,
    "header" => "Authorization: token " . GITHUB_TOKEN . "\r\nUser-Agent: gitcard\r\n"
  ]
];

$context = stream_context_create($opts);

$username = urlencode(@$_GET["user"]);

$requesturl = "https://api.github.com/users/$username/gists";

$responseStr = file_get_contents($requesturl, false, $context);

$response = json_decode($responseStr, true);

if (array_key_exists("message", $response) && $response["message"] === "Bad credentials") {
  http_response_code(403);
  echo $response["message"];
  exit();
}

if (array_key_exists("message", $response) && strpos($response["message"], "API rate limit exceeded") === 0) {
  http_response_code(403);
  echo $response["message"];
  exit();
}

if (array_key_exists("message", $response) && $response["message"] === "Not Found") {
  http_response_code(404);
  echo $response["message"];
  exit();
}

$raw_url = null;

foreach ($response as $gist) {
  if (array_key_exists("gitcard.card", $gist["files"])) {
    $raw_url = $gist["files"]["gitcard.card"]["raw_url"];
    break;
  }
}

if ($raw_url === null) {
  http_response_code(404);
  exit();
}

header("Cache-Control: public, max-age=900");

echo file_get_contents($raw_url, false, $context);
