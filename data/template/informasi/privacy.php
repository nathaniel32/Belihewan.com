<?php
    include '../data/database/conn.php'; 
    include '../data/function.php';

    $title = "Privasi";
    
    $metaTitle = "Privasi $domain";
    $metaDesc = "Privasi $domain";
    $metaLink = "https://$domain/privacy";
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
        <div class="container">
            <h1 class="judul_page">Kebijakan Privasi - belihewan.com</h1>
        
            <p>Kebijakan privasi ini menjelaskan bagaimana belihewan.com mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.</p>
            <p>Kami menghargai privasi Anda dan berkomitmen untuk melindungi informasi pribadi Anda dengan sebaik mungkin. Harap dicatat bahwa kebijakan ini hanya berlaku untuk informasi yang kami kumpulkan melalui situs web kami dan tidak mencakup informasi yang Anda berikan kepada pihak ketiga yang mungkin Anda akses melalui tautan di situs kami.</p>

            <div class="section_informasi">
                <h2>Informasi yang Kami Kumpulkan</h2>
                <ul>
                    <li>Ketika Anda menggunakan belihewan.com, kami hanya mengumpulkan alamat IP Anda untuk tujuan keamanan login. Kami tidak mengumpulkan informasi pribadi lainnya atau informasi identifikasi pribadi tanpa izin Anda.</li>
                </ul>
            </div>

            <div class="section_informasi">
                <h2>Penggunaan Informasi</h2>
                <ul>
                    <li>Alamat IP yang kami kumpulkan digunakan secara eksklusif untuk tujuan keamanan login. Kami menggunakan informasi ini untuk memantau aktivitas login, mengidentifikasi dan mencegah aktivitas yang mencurigakan atau berbahaya, serta melindungi keamanan akun pengguna.</li>
                </ul>
            </div>

            <div class="section_informasi">
                <h2>Pemakaian Token</h2>
                <ul>
                    <li>Kami menggunakan token untuk menyimpan login Anda agar Anda dapat tetap masuk ke akun Anda selama Anda tetap berada di situs kami. Data ini akan dihapus setelah Anda keluar dari akun Anda.</li>
                </ul>
            </div>

            <div class="section_informasi">
                <h2>Pemberian Informasi kepada Pihak Ketiga</h2>
                <ul>
                    <li>Kami tidak menjual, menyewakan, atau membagikan informasi pribadi Anda kepada pihak ketiga tanpa izin Anda, kecuali jika diperlukan oleh hukum atau dalam hal pemantauan dan pencegahan aktivitas yang melanggar hukum atau kebijakan situs kami.</li>
                </ul>
            </div>

            <div class="section_informasi">
                <h2>Keamanan Informasi</h2>
                <ul>
                    <li>Kami berkomitmen untuk melindungi informasi pribadi Anda dan menggunakan langkah-langkah keamanan yang sesuai untuk mencegah akses, penggunaan, atau pengungkapan yang tidak sah.</li>
                </ul>
            </div>

            <div class="section_informasi">
                <h2>Perubahan pada Kebijakan Privasi</h2>
                <ul>
                    <li>Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu sesuai dengan perubahan dalam praktik kami atau peraturan yang berlaku. Perubahan tersebut akan segera berlaku setelah diposting di situs ini.</li>
                </ul>
            </div>

            <p>Dengan menggunakan belihewan.com, Anda menyetujui pengumpulan dan penggunaan informasi Anda sesuai dengan kebijakan privasi ini.</p>
            <p>Jika Anda memiliki pertanyaan atau kekhawatiran tentang kebijakan privasi kami, jangan ragu untuk menghubungi kami melalui formulir <a class="informasi_kontak_link" href="/contact">Kontak</a> di situs kami.</p>
        </div>
    ';

    include '../base.php';