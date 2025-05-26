<?php
    include '../data/database/conn.php'; 
    include '../data/function.php';

    verifyTokenPage(true);

    $title = "Admin Home";
    $headData = '
            <meta name="robots" content="noindex, nofollow">
        ';
    $main = "
        <link rel='stylesheet' href='/data/assets/css/admin/adminhome.css'>
        <div class='container'>
        
            <div class='dropdown'>
                <button class='dropdown-btn btn'>Pilih</button>
                <div class='dropdown-content'>
                    <div class='dropdown-item'><a href='/editor-kategori'>Control Kategori</a></div>
                    <div class='dropdown-item'><a href='/control-page'>Control Page</a></div>
                    <div class='dropdown-item'><a href='/editor-ads'>Control Ads</a></div>
                </div>
            </div>
        </div>
        <script src='/data/template/admin/adminhome.js'></script>
    ";

    include '../base.php';