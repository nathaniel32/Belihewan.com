<?php
    include '../data/database/conn.php'; 
    include '../data/function.php';

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
    if(isset($_GET['edit'])){
        
        $jsLink = "<script>let iklanId = '". $_GET['edit'] ."' </script> <script src='/data/template/user/editoriklanupdate.js'></script>";
    }else{
        $jsLink = "<script src='/data/template/user/editoriklanpasang.js'></script>";
    }

    $title = "Pasang Iklan";
    $headData = '
                <meta name="robots" content="noindex, nofollow">
                <script>if(!logCheck()){reError(401)}</script>
            ';

    $main = "
        <link rel='stylesheet' href='/data/assets/css/user/editoriklan.css'>
        <div class='container'>
        
            <div class='inputContainer'>
                <label class='labelcontainer' for='judulIklan'>
                    Judul*
                    <span class='labelInfo'>Minimal 3 Karakter</span>
                </label>
                <input class='form-control inputFormContainer' id='judulIklan'>
            </div>

            <div class='inputContainer'>
                <label class='labelcontainer' for='kategoriInput'>
                    Kategori*
                    <span class='labelInfo'>Level dalam akan semakin baik</span>
                </label>
                <div class='inputFormContainer nestedButtonRow'>
                    <button id='editor_iklan_pop_kategori' class='btn editor_iklan_pop_nested_btn'>Cari</button>
                    <span id='kategoriInput'>Kategori</span>
                </div>
            </div>

            <div class='inputContainer'>
                <label class='labelcontainer' for='hargaIklan'>
                    Harga*
                    <span class='labelInfo'>Minimal Rp.1</span>
                </label>
                <div class='inputFormContainer hargaRow'>
                    <input type='text' class='form-control' id='hargaIklan'>
                    <div class='negoContainer'>
                        <label for='negoIklan'>Nego</label>
                        <input class='form-control' type='checkbox' id='negoIklan'>
                    </div>
                </div>
            </div>

            <div class='inputContainer'>
                <label class='labelcontainer' for='isiIklan'>
                    Deskripsi*
                    <span class='labelInfo'>Minimal 5 Karakter</span>
                </label>
                <textarea class='form-control inputFormContainer' id='isiIklan'></textarea>
            </div>

            <div class='inputContainer'>
                <label class='labelcontainer' for='file-input'>Foto (Optional)<span class='labelInfo'>jpg/jpeg/png/gif/webp</span></label>
                <div class='inputFormContainer'>
                    <input class='form-control' type='file' id='file-input' accept='image/*' multiple>
                    <div id='imgContainer'></div>
                </div>
            </div>

            <div class='inputContainer'>
                <label class='labelcontainer' for='jenisSex'>Jenis kelamin (Optional)</label>
                <select class='form-control inputFormContainer' id='jenisSex'>
                    <option value=''>Kelamin</option>
                    <option value='1'>Jantan</option>
                    <option value='2'>Betina</option>
                </select>
            </div>

            <div class='inputContainer'>
                <label class='labelcontainer' for='umurIklan'>Umur (Optional)</label>
                <div class='inputFormContainer umurRow'>
                    <input type='number' step='0.01' min='0.01' class='form-control' id='umurIklan'>
                    <span class='textBulan'>Bulan</span>
                </div>
            </div>

            <div class='inputContainer'>
                <label class='labelcontainer' for='warnaIklan'>Warna (Optional)</label>
                <select class='form-control inputFormContainer' name='warna' id='warnaInput'>
                    <option value=''>Warna</option>
                    " . getWarna($connect) . "
                </select>
            </div>

            <div class='inputContainer'>
                <label class='labelcontainer' for='keywordIklan'>Keyword (Optional)
                    <span class='labelInfo'>Dipisahkan dengan #</span>
                </label>
                <textarea class='form-control inputFormContainer' id='keywordIklan'></textarea>
            </div>

            <div class='inputContainer'>
                <label class='labelcontainer' for='lokasiInput'>
                    Lokasi*
                    <span class='labelInfo'>Level dalam akan semakin baik</span>
                </label>
                <div class='inputFormContainer nestedButtonRow'>
                    <button id='editor_iklan_pop_lokasi' class='btn editor_iklan_pop_nested_btn'>Cari</button>
                    <span id='lokasiInput'>Lokasi</span>
                </div>
            </div>

            <div class='inputContainer'>
                <label class='labelcontainer' for='alamatIklan'>
                    Alamat (Optional)
                    <span class='labelInfo'>Alamat akan dipublikasi!!</span>
                </label>
                <div class='inputFormContainer autoDataContainer'>
                    <input class='form-control search_input_form' id='alamatIklan' autocomplete='off'>
                    <div class='dropdown_search_item'></div>
                </div>
            </div>
            
            <div class='inputContainer'>
                <label class='labelcontainer' for='emailIklan'>
                    Email (Optional)
                    <span class='labelInfo'>Email akan dipublikasi!!</span>
                </label>
                <div class='inputFormContainerKontak autoDataContainer'>
                    <input class='form-control search_input_form' id='emailIklan' autocomplete='off'>
                    <div class='dropdown_search_item'></div>
                </div>
            </div>

            <div class='inputContainer'>
                <label class='labelcontainer' for='noTlpIklan'>
                    No Telefon (Optional)
                    <span class='labelInfo'>Nomor akan dipublikasi!!</span>
                </label>
                <div class='inputFormContainerKontak autoDataContainer'>
                    <input class='form-control search_input_form' id='noTlpIklan' autocomplete='off'>
                    <div class='dropdown_search_item'></div>
                </div>
            </div>

            <div class='inputContainer'>
                <label class='labelcontainer' for='noWaIklan'>
                    No Whatsapp (Optional)
                    <span class='labelInfo'>Nomor akan dipublikasi!!</span>
                </label>
                <div class='inputFormContainerKontak autoDataContainer'>
                    <input class='form-control search_input_form' id='noWaIklan' autocomplete='off'>
                    <div class='dropdown_search_item'></div>
                </div>
            </div>

            <div class='uploadContainer'>
                <button class='btn' id='cancel-btn'>Cancel</button>
                <button class='btn' id='upload-btn'>Upload</button>
            </div>
        </div>
        <!--<script>if(!logCheck()){reError(401);}</script>-->
        <script src='/data/template/user/editoriklan.js'></script>
        $jsLink
        ";

    include '../base.php';