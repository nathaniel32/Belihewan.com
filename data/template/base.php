<?php
    require 'data/GoogleAuth/autoload.php';

    use League\OAuth2\Client\Provider\Google;
    
    $clientID = 'xxxx';
    $clientSecret = 'xxx';
    $redirectUrl = "https://$domain/";

    $provider = new Google([
        'clientId'     => $clientID,
        'clientSecret' => $clientSecret,
        'redirectUri'  => $redirectUrl,
    ]);
    try {
        $authUrl = $provider->getAuthorizationUrl();
        
        if(!$UserToken){
            if (isset($_GET['code'])) {
                $token = $provider->getAccessToken('authorization_code', [
                    'code' => $_GET['code']
                ]);
        
                $resourceOwner = $provider->getResourceOwner($token);
                $userDetails = $resourceOwner->toArray();
        
                //----------------------------------------------- safe in db und give cookie!
                $dbGoogleAuth = auth_google($connect, $userDetails);

                if($dbGoogleAuth["Success"]){
                    $getMessage = $dbGoogleAuth['Message'];
                }else{
                    header('Location: /?message=' . urlencode($dbGoogleAuth['Message']));
                }
            }
        }
    } catch (Exception $e) {
        header('Location: /');
    }
?>

<?php
    if(isset($_GET["message"])){
        $getMessage = htmlspecialchars($_GET["message"]);
    }
?>

<?php
    $navigation = getKategoriNestedTree($connect);
    $dataNavJson = json_decode(json_encode($navigation), true); // Mengubah JSON menjadi array asosiatif

    function buildHTMLNavParent($data){
        if (!empty($data)) {
            $resultHtml = "<ul class='carousel_control navbar_sub dropdown_container dropdown_item_parent'>";
            $resultHtml .= '<li class="navbar_link carousel_item">
                                <button class="navbar_link_text pop_kategori_btn">Semua Kategori</button>
                            </li>';
            foreach ($data as $category) {
                $thisLink = $category['link'];
                $resultHtml .= "<li class='navbar_link carousel_item dropdown_container_parent dropdown_item_child'>
                        <a class='navbar_link_text' href='$thisLink'>{$category['n_nd']}</a>";
                $resultHtml .= buildHTMLNavChild($category['c_nd']);
                $resultHtml .= "</li>";
            }
            $resultHtml .= '</ul>';
            return $resultHtml;
        }else{
            return null;
        }
    }

    function buildHTMLNavChild($data) {
        if (!empty($data)) {
            $resultHtml = '<ul class="dropdown_container_child dropdown_item_parent">';
            foreach ($data as $category) {
                $thisLink = $category['link'];
                
                $resChild = buildHTMLNavChild($category['c_nd']);
                $resultHtml .= "
                    <li class='dropdown_container_parent dropdown_item_child'>
                        <span class='dropdown_item_main'>
                            <a href='$thisLink'>{$category['n_nd']}</a>
                            ". ($resChild ? '<span class="dropdown_container_expand">»</span>' : null) ."
                        </span>
                        $resChild
                    </li>";
            }
            $resultHtml .= '</ul>';
            return $resultHtml;
        }else{
            return null;
        }
    }

    $htmlNav = buildHTMLNavParent($dataNavJson);
?>

<!DOCTYPE html>
<html lang="id-ID">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title><?php echo $title?></title>
        <script src='/data/assets/javascript/head.js'></script>
        <?php echo $headData?>

        <meta name="theme-color" content="#EEE8E8">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="HandheldFriendly" content="True">
        <meta name="copyright" content="©2024 BeliHewan. All rights reserved.">
        <meta property="og:site_name" content="Beli Hewan">
        <meta property="og:type" content="website">
        <meta property="og:locale" content="id_ID">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:site" content="@belihewan">
        <meta name="twitter:creator" content="@belihewan">

        <link rel="stylesheet" href="/data/assets/css/base.css">

        <link rel="icon" href="/data/assets/image/logo/favicon.ico" sizes="32x32" type="image/x-icon">
        <link rel="manifest" href="/data/assets/image/logo/manifest/manifest.json">
        <link rel="apple-touch-icon" sizes="144x144" href="/data/assets/image/logo/manifest/icons/icon-144x144.png">
        <link rel="shortcut icon" type="image/png" href="/data/assets/image/logo/manifest/icons/icon-192x192.png">
        <link rel="mask-icon" href="/data/assets/image/logo/manifest/icons/safari-pinned-tab.svg" color="#EEE8E8">
        <meta name="msapplication-TileColor" content="#b5bcc4">

        <script type="application/ld+json">
        {
            "@context" : "https://schema.org",
            "@type" : "WebSite",
            "name" : "Beli Hewan",
            "url" : "https://<?php echo $domain ?>",
            "potentialAction": {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": "https://<?php echo $domain ?>/kategori?cari={search_term_string}"
                },
                "query-input": "required name=search_term_string"
            }
        }
        </script>

        <script type="application/ld+json">
        {
            "@context": "https://schema.org/",
            "@type": "Organization",
            "name": "Beli Hewan",
            "url": "https://<?php echo $domain ?>",
            "logo": "https://<?php echo $domain ?>/data/assets/image/logo/favicon.ico"
        }
        </script>

        <script>
            const authUrlGoole = "<?php echo $authUrl?>";
            const domain = "<?php echo $domain?>";
            //const kategoriAll = <php echo json_encode($navigation)>;
        </script>
    </head>
    <body>
        <header>
            <div class="header_main">
                <div class="headerbar container">
                    <a href="/" class="headerbar_logo"><img draggable='false' class="main_logo_img imgUnderLoad" src="/data/assets/image/logo/home.png" alt="beli hewan"></a>
                    <form class="headerbar_search" action="/kategori" method="GET" id="search_form">
                        <div class="input_search_container">
                            <input type="text" class="search_input_form" name="cari" aria-label="cari" id="search_input" autocomplete="off">
                            <div class="dropdown_search_item" id="search_dropdown_container"></div>
                        </div>
                        <button class="btn" onclick="showPopupLoading()"><img draggable='false' class="search_icon" src="/data/assets/image/logo/icon/search.svg" alt="cari"></button>
                    </form>

                    <div class="headerbar_btn dropdown_container container_sub_dropdown">
                        <button id="pasangIkanBtn" class="btn">Pasang Iklan</button>
                        <div class="dropdown_container_parent" id="profileBtn"></div>
                        <button id="logControlBtn" class="btn">Login</button>
                    </div>
                </div>

                <nav class="navbar">
                    <div class='carousel_container navbar_container container'>
                        <!-- <ul class='carousel_control navbar_sub dropdown_container dropdown_item_parent'> -->
                            <?php echo $htmlNav?>
                        <!-- </ul> -->
                        <button class='carousel_item_button_left carousel_button' style='display: none;'>❮</button>
                        <button class='carousel_item_button_right carousel_button'>❯</button>
                    </div>
                </nav>
            </div>
            <div id="infoMsg_container">
                <div id="infoMsg" class="container">
                    <noscript>Anda telah menonaktifkan JavaScript. Halaman ini memerlukan JavaScript.</noscript>
                </div>
            </div>
        </header>
        <div class="main_container">
            <div id="popupcontainer">
                <div id="popupcontrol">
                    <span id="closePopupDisplayBtn">✖️</span>
                    <div id="popupDataContainer"></div>
                </div>
            </div>
            <script src="/data/template/base.js"></script>
            <?php echo $main?>
        </div>
        <footer class="footer">
            <div class="container footer_control">
                <div class="footerLinkContainer">
                    <ul class="footerLinkItemContainer">
                        <li><a href="/about">About</a></li>
                        <li><a href="/faq">FAQ</a></li>
                        <li><a href="/disclaimer">Disclaimer</a></li>
                    </ul>
                    <ul class="footerLinkItemContainer">
                        <li><a href="/contact">Kontak</a></li>
                        <li><a href="/tips">Tips</a></li>
                        <li><a href="/privacy">Privasi</a></li>
                    </ul>
                </div>
            </div>
            <div class="copyRightContainer">
                <p>© 2024 BeliHewan. All rights reserved.</p>
            </div>
        </footer>
        <script>
            if('serviceWorker' in navigator){
                window.addEventListener('load', () => {
                    navigator.serviceWorker
                        .register('/sw_site.js')
                        .then(reg => console.log('Aplikasi Aktiv'))
                        .catch(err => console.log("Aplikasi Error!"))
                });
            }
        </script>
        <?php
            if(isset($getMessage)){
                echo "<script>
                    setInfoMsg('$getMessage', 4);
                </script>";
            }
        ?>
    </body>
</html>