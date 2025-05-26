<?php

include 'data/database/conn.php'; 
include 'data/function.php';

$id = $_GET["id"];

$query = "  SELECT 
                iklan.id_k,
                iklan.id_i,
                id_r,
                judul, 
                harga, 
                ketharga, 
                iklan.alamat, 
                tanggal_post, 
                umur, 
                jenis_kelamin, 
                deskripsi,
                keyword,
                iklan.nomor_wa,
                iklan.nomor_tlp,
                iklan.email,
                viewer,
                warna.nama as warna,
                user.nama as username,
                user.user_img,
                user.id_u
            FROM iklan
            JOIN kategori ON iklan.id_k = kategori.id_k
            JOIN user ON iklan.id_u = user.id_u
            LEFT JOIN warna ON iklan.id_w = warna.id_w
            WHERE id_i = :this_idi";
$statement = $connect->prepare($query);
$statement->bindParam(":this_idi", $id, PDO::PARAM_STR);
$res = $statement->execute();

if ($res > 0) {
    $rowCount = $statement->rowCount();
    if ($rowCount > 0) {
        $row = $statement->fetch(PDO::FETCH_ASSOC);
        $id_k = $row["id_k"];
        $id_i = $row["id_i"];
        $judul = $row["judul"];
        $hargaNoformat = $row["harga"];
        $harga = number_format($hargaNoformat, 0, ',', '.');
        $ketharga = $row["ketharga"] ? "Nego" : null;
        $alamat = $row["alamat"] ? $row["alamat"] : null;
        //$tanggal_post = terjemahkan_tanggal("%A, %e %B %Y %H:%M WIB", $row["tanggal_post"]);
        $tanggal_post = terjemahkan_tanggal("%A, %e %B %Y", $row["tanggal_post"]);
        $umur = $row["umur"] ? $row["umur"] : null;
        $jenis_kelamin = $row["jenis_kelamin"] ? ($row["jenis_kelamin"] == 1 ? "Jantan" : "Betina") : null;
        $deskripsiOri = $row["deskripsi"] ? $row["deskripsi"] : null;
        $deskripsi = $row["deskripsi"] ? str_replace("\n", '<br>', str_replace('  ', ' &nbsp;', $row["deskripsi"])) : null;
        $warna = $row["warna"] ? $row["warna"] : null;
        $idWilayah = $row["id_r"];
        $userImg = $row["user_img"] ? $row["user_img"] : "/data/assets/image/logo/icon/profile.svg";
        $username = $row["username"];
        $id_u = $row["id_u"];
        $email = $row["email"] ? "<div class='dataIklanContainer dataUserContainer'><span class='dataIklanTitle'>Email</span><span class='dataIklanIsi'>". $row["email"] ."</span></div>": null;
        $no_tlp = $row["nomor_tlp"] ? "<div class='dataIklanContainer dataUserContainer'><span class='dataIklanTitle'>No Telefon</span><span class='dataIklanIsi'>". $row["nomor_tlp"] ."</span></div>": null;
        $no_wa = $row["nomor_wa"] ? "<a rel='external noopener noreferrer' data-cpop='false' target='_blank' class='wa_linkBtn' href='https://wa.me/". $row["nomor_wa"] ."?text=". urlencode("Saya tertarik dengan iklan Anda $judul yang Anda post di $domain") ."'><img class='imgUnderLoad' draggable='false' src='/data/assets/image/logo/icon/whatsapp.png' alt='chat whatsapp'></a>" : null;
        $viewer = $row["viewer"];

        if($umur || $jenis_kelamin || $warna){
            $iklan_ket_container = "<div class='iklan_ket_container'>
                ". ($umur ? "<div class='dataIklanContainer'><span class='dataIklanTitle'>Umur</span><span class='dataIklanIsi'>$umur Bulan</span></div>" : null) ."
                ". ($jenis_kelamin ? "<div class='dataIklanContainer'><span class='dataIklanTitle'>Jenis Kelamin</span><span class='dataIklanIsi'>$jenis_kelamin</span></div>" : null) ."
                ". ($warna ? "<div class='dataIklanContainer'><span class='dataIklanTitle'>Warna</span><span class='dataIklanIsi' itemprop='color'>$warna</span></div>" : null) ."
            </div>";
        }

        if($row["keyword"]){
            $hashtag_lines_meta = explode("#", $row["keyword"]);
            $cleaned1_hashtags_meta = array_map('trim', $hashtag_lines_meta);
            $cleaned2_hashtags_meta = array_filter($cleaned1_hashtags_meta, 'strlen');
            
            $keyword_meta = '<meta name="keywords" content="'.  implode(', ', $cleaned2_hashtags_meta) .'">';
        }
    }else{
        echo "No Data!";
        header("HTTP/1.0 404 Not Found");
        header("Location: /kategori?cari=". $_GET["name"]);
        exit;
    }
}else{
    echo "Database Error!";
    header("HTTP/1.0 500 Internal Server Error");
    header("Location: /500");
    exit;
}

function imgIklan($connect, $id){
    $query = "  SELECT * FROM foto WHERE id_i = :this_idi ORDER BY id_f";
    $statement = $connect->prepare($query);
    $statement->bindParam(":this_idi", $id, PDO::PARAM_STR);
    $res = $statement->execute();
    if ($res > 0) {
        $rowCount = $statement->rowCount();
        if ($rowCount > 0){
            return $statement->fetchAll(PDO::FETCH_ASSOC);
        }else{
            return null;
        }
    }else{
        return null;
    }
}

$imgsArray = imgIklan($connect, $id);

if($imgsArray){

    $iklanImgAll = null;
    
    foreach($imgsArray as $imgArray){
        $idi = $imgArray["id_i"];
        $nama = $imgArray["nama"];
        $iklanImgAll .= "<img class='slide iklan_image imgUnderLoad' src='/data/assets/image/iklan/$idi/$nama' itemprop='image' alt='$judul'>";
    }

    $imgPathMeta = 'data/assets/image/iklan/'. $imgsArray[0]["id_i"] .'/' . $imgsArray[0]["nama"];
}else{
    $iklanImgAll = "<img class='slide iklan_image imgUnderLoad' src='/data/assets/image/logo/icon/nophoto.jpg' alt='$judul'>";

    $imgPathMeta = 'data/assets/image/logo/icon/nophoto.jpg';
}

function terjemahkan_tanggal($format, $tanggal_waktu) {
    $hari_en = array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
    $hari_id = array('Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu');
    $bulan_en = array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
    $bulan_id = array('Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember');

    $format = str_replace('%A', $hari_id[date('w', $tanggal_waktu)], $format);
    $format = str_replace('%B', $bulan_id[date('n', $tanggal_waktu) - 1], $format); // Perbaikan indeks array
    $format = str_replace('%Y', date('Y', $tanggal_waktu), $format);
    $format = str_replace('%e', date('j', $tanggal_waktu), $format);
    $format = str_replace('%H', date('H', $tanggal_waktu), $format);
    $format = str_replace('%M', date('i', $tanggal_waktu), $format);
    
    return $format;
}

function getWilayahLevel($idwi){
    global $connect;
    $query = "WITH RECURSIVE hierarchy AS (
            SELECT *, 1 AS level
            FROM wilayah
            WHERE id_wi = ?
            UNION ALL
            SELECT w.*, h.level + 1
            FROM wilayah w
            INNER JOIN hierarchy h ON w.id_wi = h.subid
        )
        SELECT * FROM hierarchy ORDER BY level ASC;
    ";
    $bindValuesArray[] = array('value' => $idwi, 'data_type' => PDO::PARAM_STR);

    return databaseExecute($connect, $query, $bindValuesArray);
}

function getWilayahPHP($wilayahArray){
    $result = null;
    $indexWilayah = 1;
    foreach ($wilayahArray as $row) {
        $nama = $row['nama'];

        if($indexWilayah == 1 && count($wilayahArray) > 1){
            $result .= "
                <span itemprop='addressLocality'>$nama</span>
            ";
        }else{
            $result .= "
                <span itemprop='addressRegion'>$nama</span>
            ";
        }

        if($indexWilayah < count($wilayahArray)){
            $result .= '<span>-</span>';
        }

        $indexWilayah++;
    }

    $result .= '
        <meta itemprop="addressCountry" content="Indonesia">
    ';

    return $result;
}

$levelLokasiArray = getWilayahLevel($idWilayah);
//print_r($levelLokasiArray);
//echo "<br><br>";

$rows_path = getPathKategori($connect, $id_k);
//print_r($rows_path);
//echo "<br><br>";

$id_k_values = array_map(function($item) {
    return $item['id_k'];
}, $rows_path);

if(count($id_k_values) > 1){
    $id_k_values = array_slice($id_k_values, 1);
}

//print_r($id_k_values);

$breadCrumbPath = getBreadCrumbListPHP($rows_path, $judul);
$lokasiWilayahHtml = getWilayahPHP($levelLokasiArray);

$title = $judul;
$headData = "";

$metaTitle = "Jual Beli $title di $domain";
$metaDesc = $deskripsiOri ? $deskripsiOri : "Jual Beli $title di $domain, temukan $title kesayangan anda!";
$metaLink = "https://$domain/iklan/$id_i/" . myurlencode($judul);
$metaImg = "https://$domain/$imgPathMeta";
$headData = '
    <link rel="canonical" href="'. $metaLink .'">
    <meta name="robots" content="index, follow">
    <meta name="description" content="'. $metaDesc .'">
    '. (isset($keyword_meta) ? $keyword_meta : null) .'
    <meta property="og:title" content="'. $metaTitle .'">
    <meta property="og:description" content="'. $metaDesc .'">
    <meta property="og:image" content="'. $metaImg .'">
    <meta property="og:url" content="'. $metaLink .'">
    <meta name="twitter:title" content="'. $metaTitle .'">
    <meta name="twitter:description" content="'. $metaDesc .'">
    <meta name="twitter:image" content="'. $metaImg .'">
';

$main = "
<link rel='stylesheet' href='/data/assets/css/iklan.css'>
<div class='iklan_container'>
    <div class='shareContainer'>
        <div class='share-buttons'>
            <button class='share-button facebook' aria-label='Share on Facebook'>
                <img class='imgUnderLoad' draggable='false' src='/data/assets/image/logo/icon/facebook.svg' alt='Facebook'>
                <span class='share-text'>Facebook</span>
            </button>
            <button class='share-button twitter' aria-label='Share on Twitter'>
                <img class='imgUnderLoad' draggable='false' src='/data/assets/image/logo/icon/twitter.svg' alt='Twitter'>
                <span class='share-text'>Twitter</span>
            </button>
            <!--<button class='share-button linkedin' aria-label='Share on LinkedIn'>
                <img class='imgUnderLoad' draggable='false' src='/data/assets/image/logo/icon/facebook.svg' alt='LinkedIn'>
                <span class='share-text'>LinkedIn</span>
            </button>
            <button class='share-button pinterest' aria-label='Share on Pinterest'>
                <img class='imgUnderLoad' draggable='false' src='/data/assets/image/logo/icon/facebook.svg' alt='Pinterest'>
                <span class='share-text'>Pinterest</span>
            </button>-->
            <button class='share-button mail' aria-label='Share on Mail'>
                <img class='imgUnderLoad' draggable='false' src='/data/assets/image/logo/icon/mail.svg' alt='Mail'>
                <span class='share-text'>Mail</span>
            </button>
            <button class='share-button reddit' aria-label='Share on Reddit'>
                <img class='imgUnderLoad' draggable='false' src='/data/assets/image/logo/icon/reddit.svg' alt='Reddit'>
                <span class='share-text'>Reddit</span>
            </button>
            <button class='share-button whatsapp' aria-label='Share on WhatsApp'>
                <img class='imgUnderLoad' draggable='false' src='/data/assets/image/logo/icon/whatsapp.svg' alt='WhatsApp'>
                <span class='share-text'>WhatsApp</span>
            </button>
        </div>
    </div>

    <div class='breadCrumbContainer' itemscope itemtype='https://schema.org/BreadcrumbList'>". $breadCrumbPath ."</div>
    <div class='isi_controller' itemscope itemtype='https://schema.org/Product'>
        <meta itemprop='category' content='". getKategoriName($connect, $id_k, 1) ."'>
        <meta itemprop='name' content='$judul'>
        <div class='isi_container'>
            <div class='iklan_carousel_container'>
                <div class='container_iklan_image'>
                    <div class='control_iklan_image'>
                        ". $iklanImgAll ."
                    </div>
                </div>
                <button class='prevBtn_iklan_carousel btn btn_iklan_carousel'><span>&#10094;</span></button>
                <button class='nextBtn_iklan_carousel btn btn_iklan_carousel'><span>&#10095;</span></button>
                <div class='no_image'>
                    <span id='NoImgCarouselIklan'></span>/<span id='NoAllImgCarouselIklan'></span>
                </div>
            </div>
            <div class='iklan_ket_container' itemprop='offers' itemscope itemtype='https://schema.org/Offer'>
                <meta itemprop='price' content='". $hargaNoformat ."'>
                <meta itemprop='priceCurrency' content='IDR'>
                <link itemprop='url' href='$metaLink'>
                <link itemprop='availability' href='https://schema.org/InStock'>
                <h1 itemprop='name' class='iklan_judul'>$judul</h1>
                <div class='iklan_harga_container'>
                    <span class='iklan_harga_nr'>Rp $harga</span> ". ($ketharga ? "<span class='iklan_harga_ket'>$ketharga</span>" : null) ."
                </div>
                <div class='iklanTanggalViewContainer'>
                    <div class='iklan_tanggal'>$tanggal_post</div>
                    <div class='iklan_view'><img class='imgUnderLoad' draggable='false' src='/data/assets/image/logo/icon/view.svg' alt='view'> $viewer</div>
                </div>
                <div class='iklan_lokasi' itemscope itemprop='availableAtOrFrom' itemtype='https://schema.org/Place'>
                    <img class='imgUnderLoad' draggable='false' src='/data/assets/image/logo/icon/location.svg' alt='location'>
                    
                    <div class='iklan_text_lokasi' itemscope itemprop='address' itemtype='https://schema.org/PostalAddress'>
                        ". ($alamat ? "<span class='iklan_lokasi_alamat' itemprop='streetAddress'>$alamat</span>" : null) ."
                        
                        <div class='iklan_lokasi_daerah'>
                            $lokasiWilayahHtml
                        </div>
                    </div>
                </div>
                <div itemprop='seller' itemscope itemtype='https://schema.org/Person'>
                    <meta itemprop='name' content='$username'>
                </div>
            </div>
            ". (isset($iklan_ket_container) ? $iklan_ket_container : null) ."
            <div class='iklan_ket_container'>
                <h2>Deskripsi</h2>
                <p class='iklan_deskripsi' itemprop='description'>$deskripsi</p>
            </div>
        </div>
        <div class='kontak_container'>
            <div class='user_container'>
                <h2>Kontak</h2>
                <div class='dataUserProfile'>
                    <a class='dataIklanContainer dataUserContainer' href='/profile?user=$id_u'>
                        <div class='dataIklanTitle'>
                            <div class='profile_image_container'>
                                <img class='imgUnderLoad' draggable='false' src='$userImg' alt='profile image'>
                            </div>
                        </div>
                        <span class='iklanUsername'>$username</span>
                    </a>
                    $email
                    $no_tlp
                </div>
                <div class='iklanClientContainer'>
                    $no_wa
                    <div class='wishBtnContainer'><button id='wishlistIklanBtn' class='btn'>Wishlist</button></div>
                    <div class='chatBtnContainer'><button id='chatIklanBtn' class='btn'>Chat</button></div>
                    <div class='reportBtnContainer'><button id='repotIklanBtn' class='btn'>Laporkan Iklan</button></div>
                </div>
            </div>
        </div>
    </div>
    <div>
        <div id='listRowElements'></div>
        <div id='listAllItemContainer' class='listAllItemControl'></div>
        <div class='item_call_container'>
            <button id='itemCall' class='btn'>More</button>
        </div>
    </div>
</div>
<script>let getIdkArray = ". json_encode($id_k_values) ."; let getIdi = '$id_i';</script>
<script src='/data/template/iklan.js'></script>
";

include 'base.php';