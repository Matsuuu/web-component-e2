<?php

header("Access-Control-Allow-Origin: *");
$GLOBALS["merchant_hash"] = "6pKF4jkv97zmqBJ3ZL8gUw5DfT2NMQ";

$reqMethod = $_SERVER["REQUEST_METHOD"];
$reqPath = $_SERVER["REQUEST_URI"];

if ($reqMethod != "POST" && $reqPath != "/authcode") return;

printf(generateAuthCode($_POST));

function generateAuthCode($request) {
    $authCodeString = $GLOBALS["merchant_hash"] . $request["authCodeString"];
    $authCode = hash("sha256", $authCodeString);
    return strtoupper($authCode);
}

?>
