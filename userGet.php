<?php

$token = @$_GET['token'];
if(!$token) {
	die("no token");
}

$url = 'https://api.hyplay.com/v1/users/me';

$headers = [
    'Accept: application/json',
    "X-session-authorization: $token",
];

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');

$response = curl_exec($ch);

$error = curl_errno($ch);
curl_close($ch);
if($error) {
    die("Error: $error");
}
//$data = json_decode($response, true);
//echo "<pre>";print_r($data);

die($response);

