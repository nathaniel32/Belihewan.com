const chat_kontak_container = document.getElementById("chat_kontak_container");
const nama_partner_pesan = document.getElementById("nama_partner_pesan");
const judul_iklan_pesan = document.getElementById("judul_iklan_pesan");
const chat_pesan_container = document.getElementById("chat_pesan_container");

let intervalPesan;

let isDisplayPesanRunning = false;
let isDisplayKontakRunning = false;
let isSendMessageRunning = false;

let intervalKontak = setInterval(()=>{
    displayKontak();
}, 10000);

const pesan_isi_container = document.getElementById("pesan_isi_container");

let globalIdki = null;

const submitPesan = document.getElementById("submitPesan");
const textPesan = document.getElementById("textPesan");

const close_display_pesan = document.getElementById("close_display_pesan");

//const chat_kontak_container = document.getElementById("chat_kontak_container");
let listKontak = [];
let listPesan = [];

reUser(displayKontak);
submitPesan.onclick = sendMessage;
close_display_pesan.onclick = closeDisplayPesan;

//-------------------------------------------------------

textPesan.addEventListener("keydown", function(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});

//--------------------------------------------------------

async function getKontak(){
    if(navigator.onLine){
        //console.log(listKontak);
        const response = await fetch("/data/template/data/database/api.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                
                notID:listKontak,
                action:"myKontak"
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
                //setInfoMsg(results.Message, 1);
                return results.Data;
            }else{

                if(results.noAccess){
                    reError(401);
                }else if(results.unToken){
                    //console.log("logout");
                    logout();
                }

                if(listKontak.length === 0){
                    setInfoMsg(results.Message , 1);
                }
                return null;
            }
        })
        .catch((error) => {
            //console.log("Error: "+error);
            setInfoMsg("Error!", 1);
            return null;
        })

        return response;
    }else{
        setInfoMsg("Tidak ada jaringan internet.", 1);
        return null;
    }
}

async function displayKontak(){

    if (!isDisplayKontakRunning) {
        isDisplayKontakRunning = true;

        //console.log("chKontak");
        
        const thisKontakItems = await getKontak();
        if(thisKontakItems){
            thisKontakItems.forEach(thisKontakItem => {
        
                listKontak.push(thisKontakItem.id_ki);
        
                let partner_nama = thisKontakItem.nama_penjual;
                let partner_id = thisKontakItem.id_penjual;
                
                //console.log(thisKontakItem);
                
                /*
                if(thisKontakItem.my_id == thisKontakItem.id_penjual){
                    partner_nama = thisKontakItem.nama_client;
                }else{
                    partner_nama = thisKontakItem.nama_penjual;
                } */
        
                let img_path;
        
                if(thisKontakItem.nama_foto){
                    img_path = `/data/assets/image/iklan/${thisKontakItem.id_i}/${thisKontakItem.nama_foto}`;
                }else{
                    img_path = "/data/assets/image/logo/icon/nophoto.jpg";
                }
        
                const kontak_list = document.createElement("article");
                kontak_list.classList.add("kontak_list");
        
                const kontak_list_img_container = document.createElement("div");
                kontak_list_img_container.classList.add("kontak_list_img_container");
                const kontak_list_img_control = document.createElement("div");
                kontak_list_img_control.classList.add("kontak_list_img_control");
                const kontak_list_img = document.createElement("img");
                kontak_list_img.classList.add("imgUnderLoad");
                kontak_list_img.setAttribute('draggable', 'false');
                kontak_list_img.src = img_path;
                kontak_list_img.alt = thisKontakItem.judul;
        
                const kontak_list_text_container = document.createElement("div");
                kontak_list_text_container.classList.add("kontak_list_text_container")
                const kontak_list_text_judul = document.createElement("h3");
                kontak_list_text_judul.innerHTML = thisKontakItem.judul;
                const kontak_list_text_partner = document.createElement("span");
                kontak_list_text_partner.classList.add("kontak_list_text_partner_name")
                kontak_list_text_partner.textContent = partner_nama;
                
                kontak_list.onclick = async () => {
                    setInfoMsg('Loading...', 2);
                    listPesan = [];
                    judul_iklan_pesan.textContent = null;
                    pesan_isi_container.textContent = null;
                    
                    const judul_iklan_pesan_link = document.createElement("a");
                    const judulConvert = convertLink(thisKontakItem.judul);
                    judul_iklan_pesan_link.href = `/iklan/${thisKontakItem.id_i}/${judulConvert}`;
                    judul_iklan_pesan_link.target = "_blank";
                    judul_iklan_pesan_link.setAttribute("data-cpop", false);
                    judul_iklan_pesan_link.innerHTML = thisKontakItem.judul;
                    judul_iklan_pesan.append(judul_iklan_pesan_link);
                    
                    nama_partner_pesan.textContent = partner_nama;
                    nama_partner_pesan.href = "/profile?user=" + partner_id;
        
                    clearInterval(intervalPesan);
    
                    await displayPesan(thisKontakItem.id_ki);
        
                    chat_kontak_container.classList.replace('chat_kontak_op', 'chat_kontak_cl');
                    chat_pesan_container.style.display = "flex";
    
                    setInfoMsg(null, 3);
    
                    //isDisplayPesanRunning = false;
                    
                    intervalPesan = setInterval(()=>{
                        displayPesan(thisKontakItem.id_ki);
                    }, 2000);
                };
        
                chat_kontak_container.insertBefore(kontak_list, chat_kontak_container.firstChild);
        
                kontak_list.append(kontak_list_img_container);
                    kontak_list_img_container.append(kontak_list_img_control);
                        kontak_list_img_control.append(kontak_list_img);
                kontak_list.append(kontak_list_text_container);
                    kontak_list_text_container.append(kontak_list_text_judul);
                    kontak_list_text_container.append(kontak_list_text_partner);

                imgLoader();
            });
        }
        
        isDisplayKontakRunning = false;
    }
}

async function getPesan(thisIdKi){
    if(navigator.onLine){
        const response = await fetch("/data/template/data/database/api.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                
                notID:listPesan,
                fIdki:thisIdKi,
                action:"myPesan"
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
                //setInfoMsg(results.Message, 1);
                return results.Data;
            }else{
                //setInfoMsg(results.Message , 1);
                
                if(results.noAccess){
                    reError(401);
                }else if(results.unToken){
                    //console.log("logout");
                    logout();
                }
    
                return null;
            }
        })
        .catch((error) => {
            //console.log("Error: "+error);
            setInfoMsg("Error!", 1);
            return null;
        })
    
        return response;
    }else{
        setInfoMsg("Tidak ada jaringan internet.", 1);
        return null;
    }
}

async function displayPesan(thisIdKi){
    if (!isDisplayPesanRunning) {
        isDisplayPesanRunning = true;
        
        globalIdki = thisIdKi;
        const thisPesanItems = await getPesan(thisIdKi);
    
        if(thisPesanItems){
            thisPesanItems.forEach(thisPesanItem => {
    
                listPesan.push(thisPesanItem.id_p);
                //console.log(listPesan);
        
                let className;
                if(thisPesanItem.my_id == thisPesanItem.id_u){
                    className = "pesan_isi_me_container";
                }else{
                    className = "pesan_isi_partner_container";
                }
                
                const isi_text_container = document.createElement("div");
                isi_text_container.classList.add(className);
    
                const isi_text_control = document.createElement("div");
                isi_text_control.classList.add("pesan_isi_control");
    
                const isi_text = document.createElement("span");
                isi_text.classList.add("pesan_isi_text");
                isi_text.innerHTML = thisPesanItem.isi_text.replace(/ /gi, '&nbsp; ').replace(/\n/gi, '<br>');
    
                const isi_text_waktu = document.createElement("span");
                isi_text_waktu.classList.add("pesan_isi_waktu");
                isi_text_waktu.innerHTML = timeAgo(thisPesanItem.waktu, 3);
                
                pesan_isi_container.append(isi_text_container);
                isi_text_container.append(isi_text_control);
                isi_text_control.append(isi_text);
                isi_text_control.append(isi_text_waktu);
            });
        
            pesan_isi_container.scrollTop = pesan_isi_container.scrollHeight - pesan_isi_container.clientHeight; //harus first time saja! or ada pesan baru
        }


        isDisplayPesanRunning = false;
    }
}

async function sendMessage(){
    if(navigator.onLine){
        if (!isSendMessageRunning) {
            isSendMessageRunning = true;
    
            setInfoMsg("Loading...", 2);
        
            const textPesanValue = textPesan.value.trim();
    
            if(textPesanValue && globalIdki){
                await fetch("/data/template/data/database/api.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        
                        fidki:globalIdki,
                        fpesan:textPesanValue,
                        action:"inputPesanChat"
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
                        textPesan.value = null;
                        displayPesan(globalIdki);
                        sendChatMail(results.Data);
                    }else{
                        if(results.noAccess){
                            reError(401);
                        }else if(results.unToken){
                            //console.log("logout");
                            logout();
                        }
                        setInfoMsg(results.Message , 1);
                    }
                })
                .catch((error) => {
                    //console.log("Error: "+error);
                    setInfoMsg("Error!", 1);
                })
            }else{
                setInfoMsg("Isi Pesan", 1);
            }
    
            isSendMessageRunning = false;
        }
    }else{
        setInfoMsg("Tidak ada jaringan internet.", 1);
    }
}

function closeDisplayPesan(){
    clearInterval(intervalPesan);
    chat_pesan_container.style.display = "none";
    chat_kontak_container.classList.replace('chat_kontak_cl', 'chat_kontak_op');
}