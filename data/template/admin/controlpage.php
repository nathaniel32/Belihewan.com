<?php
    include '../data/database/conn.php'; 
    include '../data/function.php';

    verifyTokenPage(true);

    $title = "Control Page";
    $headData = '
                <meta name="robots" content="noindex, nofollow">
            ';
    $main = "
        <link rel='stylesheet' href='/data/assets/css/admin/controlpage.css'>
        <div class='container controlPageContainer'>
            <button id='updateSitemapBtn' class='btn'>Update Sitemap</button>
            <button id='updateWilayahBtn' class='btn'>Update Wilayah JSON</button>
            <button id='updateKategoriBtn' class='btn'>Update Kategori JSON</button>
            <div class='linkSiteMapContainer'>
                <a href='/data/sitemap/sitemap_index.xml' class='btn'>Index</a>
                <a href='/data/sitemap/sitemap_kategori.xml' class='btn'>Kategori</a>
                <a href='/data/sitemap/sitemap_iklan.xml' class='btn'>Iklan</a>
            </div>
        </div>
        <script src='/data/template/admin/controlpage.js'></script>
    ";

    include '../base.php';