<?php
    include '../data/database/conn.php'; 
    include '../data/function.php';

    verifyTokenPage(false);

    $title = "Iklan Saya";
    $headData = '<meta name="robots" content="noindex, nofollow">';
    $main = "
        <link rel='stylesheet' href='/data/assets/css/user/iklansaya.css'>
        <div class='container_iklan_saya'>
            <h1 class='judul_page'>Iklan Saya</h1>
            <div id='container_myads'>Loading...</div>
        </div>
        <script src='/data/template/user/iklansaya.js'></script> ";

    include '../base.php';