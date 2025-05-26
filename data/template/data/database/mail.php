<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../PHPMailer/src/Exception.php';
require '../PHPMailer/src/PHPMailer.php';
require '../PHPMailer/src/SMTP.php';

function sendMail($thisFromMail, $thisFromName, $thisToMail, $thisToName, $thisReplyMail, $thisSubject, $thisBody, $thisAltBody){
    
    $mail = new PHPMailer(true);
    
    try {
        //Server settings
        $mail->SMTPDebug = 0;
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'example@gmail.com';
        $mail->Password   = 'tueu tboo lqsn psdz';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;

        //Recipients
        $mail->setFrom($thisFromMail, $thisFromName);
        $mail->addAddress($thisToMail, $thisToName);
        $mail->addReplyTo($thisReplyMail, "RE $thisSubject");
    
        //Content
        $mail->isHTML(true);
        $mail->Subject = $thisSubject;
        $mail->Body    = template_email($thisSubject, $thisBody);
        $mail->AltBody = $thisAltBody;
    
        $mail->send();
        
        return 1;
    } catch (Exception $e) {
        return null;
    }
}

function template_email($subject, $body){
    $temp_domain = $_SERVER['HTTP_HOST'];
    return '
    <!DOCTYPE html>
    <html>
        <head>
            <title>Aktivitas Login SeputarKu</title>
            <style>
                a{
                    text-decoration: none;
                }
                .container_main{
                    margin: 10px;
                    padding: 20px; 
                    max-width: 500px;
                    margin-left: auto;
                    margin-right: auto;
                    font-family:Verdana, Geneva, Tahoma, sans-serif;
                    background-color: hsl(0, 0%, 95%);
                    border: 1px solid;
                    border-radius: 10px;
                }
                h1{
                    font-size: 1.4rem;
                    margin: 10px 15px;
                }
                .headerContainer{
                    text-align: center;
                }
                .imgLogo{
                    max-width: 60%;
                }
                .main_body{
                    overflow: hidden;
                    word-break: break-word;
                    font-size: 1rem;
                }
                footer{
                    display:flex; 
                    justify-content: center;
                    flex-wrap: wrap;
                    margin-top: 20px;
                }
                .footerLink{
                    margin:5px;
                    white-space: nowrap;
                    font-size: 0.8rem;
                }
            </style>
        </head>
        <body>
            <div class="container_main">
                <header class="headerContainer">
                    <img class="imgLogo" src="https://belihewan.com/data/assets/image/logo/home.png" alt="Beli Hewan Logo">
                    <h1>'. $subject .'</h1>
                </header>
                <main class="main_body">
                    '. $body .'
                <main>
                <footer>
                    <a class="footerLink" href="https://'. $temp_domain .'/about">Tentang Kami</a>
                    <a class="footerLink" href="https://'. $temp_domain .'/faq">FAQ</a>
                    <a class="footerLink" href="https://'. $temp_domain .'/disclaimer">Disclaimer</a>
                    <a class="footerLink" href="https://'. $temp_domain .'/contact">Kontak</a>
                    <a class="footerLink" href="https://'. $temp_domain .'/tips">Tips</a>
                    <a class="footerLink" href="https://'. $temp_domain .'/privacy">Privasi</a>
                </footer>
            </div>
        </body>
    </html>
    ';
}