<?php
    include '../data/database/conn.php'; 
    include '../data/function.php';

    header("HTTP/1.0 401 Unauthorized");

    $title = "401";
    $headData = '<meta name="robots" content="noindex, nofollow">';
    $main = "
        <link rel='stylesheet' href='/data/assets/css/error/error.css'>
        <div class='container'>
            <div class='f_container'>
                <h1 class='f_h1'>401</h1>
                <h2 class='f_h2'>Unauthorized</h2>
                <p>You are not authorized to access this resource!</p>
            </div>
        </div>";

    include '../base.php';