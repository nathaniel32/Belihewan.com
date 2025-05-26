reUser(null);

const profileDisplayImage = document.getElementById("profileDisplayImage");
const profileDisplayUsername = document.getElementById("profileDisplayUsername");
const profileDisplayEmail = document.getElementById("profileDisplayEmail");
const profileDisplayNotlp = document.getElementById("profileDisplayNotlp");
const profileDisplayNowa = document.getElementById("profileDisplayNowa");
const profileDisplayAlamat = document.getElementById("profileDisplayAlamat");
const profileDisplayWilayah = document.getElementById("profileDisplayWilayah");
const profileDisplayRole = document.getElementById("profileDisplayRole");
const profileDisplayLogType = document.getElementById("profileDisplayLogType");

const setting_profile_btn_edit = document.getElementById("setting_profile_btn_edit");
const setting_profile_btn_cancel = document.getElementById("setting_profile_btn_cancel");
const setting_profile_btn_save = document.getElementById("setting_profile_btn_save");

const setting_profile_wilayah_btn = document.getElementById("setting_profile_wilayah_btn");
const setting_profile_wilayah_remove_btn = document.getElementById("setting_profile_wilayah_remove_btn");

setting_profile_btn_edit.onclick = ()=>{
    profileDisplayNotlp.readOnly = false;
    profileDisplayNowa.readOnly = false;
    profileDisplayAlamat.readOnly = false;

    setting_profile_btn_edit.style.display = "none";
    setting_profile_btn_cancel.style.display = "block";
    setting_profile_btn_save.style.display = "block";
    setting_profile_wilayah_btn.style.display = "block";

    //setting_profile_wilayah_remove_btn.style.display = "block";
    if(profileDisplayWilayah.getAttribute('data-lokasi')){
        setting_profile_wilayah_remove_btn.style.display = "block";
    }
}

setting_profile_btn_cancel.onclick = ()=>{
    const cancelLokasiSetting = window.confirm("Cancel?");
    if (cancelLokasiSetting === true) {
        resetSettingInputForm();
    }
}

setting_profile_wilayah_btn.onclick = async () =>{
    setting_profile_wilayah_btn.disabled = true;
    nestedDataPopUp(await jsonData.getJsonWilayah(), lokasiPopUpSettingCallback, "Wilayah");
    setting_profile_wilayah_btn.disabled = false;
}
function lokasiPopUpSettingCallback(data){
    if(data){
        const confirmLokasiSetting = window.confirm(`Lokasi "${decodeEntities(data.n_nd)}"?`);
        if (confirmLokasiSetting === true) {
            profileDisplayWilayah.innerHTML = data.n_nd;
            profileDisplayWilayah.setAttribute('data-lokasi', data.i_nd);
            closeDisplayPopup();
            setting_profile_wilayah_remove_btn.style.display = "block";
        }
    }
}

setting_profile_btn_save.onclick = ()=>{
    if(navigator.onLine){

        const noTelpValue = profileDisplayNotlp.value.trim();
        const noWaValue = profileDisplayNowa.value.trim();
        const alamatValue = profileDisplayAlamat.value.trim();
        const wilayahValue = profileDisplayWilayah.getAttribute('data-lokasi');

        const phoneRegex = /^\+?[0-9]{10,15}$/;

        if((phoneRegex.test(noTelpValue) || !noTelpValue) && (phoneRegex.test(noWaValue) || !noWaValue)){
            const confirmEditSetting = window.confirm("Save Setting");  
            if (confirmEditSetting === true) {
                fetch("/data/template/data/database/api.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        fNoTlp:noTelpValue,
                        fNoWA:noWaValue,
                        fWilayah:wilayahValue,
                        fAlamat:alamatValue,
                        action:"changeSettingUser"
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
                        setInfoMsg(results.Message , 1);
                        resetSettingInputForm();
                    }else{
                        if(results.noAccess){
                            reError(401);
                        }else if(results.unToken){
                            logout();
                        }
                        setInfoMsg(results.Message , 1);
                    }
                })
                .catch((error) => {
                    setInfoMsg("Error!", 1);
                })
            }
        }else{
            setInfoMsg("Format telefon tidak valid.", 1);
        }
    }else{
        container_myads.textContent = 'Tidak ada jaringan internet.';
        setInfoMsg("Tidak ada jaringan internet.", 1);
    }
}

function resetSettingInputForm(){
    profileDisplayNotlp.readOnly = true;
    profileDisplayNowa.readOnly = true;
    profileDisplayAlamat.readOnly = true;

    setting_profile_btn_edit.style.display = "block";
    setting_profile_btn_cancel.style.display = "none";
    setting_profile_btn_save.style.display = "none";
    setting_profile_wilayah_btn.style.display = "none";
    setting_profile_wilayah_remove_btn.style.display = "none";

    dataToken = decodeToken();
    if(dataToken){
        const expirationTime = dataToken.payload.expTokenUser * 1000;
        const currentTime = Date.now();
        if(dataToken.payload.idUser && expirationTime > currentTime){
            (async () => {
                profileDisplayNotlp.placeholder = '';
                profileDisplayNowa.placeholder = '';
                profileDisplayAlamat.placeholder = '';

                profileDisplayImage.src = dataToken.payload.userImg || "/data/assets/image/logo/icon/profile.svg";
                profileDisplayUsername.innerHTML = dataToken.payload.namaUser;
                profileDisplayEmail.textContent = dataToken.payload.emailUser;
                profileDisplayNotlp.value = dataToken.payload.noTlpUser || null;
                profileDisplayNowa.value = dataToken.payload.noWaUser || null;
                profileDisplayAlamat.value = decodeEntities(dataToken.payload.alamatUser) || null;
                if(dataToken.payload.wilayahUser){
                    const thisDataWilayah = findKategoriById(dataToken.payload.wilayahUser, await jsonData.getJsonWilayah());
                    profileDisplayWilayah.textContent = thisDataWilayah.n_nd;
                    profileDisplayWilayah.setAttribute('data-lokasi', thisDataWilayah.i_nd);
                }else{
                    profileDisplayWilayah.textContent = null;
                }
                profileDisplayRole.textContent = dataToken.payload.roleUser == 1 ? "Privat" : "Admin";
                profileDisplayLogType.textContent = dataToken.payload.logType ? "Google Gmail" : "Login Form";
            })();
        }else{
            setInfoMsg('Tolong Login Ulang!', 1);
        }
    }else{
        setInfoMsg('Error Login First!', 1);
    }
}

setting_profile_wilayah_remove_btn.onclick = ()=>{
    const deleteLokasiSetting = window.confirm("Hapus Lokasi?");  
    if (deleteLokasiSetting === true) {
        profileDisplayWilayah.removeAttribute("data-lokasi");
        profileDisplayWilayah.textContent = null;
        setting_profile_wilayah_remove_btn.style.display = "none";
    }
}

resetSettingInputForm();