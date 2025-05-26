<?php

$domain = $_SERVER['HTTP_HOST'];
$IP = $_SERVER['REMOTE_ADDR'];
$SECRET_KEY = "XXXXXXXXX";
$UserToken = $_COOKIE['token_user'] ?? null;
$expiration = time() + (60 * 60 * 24);
$admin_email = "xxxxxxx@yahoo.com";

function myurlencode($str) {
    $str = preg_replace('/[^a-zA-Z0-9 ]/', ' ', $str);
    $words = explode(" ", strtolower($str));
    $kebabCaseStr = implode("-", $words);
    return $kebabCaseStr;
}

function generateRandomString($lang) {
    $characters = '0123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ';
    $randomString = '';

    for ($i = 0; $i < $lang; $i++) {
        $randomString .= $characters[rand(0, strlen($characters) - 1)];
    }

    return $randomString;
}

function generateToken($payload) {
    global $SECRET_KEY;
    $header = base64_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload = base64_encode(json_encode($payload));
    $signature = base64_encode(hash_hmac('sha256', "$header.$payload", $SECRET_KEY, true));
    return "$header.$payload.$signature";
}

function verifyToken() {

    global $UserToken;

    if($UserToken){
        global $SECRET_KEY;
        list($header, $payload, $signature) = explode('.', $UserToken);
        $decodedPayload = json_decode(base64_decode($payload), true);
    
        if (isset($decodedPayload['expTokenUser']) && $decodedPayload['expTokenUser'] < time()) {
            return 2;
        }
    
        $expectedSignature = base64_encode(hash_hmac('sha256', "$header.$payload", $SECRET_KEY, true));
    
        if ($expectedSignature === $signature) {
            return $decodedPayload;
        } else {
            return 3;
        }
    }else{
        return 1;
    }
}

function verifyTokenApi() {
    $tokenApi = verifyToken();
    if($tokenApi === 1){
        $output = array("Success" => false, "Message" => "Anda Tidak Memiliki Akses!", "noAccess" => true);
        echo json_encode($output);
        exit;
    }else if($tokenApi === 2){
        $output = array("Success" => false, "Message" => "Sesi Sudah Expired, Tolong Login Ulang!", "unToken" => true);
        echo json_encode($output);
        exit;
    }else if($tokenApi === 3){
        $output = array("Success" => false, "Message" => "Tolong Login Ulang!", "unToken" => true);
        echo json_encode($output);
        exit;
    }else{
        return $tokenApi;
    }
}

function verifyTokenPage($isAdmin) {
    $tokenApi = verifyToken();
    if($tokenApi === 1){
        header("Location: /");
        exit;
    }else if($tokenApi === 2){
        //Sesi Sudah Expired, Tolong Login Ulang!
        header("Location: /");
        exit;
    }else if($tokenApi === 3){
        //"Tolong Login Ulang!
        header("Location: /");
        exit;
    }else if($isAdmin){
        if($tokenApi["roleUser"] != 3){
            header("Location: /401");
            exit;
        }
    }
}

/* function compressAndSaveAsJPEG($fotoData, $destination, $quality) {
    $image = @imagecreatefromstring($fotoData);

    if ($image === false) {
        return false;
    }

    $result = imagejpeg($image, $destination, $quality);

    imagedestroy($image);

    return $result;
} */

function compressAndSaveAsJPEG($fotoData, $destination, $quality) {
    $image = @imagecreatefromstring($fotoData);

    if ($image === false) {
        return false;
    }

    $imageWidth = imagesx($image);
    $imageHeight = imagesy($image);

    $watermark = imagecreatefrompng('../../../assets/image/logo/logourldark.png');
    $watermarkWidth = imagesx($watermark);
    $watermarkHeight = imagesy($watermark);

    $watermarkNewWidth = $imageWidth * 0.2 > 150 ? $imageWidth * 0.2 : 150;
    $watermarkNewHeight = ($watermarkNewWidth / $watermarkWidth) * $watermarkHeight;

    $newWatermark = imagecreatetruecolor($watermarkNewWidth, $watermarkNewHeight);
    imagealphablending($newWatermark, false);
    imagesavealpha($newWatermark, true);
    imagecopyresampled($newWatermark, $watermark, 0, 0, 0, 0, $watermarkNewWidth, $watermarkNewHeight, $watermarkWidth, $watermarkHeight);
    
    $posX = $imageWidth - $watermarkNewWidth - 10;
    $posY = $imageHeight - $watermarkNewHeight - 10;
    imagecopy($image, $newWatermark, $posX, $posY, 0, 0, $watermarkNewWidth, $watermarkNewHeight);

    $result = imagejpeg($image, $destination, $quality);

    imagedestroy($image);
    imagedestroy($watermark);
    imagedestroy($newWatermark);

    return $result;
}

function deleteDirectory($dir) {
    if (!is_dir($dir)) {
        return false;
    }

    $files = array_diff(scandir($dir), array('.', '..'));
    foreach ($files as $file) {
        $path = $dir . '/' . $file;
        if (is_dir($path)) {
            deleteDirectory($path);
        } else {
            unlink($path);
        }
    }

    return rmdir($dir);
}

function fetchCategories($connect, $parentId) {
    $query = "SELECT id_k, nama, imgpath FROM kategori WHERE subid " . ($parentId === null ? "IS NULL" : "= :id_k_parent");
    $statement = $connect->prepare($query);

    if ($parentId !== null) {
        $statement->bindParam(':id_k_parent', $parentId, PDO::PARAM_STR);
    }

    $res = $statement->execute();
    $categories = array();

    if ($res) {
        while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
            $category = array(
                "id_k" => $row["id_k"],
                "nama" => $row["nama"],
                "imgpath" => $row["imgpath"],
                "subcategories" => fetchCategories($connect, $row["id_k"])
            );
            $categories[] = $category;
        }
    } else {
        $output = array("Success" => false, "Message" => "Database Error!");
        echo json_encode($output);
        exit;
    }

    return $categories;
}

function getKategoriName($connect, $idk, $lvl){

    if($lvl == 0){
        $query = "SELECT nama FROM kategori WHERE id_k = :this_idk";
        $statement = $connect->prepare($query);
        $statement->bindParam(":this_idk", $idk, PDO::PARAM_STR);
        $res = $statement->execute();
    
        if ($res > 0) {
            $rowCount = $statement->rowCount();
            if ($rowCount > 0) {
                $row = $statement->fetch(PDO::FETCH_ASSOC);
                return $row['nama'];
            }else{
                return null;
            }
        }else{
            return null;
        }
    }else if($lvl == 1){
        $query = "SELECT nama FROM kategori WHERE id_k IN (SELECT subid FROM kategori WHERE id_k = :this_idk)";
        $statement = $connect->prepare($query);
        $statement->bindParam(":this_idk", $idk, PDO::PARAM_STR);
        $res = $statement->execute();
    
        if ($res > 0) {
            $rowCount = $statement->rowCount();
            if ($rowCount > 0) {
                $row = $statement->fetch(PDO::FETCH_ASSOC);
                return $row['nama'];
            }else{
                return null;
            }
        }else{
            return null;
        }
    }
}

function getPathKategori($connect, $thisId){
    /* $isChild = true;
    $rows = array();
    while($isChild){
        $query = "SELECT * FROM kategori WHERE id_k = :fsubid";
        $statement = $connect->prepare($query);
        $statement->bindParam(":fsubid", $thisId, PDO::PARAM_STR);
        $res = $statement->execute();
        if ($res > 0) {
            $rowCount = $statement->rowCount();
            if ($rowCount > 0) {
                $row = $statement->fetch(PDO::FETCH_ASSOC);
                $thisId = $row['subid'];
                //$rows[] = $row;
                array_unshift($rows, $row);
            }else{
                $isChild = false;
            }
        }else{
            $isChild = false;
        }
    }
    return $rows; */

    $query = "
            WITH RECURSIVE hierarchy AS (
                SELECT *, 1 AS level
                FROM kategori
                WHERE id_k = ?
                UNION ALL
                SELECT k.*, h.level + 1
                FROM kategori k
                INNER JOIN hierarchy h ON k.id_k = h.subid
            )
            SELECT * FROM hierarchy ORDER BY level DESC;
        ";
    $bindValuesArray[] = array('value' => $thisId, 'data_type' => PDO::PARAM_STR);

    return databaseExecute($connect, $query, $bindValuesArray) ?? [];
}

function safeLogUser($connect, $thisIdU){

    global $IP;

    $query = "INSERT INTO loguser (id_u, ip_l)
    SELECT :f_idu, :f_ip
    WHERE NOT EXISTS(
        SELECT 1
        FROM loguser
        WHERE id_u = :f_idu 
        AND ip_l = :f_ip
    )";

    $statement=$connect->prepare($query);
    $statement->bindParam(':f_idu', $thisIdU, PDO::PARAM_STR);
    $statement->bindParam(':f_ip', $IP, PDO::PARAM_STR);
    $res = $statement->execute();

    if ($res) {
        $rowCount = $statement->rowCount();
        if ($rowCount > 0) {
            return 1; //log baru
        }else{
            return 2; // log sudah pernah
        }
    }else{
        return null;
    }
}


//---------------------------------------------------------------------

function uploadSitemapToDir($fileName, $content){
    $uploadDir = '../../../../data/sitemap/';
    if (!file_exists($uploadDir)) {
        if (!mkdir($uploadDir, 0777, true)) {
            $output = array("Success" => false, "Message" => "Folder Error!");
            echo json_encode($output);
            exit;
        }
    }

    $filePath = $uploadDir . $fileName;

    if (file_exists($filePath)) {
        unlink($filePath);
    }
    
    if (file_put_contents($filePath, $content) !== false) {
        return 1;
    } else {
        return null;
    }
}

function index_sitemap(){
    global $domain;
    $dateModified = date('Y-m-d\TH:i:sP');
    
    $pages = array(
        array('url' => 'https://'. $domain .'/data/sitemap/sitemap_kategori.xml', 'modified' => $dateModified),
        array('url' => 'https://'. $domain .'/data/sitemap/sitemap_iklan.xml', 'modified' => $dateModified)
    );
    
    $content = '<?xml version="1.0" encoding="UTF-8"?>' . PHP_EOL;
    $content .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . PHP_EOL;
    
    foreach ($pages as $page) {
        $content .= '<url>' . PHP_EOL;
        $content .= '<loc>' . $page['url'] . '</loc>' . PHP_EOL;
        $content .= '<lastmod>' . $page['modified'] . '</lastmod>' . PHP_EOL;
        $content .= '</url>' . PHP_EOL;
    }
    
    $content .= '</urlset>';
    
    $fileName = 'sitemap_index.xml';

    return uploadSitemapToDir($fileName, $content);
}

function iklan_sitemap($connect){
    global $domain;
    $query = "SELECT id_i, judul, tanggal_post FROM iklan WHERE kondisi IS NULL";
    $statement = $connect->prepare($query);
    $statement->execute();
    $rowCount = $statement->rowCount();

    if ($rowCount > 0) {
        $pages = array();

        while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
            //$dateIklan = date('Y-m-d\TH:i:sP', strtotime($row['tanggal_post']));
            $dateIklan = date('c', $row['tanggal_post']);
            $id_i = $row['id_i'];
            $judul = myurlencode($row['judul']);
            $pages[] = array(
                "url" => "https://$domain/iklan/$id_i/$judul",
                "lastmod" => $dateIklan,
                "changefreq" => "weekly",
                "priority" => "1.0"
            );
        }

        $content = '<?xml version="1.0" encoding="UTF-8"?>' . PHP_EOL;
        $content .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . PHP_EOL;

        foreach ($pages as $page) {
            $content .= '<url>' . PHP_EOL;
            $content .= '<loc>' . $page['url'] . '</loc>' . PHP_EOL;
            $content .= '<lastmod>' . $page['lastmod'] . '</lastmod>' . PHP_EOL;
            $content .= '<changefreq>' . $page['changefreq'] . '</changefreq>' . PHP_EOL;
            $content .= '<priority>' . $page['priority'] . '</priority>' . PHP_EOL;
            $content .= '</url>' . PHP_EOL;
        }

        $content .= '</urlset>';

        $fileName = 'sitemap_iklan.xml';

        return uploadSitemapToDir($fileName, $content);
    } else {
        return null;
    }
}

function kategori_sitemap($connect){
    global $domain;
    $query = "SELECT * FROM kategori";
    $statement = $connect->prepare($query);
    $statement->execute();
    $rowCount = $statement->rowCount();

    if ($rowCount > 0) {
        $pages = array();

        $dateKategori = date('Y-m-d\TH:i:sP');

        while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
            $id_k = $row['id_k'];
            $rows_path = getPathKategori($connect, $id_k);
            
            $link = "https://$domain/kategori";
            foreach ($rows_path as $row_path) {
                $idk = $row_path['id_k'];
                $nama = $row_path['nama'];
                $nama_urlen = myurlencode($nama);
                $link .= "/$idk/$nama_urlen";
            }
            
            $pages[] = array(
                "url" => "$link",
                "lastmod" => $dateKategori,
                "changefreq" => "weekly",
                "priority" => "1.0"
            );
        }

        $content = '<?xml version="1.0" encoding="UTF-8"?>' . PHP_EOL;
        $content .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . PHP_EOL;

        foreach ($pages as $page) {
            $content .= '<url>' . PHP_EOL;
            $content .= '<loc>' . $page['url'] . '</loc>' . PHP_EOL;
            $content .= '<lastmod>' . $page['lastmod'] . '</lastmod>' . PHP_EOL;
            $content .= '<changefreq>' . $page['changefreq'] . '</changefreq>' . PHP_EOL;
            $content .= '<priority>' . $page['priority'] . '</priority>' . PHP_EOL;
            $content .= '</url>' . PHP_EOL;
        }

        $content .= '</urlset>';

        $fileName = 'sitemap_kategori.xml';

        return uploadSitemapToDir($fileName, $content);
    } else {
        return null;
    }
}

function lengthPassChecker($passwort){
    if(strlen($passwort) < 8){
        $message = 'Password minimal 8 huruf!';
        $output = array("Success" => false, "Message" => $message);
        echo json_encode($output);
        exit;
    }
}

function getBreadCrumbListPHP($this_rows_path, $current_name){
    $result = null;
    $indexBreadCrumb = 1;
    $link = null;
    foreach ($this_rows_path as $row) {
        $idk = $row['id_k'];
        $nama = $row['nama'];
        $nama_urlen = myurlencode($nama);
        $link .= "/$idk/$nama_urlen";
        $result .= '<span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">';
        $result .= "<meta itemprop='position' content='$indexBreadCrumb'>";
        $result .= "<a class='breadCrumbLink' itemprop='item' href='/kategori". $link ."'><span itemprop='name'>$nama</span></a>";
        $result .= '</span>';

        if($indexBreadCrumb < count($this_rows_path)){
            $result .= '<span class="backslashBreadCrumb">/</span>';
        }
        
        $indexBreadCrumb++;
    }

    if($current_name){
        $result .= '
            <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                <meta itemprop="position" content="'. $indexBreadCrumb .'">
                <meta itemprop="name" content="'. $current_name .'">
            </span>
        ';
    }

    return $result;
}

function sendMessage($thisconnect, $thisid_u, $thisid_ki, $thispesan){
    
    $id_p = uniqid();
    
    $query = "INSERT INTO pesan (id_p, id_ki, id_u, isi_text) VALUES (:id_p, :f_idki , :f_idu, :f_text)";

    $statement=$thisconnect->prepare($query);
    $statement->bindParam(':id_p', $id_p, PDO::PARAM_STR);
    $statement->bindParam(':f_idki', $thisid_ki, PDO::PARAM_STR);
    $statement->bindParam(':f_idu', $thisid_u, PDO::PARAM_STR);
    $statement->bindParam(':f_text', $thispesan, PDO::PARAM_STR);

    $res = $statement->execute();
    if ($res) {
        $rowCount = $statement->rowCount();
        
        if ($rowCount > 0) {
            return $id_p;
        }else{
            return null;
        }
    }else{
        return null;
    }
}

function sendMessageMail($thisconnect, $thisid_u, $id_p){
    global $admin_email;

    $query = "SELECT iklan.judul, user.nama, user.email, pesan.isi_text
    FROM pesan
    JOIN kontak_iklan ON pesan.id_ki = kontak_iklan.id_ki
    JOIN iklan ON kontak_iklan.id_i = iklan.id_i
    JOIN user ON iklan.id_u = user.id_u
    WHERE pesan.id_p = ?
    AND pesan.id_u = ?";

    $bindValuesArray[] = array('value' => $id_p, 'data_type' => PDO::PARAM_STR);
    $bindValuesArray[] = array('value' => $thisid_u, 'data_type' => PDO::PARAM_STR);

    $databaseRes = databaseExecute($thisconnect, $query, $bindValuesArray);
    if($databaseRes){
        $judulIklan = $databaseRes[0]["judul"];
        $pesan = $databaseRes[0]["isi_text"];
        $toNama = $databaseRes[0]["nama"];
        $toEmail = $databaseRes[0]["email"];

        $thisFromMail = "admin@belihewan.com";
        $thisFromName = "Informasi Beli Hewan";

        $thisReplyMail = $admin_email;

        $thisSubject = "Pesan Baru";
        $thisBody = "
            Hallo $toNama, <br>
            Iklan <b>'$judulIklan'</b> memiliki pesan baru. <br><br>
            Pesan: $pesan";

        $thisAltBody = "
            Hallo $toNama, 
            Iklan '$judulIklan' memiliki pesan baru.
            Pesan: $pesan";

        return sendMail($thisFromMail, $thisFromName, $toEmail, $toNama, $thisReplyMail, $thisSubject, $thisBody, $thisAltBody);
    }else{
        return null;
    }
}

function arrayImplodeDatabase($arr){
    return implode(',', array_fill(0, count($arr), '?'));
}

function databaseExecute($connect, $query, $bindValuesArray){
    $statement = $connect->prepare($query);

    if($bindValuesArray){
        foreach ($bindValuesArray as $key => $bind) {
            $statement->bindValue($key + 1, $bind['value'], $bind['data_type']);
        }
    }

    $res = $statement->execute();
    if ($res) {
        $rowCount = $statement->rowCount();
        if ($rowCount > 0) {
            $result = $statement->fetchAll(PDO::FETCH_ASSOC);
            return count($result) ? $result : 1;
        } else {
            return null;
        }
    } else {
        $connect->rollBack();
        $output = array("Success" => false, "Message" => "Database Error!");
        echo json_encode($output);
        exit;
    }
}

function uploadFotoIklan($connect, $fotoDataBlobs, $id_i){
    
    $uploadDir = "../../../assets/image/iklan/$id_i/";

    if (!file_exists($uploadDir)) {
        if (!mkdir($uploadDir, 0777, true)) {
            $connect->rollBack();
            $output = array("Success" => false, "Message" => "Folder Error!");
            echo json_encode($output);
            exit;
        }
    }

    $messageRes = null;

    foreach ($fotoDataBlobs as $index => $fotoDataBlob) {
        $fotoData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $fotoDataBlob));

        $currentNummer = $index + 1;

        if ($fotoData === false) {
            $messageRes .= "Foto $currentNummer : Gagal menguraikan data gambar <br>";
            continue;
        }

        $extension = $extension = substr($fotoDataBlob, strpos($fotoDataBlob, '/') + 1, strpos($fotoDataBlob, ';') - strpos($fotoDataBlob, '/') - 1);

        if (!in_array($extension, array("jpg", "jpeg", "png", "gif", "webp"))) {
            $messageRes .= "Foto $currentNummer : Ekstensi file tidak valid <br>";
            continue;
        }

        $fileName = uniqid() . '.jpg';

        $filePath = $uploadDir . $fileName;
        $quality = 50;

        if (compressAndSaveAsJPEG($fotoData, $filePath, $quality)) {
            $data1=array(":f_id_i"=>$id_i , ":f_nama"=>$fileName);

            $query1= "INSERT INTO foto (id_i, nama) VALUES (:f_id_i, :f_nama)";
            $statement1=$connect->prepare($query1);
            $res1 = $statement1->execute($data1);

            if ($res1) {
                $messageRes .= "Foto $currentNummer : berhasil diunggah <br>";
            }else{
                $messageRes .= "Foto $currentNummer : Gagal mengunggah ke database <br>";
            }
        } else {
            $messageRes .= "Foto $currentNummer : Gagal mengunggah ke folder <br>";
        }
    }

    return $messageRes;
}

function uploadFotoKategori($fotoDataBlob, $filePath){
    $fotoData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $fotoDataBlob));
    if ($fotoData !== false) {
        if (file_put_contents($filePath, $fotoData) !== false) {
            return 1;
        } else {
            return null;
        }
    }else{
        return null;
    }
}

function uploadAdminAds($fotoDataBlob, $filePath){
    $fotoData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $fotoDataBlob));
                
    if ($fotoData !== false) {
        if (file_put_contents($filePath, $fotoData) !== false) {
            return 1;
        }else{
            return null;
        }
    }else{
        return null;
    }
}

function getFotoName($fotoDataBlob){
    if($fotoDataBlob){
        $extension = substr($fotoDataBlob, strpos($fotoDataBlob, '/') + 1, strpos($fotoDataBlob, ';') - strpos($fotoDataBlob, '/') - 1);
        $fileName = uniqid() . '.' . $extension;
        if($fileName){
            return $fileName;
        }else{
            return null;
        }
    }else{
        return null;
    }
}

function auth_google($connect, $data){
    global $expiration;
    global $domain;

    $idu = "GL_" . $data["sub"];
    $email = $data["email"];
    $username = $data["name"];
    $userImg = $data["picture"];
    $logType = 1;

    $query= "SELECT * FROM user WHERE id_u = ?";

    $bindValuesArray[] = array('value' => $idu, 'data_type' => PDO::PARAM_STR);
    $databaseRes = databaseExecute($connect, $query, $bindValuesArray);

    if($databaseRes){
        $message_login = "Selamat datang $username.";

        $noWa_login = $databaseRes[0]["nomor_wa"];
        $noTlp_login = $databaseRes[0]["nomor_tlp"];
        $idWi_login = $databaseRes[0]["id_wi"];
        $alamat_login = $databaseRes[0]["alamat"];
        $role_login = $databaseRes[0]["urole"];

        $username_login = $databaseRes[0]["nama"];
        $userImg_login = $databaseRes[0]["user_img"];
        $logType_login = $databaseRes[0]["log_type"];

        if ($username_login != $username || $userImg_login != $userImg || $logType_login != $logType) {
            unset($bindValuesArray);

            $query= "UPDATE user SET nama = ?, user_img = ?, log_type = ? WHERE id_u = ?";
            
            $bindValuesArray[] = array('value' => $username, 'data_type' => PDO::PARAM_STR);
            $bindValuesArray[] = array('value' => $userImg, 'data_type' => PDO::PARAM_STR);
            $bindValuesArray[] = array('value' => $logType, 'data_type' => PDO::PARAM_INT);
            $bindValuesArray[] = array('value' => $idu, 'data_type' => PDO::PARAM_STR);

            $databaseRes = databaseExecute($connect, $query, $bindValuesArray);

            if($databaseRes){
                $message_login .= " Data berhasil di update!";
            }else{
                $message_login .= " Data gagal di update!";
            }
        }

        safeLogUser($connect, $idu);

        //$token = generateToken(['idUser' => $idu, 'emailUser' => $email, 'namaUser' => $username, 'noWaUser' => $noWa_login, 'noTlpUser' => $noTlp_login, 'wilayahUser' => $idWi_login, 'roleUser' => $role_login, 'expTokenUser' => $expiration, 'userImg' => $userImg, 'logType' => $logType]);
        //setcookie("token_user", $token, $expiration, "/", $domain, false, false);

        setUserCookie($idu, $email, $username, $noWa_login, $noTlp_login, $idWi_login, $alamat_login, $role_login, $userImg, $logType);

        $output = array("Success" => true, "Message" => $message_login);
    }else{
        unset($bindValuesArray);

        $noWa_signup = null;
        $noTlp_signup = null;
        $idWi_signup = null;
        $alamat_signup = null;
        $role_signup = 1;

        $query = "INSERT INTO user (id_u, nama, email, user_img, log_type, urole) VALUES (?, ?, ?, ?, ?, ?)";
        $bindValuesArray[] = array('value' => $idu, 'data_type' => PDO::PARAM_STR);
        $bindValuesArray[] = array('value' => $username, 'data_type' => PDO::PARAM_STR);
        $bindValuesArray[] = array('value' => $email, 'data_type' => PDO::PARAM_STR);
        $bindValuesArray[] = array('value' => $userImg, 'data_type' => PDO::PARAM_STR);
        $bindValuesArray[] = array('value' => $logType, 'data_type' => PDO::PARAM_INT);
        $bindValuesArray[] = array('value' => $role_signup, 'data_type' => PDO::PARAM_INT);

        $databaseRes = databaseExecute($connect, $query, $bindValuesArray);

        if($databaseRes){
            safeLogUser($connect, $idu);
            //$token = generateToken(['idUser' => $idu, 'emailUser' => $email, 'namaUser' => $username, 'noWaUser' => $noWa_signup, 'noTlpUser' => $noTlp_signup, 'wilayahUser' => $idWi_signup, 'roleUser' => $role_signup, 'expTokenUser' => $expiration, 'userImg' => $userImg, 'logType' => $logType]);
            //setcookie("token_user", $token, $expiration, "/", $domain, false, false);

            setUserCookie($idu, $email, $username, $noWa_signup, $noTlp_signup, $idWi_signup, $alamat_signup, $role_signup, $userImg, $logType);
            
            $output = array("Success" => true, "Message" => "Sign up berhasil! Selamat datang $username.");
        }else{
            $output = array("Success" => false, "Message" => "Gagal membuat account!");
        }
    }

    return $output;
}



function getWilayahNestedTree($connect) {
    $query = "SELECT * FROM wilayah ORDER BY subid, nama";

    $databaseRes = databaseExecute($connect, $query, null);

    if($databaseRes){
        //return $databaseRes;
        $items = array();
        foreach ($databaseRes as $row) {
            $items[$row['id_wi']] = array(
                'i_nd' => $row['id_wi'],
                'n_nd' => $row['nama'],
                's_nd' => $row['subid'],
                'c_nd' => array()
            );
        }

        $tree = array();
        foreach ($items as &$item) {
            if ($item['s_nd'] === null) {
                $tree[] = &$item;
            } else {
                $items[$item['s_nd']]['c_nd'][] = &$item;
            }
        }

        return $tree;
    }else{
        return null;
    }
}

function getKategoriNestedTree($connect) {
    $query = "SELECT * FROM kategori ORDER BY subid, nama";

    $databaseRes = databaseExecute($connect, $query, null);

    if($databaseRes){
        $items = array();
        foreach ($databaseRes as $row) {
            $formatedName = myurlencode($row['nama']);
            $items[$row['id_k']] = array(
                'i_nd' => $row['id_k'],
                'n_nd' => $row['nama'],
                's_nd' => $row['subid'],
                'link' => "/{$row['id_k']}/{$formatedName}",
                'c_nd' => array()
            );
        }

        function buildTree(&$items, $parentId = null, $parentLink = '') {
            $branch = array();
            foreach ($items as &$item) {
                if ($item['s_nd'] === $parentId) {
                    //$item['link'] = '/kategori' . $parentLink . $item['link'];
                    if ($parentLink === '') {
                        $item['link'] = '/kategori' . $item['link'];
                    } else {
                        $item['link'] = $parentLink . $item['link'];
                    }
                    $children = buildTree($items, $item['i_nd'], $item['link']);
                    if ($children) {
                        $item['c_nd'] = $children;
                    }
                    $branch[] = &$item;
                }
            }
            return $branch;
        }
        
        return buildTree($items, null, '');
    }else{
        return null;
    }
}

function printJsonKategori($ftype){
    global $connect;
    if($ftype == 1){
        $jsonData = getWilayahNestedTree($connect);
        $fileName = 'wilayah.json';
    }else{
        $jsonData = getKategoriNestedTree($connect);
        $fileName = 'kategori.json';
    }
    if($jsonData){
        $jsonData = json_encode($jsonData); //, JSON_PRETTY_PRINT
        $jsonPath = "../../../assets/javascript/json_data_storage/$fileName";
        if (file_put_contents($jsonPath, $jsonData)) {
            return "$fileName Berhasil dibuat!";
        } else {
            return null;
        }
    }else{
        return null;
    }
}

function setUserCookie($id, $email, $username, $nowa, $notlp, $idwi, $alamat, $role, $img, $logtype){
    global $domain;
    global $expiration;

    $token = generateToken(
        ['idUser' => $id,
        'emailUser' => $email,
        'namaUser' => $username,
        'noWaUser' => $nowa,
        'noTlpUser' => $notlp,
        'wilayahUser' => $idwi,
        'alamatUser' => $alamat,
        'roleUser' => $role,
        'userImg' => $img,
        'logType' => $logtype,
        'expTokenUser' => $expiration
    ]);
    setcookie("token_user", $token, $expiration, "/", $domain, false, false);
}