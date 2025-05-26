<?php

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    include 'conn.php';
    include 'mail.php';
    include '../function.php';

    $request_data=json_decode(file_get_contents("php://input"));

    //unpublished
}else{
    http_response_code(405);
    echo "Tidak ada Izin";
    exit;
}