<?php
    include 'data/database/conn.php'; 
    include 'data/function.php';
    function getKategori($connect){
        ob_start();
            $query = "SELECT kst.imgpath, kst.id_k AS idc, kst.nama AS namac, knd.id_k AS idp, knd.nama AS namap FROM kategori kst
            JOIN kategori knd
            ON kst.subid = knd.id_k
            WHERE kst.subid IN (SELECT id_k FROM kategori WHERE subid IS NULL)
            LIMIT 15"; //AND id_k = '20ed0543-e6c7'
            $statement = $connect->prepare($query);
            $res = $statement->execute();
            
            if ($res > 0) {
                $rowCount = $statement->rowCount();
                if ($rowCount > 0) {
                    $index = 1;
                    $indexClassName = 'listfirst_img_3';
                    while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
                        $idc = $row['idc'];
                        $namac = myurlencode($row['namac']);
                        $idp = $row['idp'];
                        $namap = myurlencode($row['namap']);
                        $img = $row['imgpath'];

                        if($index == 6){
                            $indexClassName = 'listfirst_img_4';

                        }else if($index == 8){
                            $indexClassName = 'listfirst_img_5';

                        }else if($index == 10){
                            $indexClassName = 'listfirst_img_6';

                        }else if($index == 12){
                            $indexClassName = 'listfirst_img_7';

                        }else if($index == 14){
                            $indexClassName = 'listfirst_img_8';
                        }

                        echo "  
                                <a href='/kategori/$idp/$namap/$idc/$namac' class='$indexClassName'>
                                    <div class='listfirst_img_container'>
                                        <div class='listfirst_img_control'>
                                            <img draggable='false' class='imgUnderLoad' src='". ($img ? "/data/assets/image/logo/kategori/$img" : "/data/assets/image/logo/manifest/icons/icon-192x192.png") ."' alt='Kategori {$row['namac']}'>
                                        </div>
                                    </div>
                                    <div class='listfirst_kategori'>
                                        {$row['namac']}
                                    </div>
                                </a>
                            ";
                        $index ++;
                    }
                }else{
                    //echo "No Data!";
                }
            }else{
                //echo "Database Error!";
                header("HTTP/1.0 500 Internal Server Error");
                header("Location: /500");
                exit;
            }
        return ob_get_clean();
    }

    function get_adsbar($connect){
        $HTMLAdsBar = null;

        $query = "SELECT * FROM ads_bar";
        $statement = $connect->prepare($query);
        $res = $statement->execute();
        
        if ($res > 0) {
            $rowCount = $statement->rowCount();
            if ($rowCount > 0) {
                while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
                    $nama = $row['nama'];
                    $deskripsi = $row['deskripsi'];
                    $ads_link = $row['ads_link'];
                    $HTMLAdsBar .= "
                        <div class='carousel_item ads_bar_item_container'>
                            <a class='' href='". ($ads_link ?? '#') ."' target='_blank' data-cpop='false'>
                                <img draggable='false' class='imgUnderLoad' src='/data/assets/image/logo/ads/$nama' alt='". ($deskripsi ?? null) ."'>
                            </a>
                        </div>
                    ";
                }
                $HTMLAdsBar = "
                    <div class='carousel_container ads_bar_container'>
                        <div class='carousel_control ads_bar_control'>
                            $HTMLAdsBar
                        </div>
                        <button class='carousel_item_button_left carousel_button'>❮</button>
                        <button class='carousel_item_button_right carousel_button'>❯</button>
                    </div>
                ";
            }
        }

        return $HTMLAdsBar;
    }

    $title = "Jual Beli Hewan Terlengkap dan Terpercaya";

    $metaTitle = "Jual Beli Hewan di $domain Terlengkap dan Terpercaya";
    $metaDesc = "Jual Beli Hewan di $domain, temukan Hewan kesayangan anda!";
    $metaLink = "https://$domain";
    $metaImg = "https://$domain/data/assets/image/logo/sociallogo.png";
    $headData = '
        <link rel="canonical" href="'. $metaLink .'">
        <meta name="robots" content="index, follow">
        <meta name="description" content="'. $metaDesc .'">
        <meta name="keywords" content="Beli Hewan, Toko Hewan, Cari Hewan, Hewan Ternak, Hewan Peliharaan, Pet Store">
        <meta property="og:title" content="'. $metaTitle .'">
        <meta property="og:description" content="'. $metaDesc .'">
        <meta property="og:image" content="'. $metaImg .'">
        <meta property="og:url" content="'. $metaLink .'">
        <meta name="twitter:title" content="'. $metaTitle .'">
        <meta name="twitter:description" content="'. $metaDesc .'">
        <meta name="twitter:image" content="'. $metaImg .'">
    ';

    $main = "
        <link rel='stylesheet' href='/data/assets/css/home.css'>
        <div class='container'>
            <div class='listfirst'>

                ". get_adsbar($connect) ."

                <!--<h1 class='title_home'>Cari hewan kesayangan anda</h1>-->

                <div class='listfirst_kategori_container'>
                    " . getKategori($connect) . "
                    <div class='pop_kategori_btn'> <!--BUTTON-->
                        <div class='listfirst_img_container'><div class='listfirst_img_control'><img draggable='false' class='imgUnderLoad' src='/data/assets/image/logo/icon/menu.png' alt='Semua Kategori'></div></div>
                        <div class='listfirst_kategori'>
                            Semuanya
                        </div>
                    </div> <!--BUTTON-->
                </div>
            </div>
            <div id='listhome'></div>
            <div id='listAllItemContainer' class='listAllItemControl'></div>
        </div>

        <script src='/data/template/home.js'></script> ";

    include 'base.php';