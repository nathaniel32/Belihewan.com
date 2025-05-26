<?php
    include '../data/database/conn.php'; 
    include '../data/function.php';

    verifyTokenPage(true);

    $title = "Editor Ads";
    $headData = '
            <meta name="robots" content="noindex, nofollow">
        ';
    $main = "
        <link rel='stylesheet' href='/data/assets/css/admin/editorads.css'>
        <div class='container'>
        
            <div class='formContainer'>
                <div class='formControl'>
                    <h2>Input Ads</h2>
                    <input class='form-control' placeholder='Deskripsi' id='inputDeskripsiAds'>
                    <input class='form-control' placeholder='Link' id='inputLinkAds'>
                    <input class='form-control' type='file' id='inputFileAds' accept='image/*'>
                    <input type='submit' id='inputSubmitAds'>
                </div>
            </div>

            <div id='displayAdsBar'></div>
        </div>
        <script src='/data/template/admin/editorads.js'></script>
    ";

    include '../base.php';