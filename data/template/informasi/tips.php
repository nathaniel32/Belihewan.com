<?php
    include '../data/database/conn.php'; 
    include '../data/function.php';

    $title = "Tips Bertransaksi";
    
    $metaTitle = "Bertransaksi $domain";
    $metaDesc = "Bertransaksi di $domain";
    $metaLink = "https://$domain/tips";
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
            <h1 class="judul_page">Tips Pembelian dan Penjualan Hewan - belihewan.com</h1>
        
            <div class="section_informasi">
                <h2>Tips untuk Pembeli:</h2>
                <ul>
                    <li>Jangan Beli Hewan karena Kasihan dan Tidak melalui pengiriman: Pembelian hewan seharusnya bukan karena kasihan semata. Pastikan Anda mempertimbangkan kesiapan Anda untuk merawat hewan tersebut dengan baik. Hewan harus diserahkan secara pribadi oleh penjual, bukan dengan kurir, untuk memastikan kualitas transaksi yang memadai.</li>
                    <li>Jika Anda mengetahui adanya masalah atau aktivitas yang mencurigakan terkait dengan transaksi hewan, segera beri tahu kami dan pihak berwenang setempat untuk tindakan lebih lanjut.</li>
                    <li>Pertimbangkan apakah Anda memiliki cukup ruang dan waktu untuk memelihara hewan dengan baik sebelum memutuskan untuk membelinya. Pastikan Anda siap secara fisik dan finansial untuk merawat hewan tersebut dengan baik.</li>
                    <li>Sebelum membeli hewan, pastikan Anda telah merencanakan dana yang cukup untuk biaya makanan, perawatan, dan kunjungan ke dokter hewan.</li>
                    <li>Selalu minta informasi tentang kesehatan hewan, termasuk dokumen, sertifikat vaksinasi, dan silsilahnya. Periksa apakah dokumen tersebut valid dan perhatikan riwayat perawatan medisnya sebelum membuat keputusan pembelian.</li>
                    <li>Mintalah ID penjual dan buatlah kontrak tertulis dengan mereka untuk memastikan kedua belah pihak memahami persyaratan dan kondisi transaksi. Anda dapat mendownload kontrak di <a class="informasi_kontak_link" href="data/template/informasi/kontak_belihewan.pdf" data-cpop="false" download>Sini</a>.</li>
                </ul>
            </div>

            <div class="section_informasi">
                <h2>Tips untuk Penjual:</h2>
                <ul>
                    <li>Berikan informasi sebanyak mungkin tentang diri Anda dan hewan yang Anda jual. Posting foto hewan Anda sebanyak mungkin untuk memberikan gambaran yang jelas kepada calon pembeli.</li>
                    <li>Pastikan pembeli dapat dipercaya dan memiliki keahlian serta idealnya pengalaman sebelumnya dalam merawat hewan. Ini akan membantu memastikan bahwa hewan Anda akan ditempatkan di tangan yang tepat.</li>
                    <li>Serahkan dokumen yang sah, termasuk sertifikat kesehatan, catatan vaksinasi, dan silsilah hewan, kepada pembeli. Buatlah kontrak tertulis dengan pembeli untuk melindungi kedua belah pihak. Anda dapat mendownload kontrak di <a class="informasi_kontak_link" href="data/template/informasi/kontak_belihewan.pdf" data-cpop="false" download>Sini</a>.</li>
                </ul>
            </div>
        </div>
    ';

    include '../base.php';