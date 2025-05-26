<?php
    include '../data/database/conn.php'; 
    include '../data/function.php';

    verifyTokenPage(true);

    $title = "Editor Kategori";
    $headData = '
            <meta name="robots" content="noindex, nofollow">
        ';
    $main = "
        <link rel='stylesheet' href='/data/assets/css/admin/editorkategori.css'>
        <div class='container'>
        
            <div class='formContainer'>
                <div class='formControl'>
                    <h2>Input Kategori</h2>
                    <input class='form-control' placeholder='Nama' id='inputNamaKategori'>
                    <input class='form-control' placeholder='ParentID' id='inputParentIdKategori'>
                    <input class='form-control' type='file' id='inputFileKategori' accept='image/*'>
                    <input type='submit' id='inputSubmitKategori'>
                </div>
            </div>
            
            <div class='formContainer'>
                <div class='formControl'>
                    <h2>Update Kategori</h2>
                    <input class='form-control' placeholder='ID' id='updateIdKategori'>
                    <input class='form-control' placeholder='Nama' id='updateNamaKategori'>
                    <input class='form-control' placeholder='ParentID' id='updateParentIdKategori'>
                    <input class='form-control' type='file' id='updateFileKategori' accept='image/*'>
                    <input type='submit' id='updateSubmitKategori'>
                </div>
            </div>

            <div id='categories'></div>
        </div>
        <script src='/data/template/admin/editorkategori.js'></script>
    ";

    include '../base.php';