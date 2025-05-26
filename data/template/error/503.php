<?php
    include '../data/database/conn.php'; 
    include '../data/function.php';

    //header("HTTP/1.0 503 Service Unavailable");

    $title = "Offline";
    $headData = '<meta name="robots" content="noindex, nofollow">';
    $main = "
        <link rel='stylesheet' href='/data/assets/css/error/error.css'>
        <div class='container'>
            <div class='f_container'>
                <h1 class='f_h1'>:(</h1>
                <h2 class='f_h2'>Koneksi Terputus</h2>
                <p>Nampaknya Anda sedang offline dan tidak dapat mengakses sumber daya ini!</p>
            </div>
        </div>
        <script src='/data/template/error/503.js'></script> 
        ";

    include '../base.php';