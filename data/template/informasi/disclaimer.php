<?php
    include '../data/database/conn.php'; 
    include '../data/function.php';

    $title = "Disclaimer";
    
    $metaTitle = "Disclaimer $domain";
    $metaDesc = "Disclaimer $domain";
    $metaLink = "https://$domain/disclaimer";
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
            <h1 class="judul_page">Disclaimer</h1>
            <div class="section_informasi">
                <h2>Konten Pengguna</h2>
                <ul>
                    <li>Situs ini adalah platform untuk iklan hewan dan barang terkait lainnya yang diposting oleh pengguna.</li>
                    <li>Kami tidak bertanggung jawab atas keakuratan, kebenaran, atau keandalan konten yang diposting oleh pengguna.</li>
                    <li>Pengguna bertanggung jawab sepenuhnya atas informasi yang mereka berikan dan untuk memastikan bahwa iklan mereka sesuai dengan hukum yang berlaku dan tidak melanggar hak-hak pihak lain.</li>
                </ul>
            </div>
            <div class="section_informasi">
                <h2>Kewaspadaan</h2>
                <ul>
                    <li>Pembeli harus melakukan penelitian mereka sendiri sebelum membeli hewan.</li>
                    <li>Kami tidak menjamin kesehatan, keaslian, atau kecocokan hewan yang diposting di situs ini.</li>
                    <li>Kami sangat menyarankan untuk melakukan pemeriksaan kesehatan oleh dokter hewan yang berkualifikasi sebelum mengambil keputusan pembelian.</li>
                </ul>
            </div>
            <div class="section_informasi">
                <h2>Transaksi dan Komunikasi</h2>
                <ul>
                    <li>Segala transaksi dan komunikasi antara pembeli dan penjual dilakukan di luar kendali kami.</li>
                    <li>Kami tidak bertanggung jawab atas kesepakatan, perselisihan, atau konsekuensi apa pun yang timbul dari transaksi atau komunikasi antara pengguna situs ini.</li>
                </ul>
            </div>
            <div class="section_informasi">
                <h2>Kepatuhan Hukum</h2>
                <ul>
                    <li>Penjual dan pembeli bertanggung jawab untuk mematuhi semua hukum dan peraturan yang berlaku terkait dengan penjualan dan pembelian hewan, termasuk namun tidak terbatas pada persyaratan lisensi, peraturan kesehatan hewan, dan perlindungan hewan.</li>
                </ul>
            </div>
            <div class="section_informasi">
                <h2>Kebijakan Privasi</h2>
                <ul>
                    <li>Kami menghormati privasi pengguna kami.</li>
                    <li>Namun, kami tidak dapat menjamin keamanan atau kerahasiaan informasi yang diposting atau ditransmisikan oleh pengguna melalui situs ini.</li>
                    <li>Penggunaan situs ini adalah risiko pengguna sendiri.</li>
                </ul>
            </div>
            <div class="section_informasi">
                <h2>Penggunaan Situs</h2>
                <ul>
                    <li>Kami berhak untuk menghapus, memodifikasi, atau menolak iklan atau konten pengguna mana pun yang dianggap melanggar ketentuan penggunaan kami atau melanggar hukum yang berlaku.</li>
                </ul>
            </div>
            <div class="section_informasi">
                <h2>Pembaruan</h2>
                <ul>
                    <li>Disclaimer ini dapat diperbarui dari waktu ke waktu tanpa pemberitahuan sebelumnya.</li>
                    <li>Pengguna disarankan untuk memeriksa halaman disclaimer ini secara berkala untuk pembaruan.</li>
                </ul>
            </div>
        </div>
    ';

    include '../base.php';