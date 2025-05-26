<?php
    include '../data/database/conn.php'; 
    include '../data/function.php';

    verifyTokenPage(false);

    $title = "Setting";
    $headData = '<meta name="robots" content="noindex, nofollow">';
    $main = "
        <link rel='stylesheet' href='/data/assets/css/user/settingprofile.css'>
        <div class='container'>
            <h1 class='judul_page'>Setting</h1>

            <div class='setting_profile_container'>
                <h2>Profile</h2>
                <div class='setting_profile_image_container'>
                    <img draggable='false' id='profileDisplayImage' src='/data/assets/image/logo/icon/nophoto.jpg'>
                </div>
                <label class='setting_profile_label'>
                    <span class='setting_profile_label_title'>Username</span>
                    <span class='setting_profile_label_info' id='profileDisplayUsername'>Loading...</span>
                </label>

                <label class='setting_profile_label'>
                    <span class='setting_profile_label_title'>Email</span>
                    <span class='setting_profile_label_info' id='profileDisplayEmail'>Loading...</span>
                </label>

                <label class='setting_profile_label'>
                    <span class='setting_profile_label_title'>No Telp</span>
                    <input class='setting_profile_input' type='tel' id='profileDisplayNotlp' placeholder='Loading...' readonly>
                </label>

                <label class='setting_profile_label'>
                    <span class='setting_profile_label_title'>No Wa</span>
                    <input class='setting_profile_input' type='tel' id='profileDisplayNowa' placeholder='Loading...' readonly>
                </label>

                <label class='setting_profile_label'>
                    <span class='setting_profile_label_title'>Alamat</span>
                    <input class='setting_profile_input' type='text' id='profileDisplayAlamat' placeholder='Loading...' readonly>
                </label>

                <label class='setting_profile_label'>
                    <span class='setting_profile_label_title'>Wilayah</span>
                    <button class='btn' id='setting_profile_wilayah_btn'>Cari</button>
                    <span class='setting_profile_label_info' id='profileDisplayWilayah'>Loading...</span>
                    <button id='setting_profile_wilayah_remove_btn'>✖️</button>
                </label>

                <label class='setting_profile_label'>
                    <span class='setting_profile_label_title'>Tipe User</span>
                    <span class='setting_profile_label_info' id='profileDisplayRole'>Loading...</span>
                </label>

                <label class='setting_profile_label'>
                    <span class='setting_profile_label_title'>Jenis Log</span>
                    <span class='setting_profile_label_info' id='profileDisplayLogType'>Loading...</span>
                </label>

                <div class='setting_profile_btn_control_container'>
                    <button class='btn' id='setting_profile_btn_edit'>Edit</button>
                    <button class='btn' id='setting_profile_btn_cancel'>Cancel</button>
                    <button class='btn' id='setting_profile_btn_save'>Save</button>
                </div>
            </div>
        </div>
        <script src='/data/template/user/settingprofile.js'></script>";

    include '../base.php';