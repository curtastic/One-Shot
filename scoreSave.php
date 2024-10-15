<?php
$score = intval(@$_GET['score']);
if(!$score) {
	die("no score");
}
if($score < 0) {
	die("bad score");
}
if($score > 5*5000) {
	die("bad score 2");
}

$userId = @$_GET['userId'];
if(!$userId) {
	die("no userId");
}
if(strlen($userId) > 99) {
	die("bad userId");
}



$curl = curl_init();

curl_setopt_array($curl, [
	CURLOPT_URL => "https://api.hyplay.com/v1/apps/34201642-ca35-4069-b126-365ee5409caa/leaderboards/e2b99277-f9e6-4d64-a3a2-3c4d15952894/scores",
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_ENCODING => "",
	CURLOPT_MAXREDIRS => 10,
	CURLOPT_TIMEOUT => 30,
	CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	CURLOPT_CUSTOMREQUEST => "POST",
	CURLOPT_POSTFIELDS => json_encode([
		'score' => $score,
		'userId' => $userId
	]),
	CURLOPT_HTTPHEADER => [
		"accept: application/json",
		"content-type: application/json",
		//"X-session-authorization: $token",
		"x-app-authorization: app_sk_OM7AebuIFFGbwRfhpViF21gOw6ErmjyC26vO3srfphF-RDxeY5sSLZH3CGR-1KsP"
	],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if($err) {
	die("Error: $err");
}
die($response);
