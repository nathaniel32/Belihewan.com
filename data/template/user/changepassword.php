<?php
    if(!empty($_GET["code_cp"]) && !empty($_GET["email"])) {

        include '../data/database/conn.php'; 
        include '../data/function.php';

        //echo getcwd();

        $code_cp = $_GET["code_cp"];
        $email = $_GET["email"];

        $query = "SELECT * FROM user WHERE BINARY code = :f_code AND email = :f_email AND urole IS NOT NULL AND code IS NOT NULL AND log_type IS NULL";
        $statement = $connect->prepare($query);
        $statement->bindParam(':f_code', $code_cp, PDO::PARAM_STR);
        $statement->bindParam(':f_email', $email, PDO::PARAM_STR);

        $res = $statement->execute();
        if ($res) {
            $rowCount = $statement->rowCount();
            if ($rowCount > 0) {
                $changePasswordData = '
                    <div class="changePasswordControl">
                        <h1>Ubah Password</h1>
                        <div id="changePasswordDataContainer">
                            <form name="changePassForm" class="formChange">
                                <input class="form-control" type="password" name="newPassword" placeholder="Password Baru">
                                <input class="form-control" type="password" name="confPassword" placeholder="Tulis Ulang Password">
                                <input class="btn" type="submit" value="Ubah">
                            </form>
                        </div>
                    </div>
                    
                    <script>const email = "'. $email .'"; const code = "'. $code_cp .'";</script>
                ';
            } else {
                $changePasswordData = '<span class="spanText">Link verfikasi tidak valid</span>';
            }
        } else {
            $changePasswordData = '<span class="spanText">Server Error, Tolong Coba Lagi.</span>';
        }


        $title = "Change Password";
        $headData = '<meta name="robots" content="noindex, nofollow">';
        $main = "
            <link rel='stylesheet' href='/data/assets/css/user/changepassword.css'>
            <div class='container changePasswordContainer'>
                $changePasswordData
            </div>
            <script src='/data/template/user/changepassword.js'></script>
        ";
    
        include '../base.php';
    }else{
        header("HTTP/1.0 404 Not Found");
        header("Location: /404");
        exit;
    }