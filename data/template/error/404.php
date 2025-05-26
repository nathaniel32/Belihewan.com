<?php
    include '../data/database/conn.php'; 
    include '../data/function.php';

    header("HTTP/1.0 404 Not Found");

    $title = "404";
    $headData = '<meta name="robots" content="noindex, nofollow">';
    $main = "
        <link rel='stylesheet' href='/data/assets/css/error/error.css'>
        <div class='container'>
            <div class='f_container'>
                <h1 class='f_h1'>404</h1>
                <h2 class='f_h2'>Not Found</h2>
                <p>The resource requested could not be found on this server!</p>
            </div>
        </div>";

    include '../base.php';