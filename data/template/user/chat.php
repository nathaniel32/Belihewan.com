<?php
    include '../data/database/conn.php'; 
    include '../data/function.php';

    verifyTokenPage(false);

    $title = "Chat";
    $headData = '<meta name="robots" content="noindex, nofollow">';
    $main = "
        <link rel='stylesheet' href='/data/assets/css/user/chat.css'>
        <div class='chat_container'>
            <div class='chat_control'>
                <div id='chat_kontak_container' class='chat_kontak_op'></div>
                <div id='chat_pesan_container'>
                    <div class='chat_pesan_header'>
                        <div class='header_info_pesan_container'>
                            <h1 id='judul_iklan_pesan'></h1>
                            <div class='nama_partner_pesan_container'><a href='#' id='nama_partner_pesan' target='_blank' data-cpop='false'>Loading..</a></div>
                        </div>
                        <div id='close_display_pesan'>❌</div>
                    </div>
                    <div id='pesan_isi_container'></div>
                    <div class='chat_pesan_input'>
                        <textarea id='textPesan'></textarea>
                        <button id='submitPesan'><img src='/data/assets/image/logo/icon/send.svg' alt='send message'></button>
                    </div>
                </div>
            </div>
        </div>
        <script src='/data/template/user/chat.js'></script> ";

    include '../base.php';