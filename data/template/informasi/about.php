<?php
    include '../data/database/conn.php'; 
    include '../data/function.php';

    $title = "About";
    
    $metaTitle = "Tentang $domain";
    $metaDesc = "Tentang Kami $domain";
    $metaLink = "https://$domain/about";
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
            
            <h1 class="judul_page">Tentang belihewan.com</h1>
        
            <p>belihewan.com adalah platform daring yang didedikasikan untuk memfasilitasi transaksi jual-beli hewan peliharaan & hewan ternak secara aman dan mudah. Didirikan dengan tujuan untuk menyediakan tempat bagi para pecinta hewan & perternak untuk menemukan dan menjual hewan.</p>
        
            <div class="section_informasi">
                <h2>Visi Kami</h2>
                <ul>
                    <li>Visi kami adalah menciptakan komunitas yang peduli terhadap hewan, di mana hewan diperlakukan dengan hormat dan mendapatkan perawatan yang baik sesuai dengan kebutuhan mereka.</li>
                    <li>Kami ingin memberikan solusi yang memudahkan orang-orang dalam mencari hewan yang sesuai dengan gaya hidup dan preferensi mereka, sambil mempromosikan kesadaran akan kesejahteraan hewan.</li>
                </ul>
            </div>
        
            <div class="section_informasi">
                <h2>Misi Kami</h2>
                <ul>
                    <li>Kami berkomitmen untuk membantu pemilik hewan dalam mencari rumah yang aman dan menyenangkan bagi hewan mereka yang tidak dapat mereka jaga lagi atau yang membutuhkan pemilik baru.</li>
                    <li>Kami menyediakan platform yang aman dan terpercaya bagi para penjual dan pembeli hewan untuk melakukan transaksi dengan percaya diri.</li>
                    <li>Kami berupaya untuk meningkatkan kesadaran tentang kesejahteraan hewan dan pentingnya perlindungan terhadap hewan.</li>
                    <li>Kami menyediakan sumber informasi yang berharga tentang perawatan hewan, kesehatan hewan, dan topik terkait lainnya untuk membantu pemilik hewan dalam memberikan perawatan terbaik untuk hewan mereka.</li>
                </ul>
            </div>
        
            <p>Terima kasih telah menggunakan belihewan.com!</p>
        </div>
    ';

    include '../base.php';