const changePassForm = document.forms["changePassForm"];
const changePasswordDataContainer = document.getElementById("changePasswordDataContainer");

if (changePassForm) {
    changePassForm.onsubmit = async (e) =>{
        e.preventDefault();

        if(navigator.onLine){
            //console.log(code);
            //console.log(email);
            const newPassword = changePassForm["newPassword"].value;
            const confPassword = changePassForm["confPassword"].value;

            if(newPassword.length < 8){
                setInfoMsg("Password minimal 8 huruf." , 1);
            }else{
                if(newPassword === confPassword){
                    await fetch("/data/template/data/database/api.php", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            fcode:code,
                            femail:email,
                            fpassword:newPassword,
                            action:"inputNewPassword"
                        })
                    })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json()
                    })
                    .then(async (results) => {
                        if(results.Success == true){
                            setInfoMsg(results.Message, 1);
                            
                            //localStorage.setItem('token_user', results.Data);
                            
                            changePasswordDataContainer.textContent = null;
                            const spanResult = document.createElement("span");
                            spanResult.classList = "spanText";
                            spanResult.textContent = results.Message;
            
                            changePasswordDataContainer.append(spanResult);
            
                            setTimeout(() => {
                                showPopupLoading();
                                window.location.href = "/";
                            }, 2000);
                        }else{
                            setInfoMsg(results.Message , 1);
                        }
                    })
                    .catch((error) => {
                        //console.log("Error: "+error)
                        setInfoMsg("Error!", 1);
                    })
                }else{
                    setInfoMsg("Password tidak sama." , 1);
                }
            }
        }else{
            setInfoMsg("Tidak ada jaringan internet.", 1);
        }
    }
}