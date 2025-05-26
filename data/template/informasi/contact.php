<?php
    include '../data/database/conn.php'; 
    include '../data/function.php';

    $title = "Kontak";
    
    $metaTitle = "Kontak $domain";
    $metaDesc = "Kontak Kami $domain";
    $metaLink = "https://$domain/contact";
    $metaImg = "https://$domain/data/assets/image/logo/sociallogo.png";
    $headData = '
        <link rel="canonical" href="'. $metaLink .'">
        <meta name="robots" content="index, follow">
        <meta name="description" content="'. $metaDesc .'">
        <meta property="og:title" content="'. $metaTitle .'">
        <meta property="og:description" content="'. $metaDesc .'">
        <meta property="og:image" content="'. $metaImg .'">
        <meta property="og:url" content="'. $metaLink .'">
        <meta name="twitter:title" content="'. $metaTitle .'">
        <meta name="twitter:description" content="'. $metaDesc .'">
        <meta name="twitter:image" content="'. $metaImg .'">

        <link rel="stylesheet" href="/data/assets/css/informasi.css">
    ';

    $main = '
        <div class="kontak_container">
            <h1 class="judul_page">Kontak Kami</h1>
            <p>Jika Anda memiliki pertanyaan, masukan, atau saran, jangan ragu untuk menghubungi kami melalui formulir kontak atau melalui informasi kontak kami:</p>

            <h3>Formulir Kontak</h3>
            <form id="formulir_email" class="kontak_form">
                <div class="kontak_group">
                    <label for="nama_contact"><span>Nama*</span></label>
                    <input type="text" id="nama_contact" name="nama" placeholder="Nama Anda">
                </div>
                <div class="kontak_group">
                    <label for="email_contact"><span>Email*</span></label>
                    <input type="email" id="email_contact" name="email" placeholder="Email Anda">
                </div>
                <div class="kontak_group">
                    <label for="subject_contact"><span>Subject</span></label>
                    <input type="text" id="subject_contact" name="subject" placeholder="Subject Pesan">
                </div>
                <div class="kontak_group">
                    <label for="pesan_contact"><span>Pesan*</span></label>
                    <textarea id="pesan_contact" name="pesan" rows="5" placeholder="Tulis pesan Anda di sini"></textarea>
                </div>
                <input type="submit" class="kontak_submit" name="submitBtn" value="Kirim Pesan">
            </form>

        </div>
        <script src="/data/template/informasi/contact.js"></script>
    ';

    include '../base.php';