<?php

try {
    $dbname = 'belihewan';
    $user = 'root';
    $password = '';

    $connect = new PDO("mysql:host=localhost;dbname=$dbname", $user, $password);
} catch (PDOException $e) {
    http_response_code(500);
    echo "Server Error!";
    exit;
}