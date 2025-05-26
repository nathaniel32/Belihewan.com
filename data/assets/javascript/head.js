function getCookie(name) {
    const cookieString = document.cookie;
    const cookies = cookieString.split('; ');

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split('=');
        if (cookie[0] === name) {
            return decodeURIComponent(cookie[1]);
        }
    }
    return null;
}

//console.log(getCookie('token_user'));

const userCookieName = "token_user";
//let tokenuser;
let dataToken;

function reError(number) {
    switch (number) {
        case 400:
            window.location.href = "/400";
            break;
        case 401:
            //window.location.href = "/401";
            window.location.href = "/?message=" + encodeURIComponent("Login terlebih dahulu.");
            break;
        case 403:
            window.location.href = "/403";
            break;
        case 404:
            //window.location.href = "/404";
            window.location.href = "/?message=" + encodeURIComponent("Page tidak ditemukan.");
            break;
        case 500:
            window.location.href = "/500";
            break;
        case 503:
            window.location.href = "/503";
            break;
        default:
            console.error("Error: Unknown error number");
            break;
    }
}

function decodeToken() {
    const tokenuser = getCookie(userCookieName);
    if(tokenuser){
        try {
            let parts = tokenuser.split('.');
            let header = JSON.parse(atob(parts[0]));
            let payload = JSON.parse(atob(parts[1]));
            let signature = parts[2];

            return {
                header: header,
                payload: payload,
                signature: signature
            };
            
        } catch(error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }else{
        return null;
    }
}

function logCheck(){
    //tokenuser = getCookie(userCookieName); //localStorage.getItem('token_user')
    dataToken = decodeToken();
    if(dataToken){
        const expirationTime = dataToken.payload.expTokenUser * 1000;
        const currentTime = Date.now();
        if(dataToken.payload.idUser && expirationTime > currentTime){
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }
}

function verifAdmin(){
    dataToken = decodeToken();
    if(dataToken){
        if(dataToken.payload.roleUser == 3){
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }
}

function reAdmin(callback){
    if(verifAdmin()){
        if(typeof callback === 'function') {
            callback();
        }
    }else{
        reError(401);
    }
}

function reUser(callback){
    if(logCheck()){
        if(typeof callback === 'function') {
            callback();
        }
    }else{
        reError(401);
    }
}

class JsonDataControl{
    constructor(){
        this.dataKategori = null;
        this.dataWilayah = null;
    }

    async getJsonKategori(){
        if(!this.dataKategori){
            try {
                let response = await fetch("/data/assets/javascript/json_data_storage/kategori.json");
                if (response.ok) {
                    let data = await response.json();
                    this.dataKategori = data;
                    return data;
                } else {
                    console.error('HTTP error', response.status);
                    return null;
                }
            } catch (error) {
                console.error('Fetch error', error);
                return null;
            }
        }else{
            return this.dataKategori;
        }
    }

    async getJsonWilayah(){
        if(!this.dataWilayah){
            try {
                let response = await fetch("/data/assets/javascript/json_data_storage/wilayah.json");
                if (response.ok) {
                    let data = await response.json();
                    this.dataWilayah = data;
                    return data;
                } else {
                    console.error('HTTP error', response.status);
                    return null;
                }
            } catch (error) {
                console.error('Fetch error', error);
                return null;
            }
        }else{
            return this.dataWilayah;
        }
    }
}

const jsonData = new JsonDataControl;

/* (async () => {
    console.log(await jsonData.getJsonKategori());
    console.log(await jsonData.getJsonKategori());
    console.log(await jsonData.getJsonWilayah());
})(); */