<?php
    include '../data/database/conn.php'; 
    include '../data/function.php';

    verifyTokenPage(false);

    $title = "Wishlist";
    $headData = '<meta name="robots" content="noindex, nofollow">';
    $main = "
        <link rel='stylesheet' href='/data/assets/css/user/wishlistsaya.css'>
        <div class='container_wishlist_saya'>
            <h1 class='judul_page'>Wishlist</h1>
            <div id='container_wishlist'>Loading...</div>
        </div>
        <script src='/data/template/user/wishlistsaya.js'></script> ";

    include '../base.php';