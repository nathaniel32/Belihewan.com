<?php
    include '../data/database/conn.php'; 
    include '../data/function.php';

    $getUserId = $_GET["user"] ?? null;

    if($getUserId){
        $query= "SELECT id_u, nama, user_img FROM user WHERE id_u = ?";

        $bindValuesArray[] = array('value' => $getUserId, 'data_type' => PDO::PARAM_STR);
        $databaseRes = databaseExecute($connect, $query, $bindValuesArray);
    
        if($databaseRes){
            $idu = $databaseRes[0]["id_u"];
            //$email = $databaseRes[0]["email"];
            $username = $databaseRes[0]["nama"];
            //$noWa = $databaseRes[0]["nomor_wa"];
            //$noTlp = $databaseRes[0]["nomor_tlp"];
            //$idWi = $databaseRes[0]["id_wi"];
            //$alamat = $databaseRes[0]["alamat"];
            //$role = $databaseRes[0]["urole"];
            $userImg = $databaseRes[0]["user_img"] ? $databaseRes[0]["user_img"] : "/data/assets/image/logo/icon/profile.svg";
            //$logType = $databaseRes[0]["log_type"];

            $title = $username . " - Beli Hewan";
    
            $metaTitle = $title;
            $metaDesc = "Lihat iklan dari $username di belihewan.com";
            $metaLink = 'https://'. $domain .'/profile?user=' . $idu;
            $metaImg = "https://$domain/data/assets/image/logo/sociallogo.png";
    
            $headData = '
                <link rel="canonical" href="'. $metaLink .'">
                <meta name="robots" content="index, follow">
                <meta name="description" content="'. $metaDesc .'">
                <meta name="keywords" content="profil, profile, user">
                <meta property="og:title" content="'. $metaTitle .'">
                <meta property="og:description" content="'. $metaDesc .'">
                <meta property="og:image" content="'. $metaImg .'">
                <meta property="og:url" content="'. $metaLink .'">
                <meta name="twitter:title" content="'. $metaTitle .'">
                <meta name="twitter:description" content="'. $metaDesc .'">
                <meta name="twitter:image" content="'. $metaImg .'">
            ';
            
            $main = '
                <link rel="stylesheet" href="/data/assets/css/user/profile.css">
                <div class="container">
                    <div class="profile_header_container">
                        <div class="profile_image_container">
                            <img draggable="false" src="'. $userImg .'" alt="profile image">
                        </div>
                        <h1>'. $username .'</h1>
                    </div>
                    <div id="listAllItemContainer" class="listAllItemControl"></div>
                    <div class="item_call_container">
                        <button id="itemCall" class="btn">More</button>
                    </div>
                </div>
                <script>const sendUser = "'. $idu .'"</script>
                <script src="/data/template/user/profile.js"></script>
            ';
    
            include '../base.php';
        }else{
            header('Location: /?message='. urlencode("User tidak ditemukan."));
        }
    }else{
        echo "get not valid";
        header('Location: /?message='. urlencode("Link tidak valid."));
    }