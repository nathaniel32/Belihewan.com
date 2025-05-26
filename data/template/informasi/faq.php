<?php
    include '../data/database/conn.php'; 
    include '../data/function.php';

    $title = "FAQ";
    
    $metaTitle = "FAQ $domain";
    $metaDesc = "FAQ $domain";
    $metaLink = "https://$domain/faq";
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

            <h1 class="judul_page">Pertanyaan Umum - belihewan.com</h1>

            <div class="section_informasi">
                <h2>Apa itu belihewan.com?</h2>
                <p>belihewan.com adalah platform online yang memungkinkan pengguna untuk membeli dan menjual segala jenis hewan serta perlengkapan hewan.</p>
            </div>

            <div class="section_informasi">
                <h2>Bagaimana cara menggunakan belihewan.com?</h2>
                <ul>
                    <li>Untuk memulai, Anda dapat membuat akun pengguna atau mengakses situs sebagai pengunjung.</li>
                    <li>Setelah itu, Anda dapat menelusuri iklan hewan yang dijual atau membuat iklan untuk hewan yang ingin Anda jual.</li>
                </ul>
            </div>

            <div class="section_informasi">
                <h2>Bagaimana cara membuat iklan untuk menjual hewan?</h2>
                <ul>
                    <li>Anda dapat membuat iklan dengan membuat akun atau masuk sebagai pengguna.</li>
                    <li>Lalu klik tombol "Pasang Iklan" dan mengisi detail yang diperlukan tentang hewan yang ingin Anda jual.</li>
                </ul>
            </div>

            <div class="section_informasi">
                <h2>Apakah semua hewan dapat dijual di belihewan.com?</h2>
                <ul>
                    <li>Kami memperbolehkan penjualan hewan yang legal dan mematuhi hukum yang berlaku.</li>
                    <li>Namun, kami berhak untuk menolak atau menghapus iklan yang melanggar kebijakan kami.</li>
                </ul>
            </div>

            <div class="section_informasi">
                <h2>Bagaimana saya bisa memastikan kesehatan hewan yang saya beli?</h2>
                <ul>
                    <li>Kami sangat menyarankan untuk melakukan pemeriksaan kesehatan oleh dokter hewan yang berkualifikasi sebelum membeli hewan.</li>
                    <li>Selain itu, pastikan untuk bertanya kepada penjual tentang riwayat kesehatan dan perawatan hewan tersebut.</li>
                </ul>
            </div>

            <div class="section_informasi">
                <h2>Apakah belihewan.com menjamin keamanan transaksi?</h2>
                <ul>
                    <li>Kami hanya menyediakan platform untuk memfasilitasi transaksi antara pembeli dan penjual.</li>
                    <li>Kami tidak bertanggung jawab atas transaksi yang dilakukan di luar situs kami.</li>
                    <li>Kami mendorong pengguna untuk melakukan transaksi dengan hati-hati dan menggunakan metode pembayaran yang aman.</li>
                </ul>
            </div>

            <div class="section_informasi">
                <h2>Apakah belihewan.com memberikan saran medis tentang perawatan hewan?</h2>
                <ul>
                    <li>Kami tidak memberikan saran medis.</li>
                    <li>Kami sarankan untuk berkonsultasi dengan dokter hewan yang berkualifikasi untuk saran tentang perawatan hewan Anda.</li>
                </ul>
            </div>

            <div class="section_informasi">
                <h2>Bagaimana cara melaporkan iklan yang mencurigakan atau melanggar?</h2>
                <ul>
                    <li>Jika Anda menemukan iklan yang mencurigakan atau melanggar, Anda dapat melaporkannya dengan mengklik tombol "Laporkan" di bawah iklan tersebut atau menghubungi tim dukungan kami.</li>
                </ul>
            </div>

            <div class="section_informasi">
                <h2>Bagaimana saya bisa menghubungi tim dukungan belihewan.com?</h2>
                <ul>
                    <li>Anda dapat menghubungi tim dukungan kami melalui formulir <a class="informasi_kontak_link" href="/contact">Kontak</a> di situs kami atau melalui alamat email yang tersedia di halaman "<a href="/contact">Kontak<a>".</li>
                </ul>
            </div>

            <div class="section_informasi">
                <h2>Apakah ada biaya untuk menggunakan belihewan.com?</h2>
                <ul>
                    <li>Pendaftaran dan penelusuran iklan di belihewan.com gratis.</li>
                </ul>
            </div>
        </div>
    ';
    include '../base.php';