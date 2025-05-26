<?php
    include 'data/database/conn.php'; 
    include 'data/function.php';

    function getFilterKategori($connect){
        
        ob_start();

            if(isset($_GET["id"])){

                $query = "SELECT * FROM kategori WHERE subid = :this_idk";
                $statement = $connect->prepare($query);

                if(isset($_GET["kid"])){
                    
                    if(isset($_GET["ksubid"])){
                        $mainKategoriId = $_GET["kid"];

                        $kategoriChild1 = $_GET["kid"];
                        $kategoriChild2 = $_GET["ksubid"];
                    }else{
                        $mainKategoriId = $_GET["kid"];

                        $kategoriChild1 = $_GET["kid"];
                        $kategoriChild2 = null;
                    }
                }else{
                    $mainKategoriId = $_GET["id"];
                    
                    $kategoriChild1 = null;
                    $kategoriChild2 = null;
                }

                $statement->bindParam(":this_idk", $mainKategoriId, PDO::PARAM_STR);

            }else{
                $query = "SELECT * FROM kategori WHERE subid IN (SELECT id_k FROM kategori WHERE subid IS NULL)";
                $statement = $connect->prepare($query);
                $mainKategoriId = null;
                
                $kategoriChild1 = null;
                $kategoriChild2 = null;
            }
            
            $res = $statement->execute();

            if ($res > 0) {
                $rowCount = $statement->rowCount();
                if ($rowCount > 0) {
                    echo "<ul class='ulParent' id='filterKategoriContainer'>";
                    while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
                        $idparent = $row['id_k'];
                        $nameparent = $row['nama'];
                        $isCheckedP = '';
                        
                        if($kategoriChild1 == $idparent || $kategoriChild2 == $idparent){
                            $isCheckedP = "checked";
                        }
                        
                        echo "<li><label><input type='checkbox' class='option' data-parent='$idparent' data-value='$idparent' $isCheckedP>$nameparent</label>";
                            $query1 = "SELECT * FROM kategori WHERE subid = :this_subid";
                            $statement1 = $connect->prepare($query1);
                            $statement1->bindParam(":this_subid", $row['id_k'], PDO::PARAM_STR);
                            $res1 = $statement1->execute();
                            if ($res1 > 0) {
                                $rowCount1 = $statement1->rowCount();
                                if ($rowCount1 > 0) {
                                    echo "<ul class='ulChild'>";
                                    while ($row1 = $statement1->fetch(PDO::FETCH_ASSOC)) {
                                        $idchild = $row1['id_k'];
                                        $namechild = $row1['nama'];
                                        $isCheckedC = '';
                                        
                                        if($kategoriChild1 == $idchild || $kategoriChild1 == $idparent || $kategoriChild2 == $idparent || $kategoriChild2 == $idchild){
                                            $isCheckedC = "checked";
                                        }
                                        
                                        echo "<li><label><input type='checkbox' class='subOption' data-child='$idparent' data-value='$idchild' $isCheckedC>$namechild</label></li>";
                                    }
                                    echo "</ul>";
                                }else{
                                    //echo "No Data!";
                                }
                            }else{
                                echo "Database Error!";
                                header("HTTP/1.0 500 Internal Server Error");
                                header("Location: /500");
                                exit;
                            }
                        echo "</li>";
                    }
                    echo "</ul>";
                }else{
                    //echo "No Data!";
                }
            }else{
                echo "Database Error!";
                header("HTTP/1.0 500 Internal Server Error");
                header("Location: /500");
                exit;
            }
        return ob_get_clean();
    }

    function getWarna($connect){
        ob_start();
            $query = "SELECT * FROM warna ORDER BY nama";
            $statement = $connect->prepare($query);
            $res = $statement->execute();
            if ($res > 0) {
                $rowCount = $statement->rowCount();
                if ($rowCount > 0) {
                    while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
                        $id = $row['id_w'];
                        $name = $row['nama'];
                        echo "<option value='$id'>$name</option>";
                    }
                }
            }
        return ob_get_clean();
    }

    function getCanonical($connect, $id_k){
        $rows_path = getPathKategori($connect, $id_k);

        $link = null;
        foreach ($rows_path as $row) {
            $idk = $row['id_k'];
            $nama = $row['nama'];
            $nama_urlen = myurlencode($nama);
            $link .= "/$idk/$nama_urlen";
        }
        return $link;
    }

    if(isset($_GET["id"])){
        if(isset($_GET["kid"])){
            if(isset($_GET["ksubid"])){
                $baseKategoriId = $_GET["kid"];
            }else{
                $baseKategoriId = $_GET["kid"];
            }
        }else{
            $baseKategoriId = $_GET["id"];
        }
    }else{
        $baseKategoriId = null;
    }

    $currentID = isset($_GET["id"]) ? (isset($_GET["kid"]) ? (isset($_GET["ksubid"]) ? $_GET["ksubid"] : $_GET["kid"]) :$_GET["id"]) : null;

    $currentKategoriName = getKategoriName($connect, $currentID, 0);
    //----------------------------------------------------------------------- for seo

    $rows_path = getPathKategori($connect, $currentID);
        
    $breadCrumbPath = getBreadCrumbListPHP($rows_path, null);

    //------------------------------------------------------------------
    $title = $currentKategoriName ? "Jual Beli $currentKategoriName" : "Cari Hewan";

    $metaTitle = "Jual Beli $currentKategoriName di $domain";
    $metaDesc = "Jual Beli $currentKategoriName di $domain, temukan $currentKategoriName kesayangan anda!";
    $metaLink = 'https://'. $domain .'/kategori' . getCanonical($connect, $currentID);
    $metaImg = "https://$domain/data/assets/image/logo/sociallogo.png";

    $headData = '
        <link rel="canonical" href="'. $metaLink .'">
        <meta name="robots" content="index, follow">
        <meta name="description" content="'. $metaDesc .'">
        <meta name="keywords" content="jual '. $currentKategoriName .', beli '. $currentKategoriName .', cari '. $currentKategoriName .', toko '. $currentKategoriName .'">
        <meta property="og:title" content="'. $metaTitle .'">
        <meta property="og:description" content="'. $metaDesc .'">
        <meta property="og:image" content="'. $metaImg .'">
        <meta property="og:url" content="'. $metaLink .'">
        <meta name="twitter:title" content="'. $metaTitle .'">
        <meta name="twitter:description" content="'. $metaDesc .'">
        <meta name="twitter:image" content="'. $metaImg .'">
    ';
    
    $main = '
            <link rel="stylesheet" href="/data/assets/css/kategori.css">
            <div class="container_kategori">
                <div class="kategori">
                    <div class="slidebar">
                        <input type="checkbox" id="sideBarCheck" class="sideBarBtn">
                        <label for="sideBarCheck" class="sideBarCheckLabel sideBarBtn">
                            <span id="sideBarCheckBtn">❓</span>
                            <span id="sideBarCheckCancel">✖️</span>
                        </label>
                        <div class="filter_container">
                            <div class="filterTitle">Filter</div>
                            <div class="filterDataContainer">
                                <div>
                                    <div class="filterType">
                                        <label for="searchItem">Cari</label>
                                        <input class="form-control" id="searchItem" placeholder="Cari Nama" value="'. (isset($_GET["cari"]) ? htmlspecialchars($_GET["cari"]) : '') .'">
                                    </div>

                                    <div class="filterType">
                                        <label for="lokasiInput">Wilayah</label>
                                        <div id="filterResultLokasiContainer">
                                            <span id="lokasiItem"></span>
                                            <button id="lokasiDelete" class="btn">❌</button>
                                        </div>
                                        <button id="lokasiInput" class="btn">cari</button>
                                    </div>

                                    <div class="filterType">
                                        <label for="orderInput">Urutan</label>
                                        <select class="form-control" name="order" id="orderInput">
                                            <option value="">Urutan</option>
                                            <option value="1">Harga Termahal</option>
                                            <option value="2">Harga Termurah</option>
                                            <option value="3">Iklan Terbaru</option>
                                            <option value="4">Iklan Terpopuler</option>
                                        </select>
                                    </div>

                                    <div class="filterType">
                                        <label for="sexInput">Jenis kelamin</label>
                                        <select class="form-control" name="sex" id="sexInput">
                                            <option value="">Kelamin</option>
                                            <option value="1">Jantan</option>
                                            <option value="2">Betina</option>
                                        </select>
                                    </div>

                                    <div class="filterType">
                                        <label for="warnaInput">Warna</label>
                                        <select class="form-control" name="warna" id="warnaInput">
                                            <option value="">Warna</option>
                                            '. getWarna($connect) . '
                                        </select>
                                    </div>

                                    <div class="filterType">
                                        <label>Harga</label>
                                        <div class="hargaContainer">
                                            <input class="form-control" type="text" id="hargaMin" placeholder="Min">
                                            <input class="form-control" type="text" id="hargaMax" placeholder="Max">
                                        </div>
                                    </div>
                                </div>
                                '. getFilterKategori($connect) .'
                            </div>
                        </div>
                    </div>
                    <div class="item_All_Control">
                        <div id="info_filter_container">
                            <button class="info_filter_item_container" id="info_filter_search">
                                <span>Search</span>
                                <span>✖️</span>
                            </button>
                            
                            <button class="info_filter_item_container" id="info_filter_wilayah">
                                <span>Wilayah</span>
                                <span>✖️</span>
                            </button>
                            
                            <button class="info_filter_item_container" id="info_filter_order">
                                <span>Urutan</span>
                                <span>✖️</span>
                            </button>
                            
                            <button class="info_filter_item_container" id="info_filter_sex">
                                <span>Jenis Kelamin</span>
                                <span>✖️</span>
                            </button>
                            
                            <button class="info_filter_item_container" id="info_filter_warna">
                                <span>Warna</span>
                                <span>✖️</span>
                            </button>
                            
                            <button class="info_filter_item_container" id="info_filter_min">
                                <span>Min</span>
                                <span>✖️</span>
                            </button>
                            
                            <button class="info_filter_item_container" id="info_filter_max">
                                <span>Max</span>
                                <span>✖️</span>
                            </button>
                            
                            <button class="info_filter_item_container" id="info_filter_kategori">
                                <span>Kategori</span>
                                <span>✖️</span>
                            </button>
                        </div>
                        <div id="breadCrumbContainer" itemscope itemtype="https://schema.org/BreadcrumbList">'. $breadCrumbPath .'</div>
                        <div id="listAllItemContainer">
                            <div id="showmore"></div>
                        </div>
                        <div id="itemCall"><img draggable="false" src="/data/assets/image/logo/icon/loading.svg" alt="loading"></div>
                    </div>
                </div>
            </div>

            <script> let kategori_Id = "'. $baseKategoriId .'" </script>
            
            <script src="/data/template/kategori.js"></script>
    ';

    include 'base.php';