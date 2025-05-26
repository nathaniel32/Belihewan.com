reUser(null);

let binaryBlobArray = [];

//--------------------------------------------------------- foto

const fileInput = document.getElementById('file-input');
const imgContainer = document.getElementById('imgContainer');

class imageList {
    constructor(blobLink) {
        this.link = blobLink;
        this.imgEditorContainer = document.createElement("div");
        this.imgEditorContainer.classList.add("imgEditorContainer");

        this.removeImgEditorBtn = document.createElement("removeImgEditorBtn");
        this.removeImgEditorBtn.classList.add("removeImgEditorBtn");
        this.removeImgEditorBtn.textContent = "❌";

        this.imgEditor = document.createElement("img");
        this.imgEditor.src = blobLink;

        imgContainer.append(this.imgEditorContainer);
        this.imgEditorContainer.append(this.removeImgEditorBtn);
        this.imgEditorContainer.append(this.imgEditor);

        this.removeImgEditorBtn.onclick = this.removeImg.bind(this);
    }
    
    removeImg() {
        this.imgEditorContainer.remove();

        const index = binaryBlobArray.indexOf(this);
        if (index !== -1) {
            binaryBlobArray.splice(index, 1);
        }
    }
}

fileInput.addEventListener('change', function() {
    for (const file of fileInput.files) {
        if (file.size > 2000 * 1024) {
            setInfoMsg('File "' + file.name + '" terlalu besar. Maksimum 2MB diizinkan.', 1);
            continue;
        }
        const reader = new FileReader();
        
        reader.addEventListener('load', function() {
            const binaryBlob = reader.result;

            displayImgEditor(binaryBlob);
        });
        reader.readAsDataURL(file);
    }

    fileInput.value = null;
});

function displayImgEditor(binaryBlob){
    if(binaryBlobArray.length < 10){
        const classImg = new imageList(binaryBlob);
        binaryBlobArray.push(classImg);
    }else{
        setInfoMsg("Max 10 Foto!", 1);
    }
}



//--------------------------------------------------------- upload

const cancelBtn = document.getElementById("cancel-btn");

cancelBtn.onclick = ()=>{
    const confirmEditorCancel = window.confirm(`Cancel iklan ini?`);
                
    if (confirmEditorCancel === true) {
        window.history.back();
    }
}


const uploadBtn = document.getElementById('upload-btn');


const judul = document.getElementById("judulIklan");
const kategori = document.getElementById("kategoriInput");
const harga = document.getElementById("hargaIklan");
const negoIklan = document.getElementById("negoIklan");
const isi = document.getElementById("isiIklan");
const umur = document.getElementById("umurIklan");
const warna = document.getElementById("warnaInput");
const keyword = document.getElementById("keywordIklan");
const jenisSex = document.getElementById("jenisSex");
const alamatIklan = document.getElementById("alamatIklan");
const lokasi = document.getElementById("lokasiInput");
const emailIklan = document.getElementById("emailIklan");
const noTlpIklan = document.getElementById("noTlpIklan");
const noWaIklan = document.getElementById("noWaIklan");

harga.oninput = function() {
    formatHarga(this);
};

function noPhoneFormat(noPhone){
    noPhone = noPhone.replace(/^0/, '');
    return '+62' + noPhone;
}

uploadBtn.addEventListener('click', async function() {
    if(navigator.onLine){
        const judulValue = judul.value.trim();
        const kategoriValue = kategori.getAttribute('data-kategori');
        const hargaValue = harga.value.trim().replace(/\./g, '');
        const negoIklanValue = negoIklan.checked ? negoIklan.checked : null;
        //const isiValue = isi.value.trim().replace(/\n/gi, '<br>');
        //const isiValue = isi.value.trim().replace(/ /gi, '&nbsp;').replace(/\n/gi, '<br>');
        const isiValue = isi.value.trim();
        const umurValue = umur.value.trim();
        const warnaValue = warna.value;
        const keywordValue = keyword.value.trim();
        const jenisSexValue = jenisSex.value.trim(); //.checked;
        const alamatIklanValue = alamatIklan.value.trim();
        const emailIklanValue = emailIklan.value.trim();
        let noTlpIklanValue = noTlpIklan.value.trim();
        let noWaIklanValue = noWaIklan.value.trim();
        
        const lokasiValue = lokasi.getAttribute('data-lokasi');
    
        if(logCheck()){
    
            if(judulValue && judulValue.length >= 3){
                if(kategoriValue){
                    if(hargaValue && hargaValue >= 0){
                        if(isiValue && isiValue.length >= 5){
                            if(lokasiValue){
                                const phoneRegex = /^\+?[0-9]{10,15}$/;
                                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    
                                if (phoneRegex.test(noTlpIklanValue) || !noTlpIklanValue) {
    
                                    if (!noTlpIklanValue.startsWith('+')) {
                                        noTlpIklanValue = noPhoneFormat(noTlpIklanValue);
                                    }
                                    
                                    if (phoneRegex.test(noWaIklanValue) || !noWaIklanValue) {
    
                                        if (!noWaIklanValue.startsWith('+')) {
                                            noWaIklanValue = noPhoneFormat(noWaIklanValue);
                                        }
    
                                        if (emailRegex.test(emailIklanValue) || !emailIklanValue) {
                                            const confirmEditorFinish = window.confirm(`Apakah Anda sudah selesai?`);
                    
                                            if (confirmEditorFinish === true) {
                                                uploadBtn.disabled = true;
                                                showPopupLoading();
                                                const res = await uploadDataToAPI(judulValue, kategoriValue, hargaValue, negoIklanValue, isiValue, jenisSexValue, umurValue, warnaValue, keywordValue, lokasiValue, alamatIklanValue, emailIklanValue, noTlpIklanValue, noWaIklanValue, binaryBlobArray);
                                                if(res){
                                                    setTimeout(() => {
                                                        window.location.href = "/iklan-saya";
                                                    }, 1000);
                                                }else{
                                                    uploadBtn.disabled = false;
                                                }
                                                closeDisplayPopup();
                                            }
                                        }else{
                                            setInfoMsg('Email tidak valid!' , 1);
                                        }
                                    }else{
                                        setInfoMsg('No Whatsapp tidak valid!' , 1);
                                    }
                                }else{
                                    setInfoMsg('No Telp tidak valid!' , 1);
                                }
                            }else{
                                setInfoMsg('Tolong isi Lokasi Anda!' , 1);
                            }
                        }else{
                            setInfoMsg('Tolong isi Deskripsi Iklan (Minimal 5 Huruf)' , 1);
                        }
                    }else{
                        setInfoMsg('Tolong isi Harga Iklan! (Minimal Rp. 0)' , 1);
                    }
                }else{
                    setInfoMsg('Tolong isi Kategori Iklan!' , 1);
                }
            }else{
                setInfoMsg('Tolong isi Judul Iklan (Minimal 3 Huruf)!' , 1);
            }
            
        }else{
            //log_container.style.display = "flex";
            displayLoginForm();
            setInfoMsg("Login first", 1);
        }
    }else{
        setInfoMsg("Tidak ada jaringan internet.", 1);
    }
});


//-----------------------------------------------------

emailIklan.onfocus = (e)=>{
    showAutoDataDropDown(e, dataToken.payload.emailUser);
};
emailIklan.oninput = (e)=>{
    hideAutoDataDropDown(e, dataToken.payload.emailUser);
};

noWaIklan.onfocus = (e)=>{
    showAutoDataDropDown(e, dataToken.payload.noWaUser);
};
noWaIklan.oninput = (e)=>{
    hideAutoDataDropDown(e, dataToken.payload.noWaUser);
};

noTlpIklan.onfocus = (e)=>{
    showAutoDataDropDown(e, dataToken.payload.noTlpUser);
};
noTlpIklan.oninput = (e)=>{
    hideAutoDataDropDown(e, dataToken.payload.noTlpUser);
};

alamatIklan.onfocus = (e)=>{
    showAutoDataDropDown(e, dataToken.payload.alamatUser);
};
alamatIklan.oninput = (e)=>{
    hideAutoDataDropDown(e, dataToken.payload.alamatUser);
};

function hideAutoDataDropDown(e, dataValue){
    if(e.srcElement.value){
        const dropdownContainer = e.srcElement.parentElement.querySelector(".dropdown_search_item");
        dropdownContainer.textContent = null;
    }else{
        console.log("ok")
        showAutoDataDropDown(e, dataValue);
    }
}

function showAutoDataDropDown(e, dataValue){
    if(e.srcElement.value !== dataValue){
        const dropdownContainer = e.srcElement.parentElement.querySelector(".dropdown_search_item");
        if(dataValue){
            dropdownContainer.textContent = null;
            const dropdownItem = document.createElement("div");
            dropdownItem.classList.add("dropdown_search_item_main");
            dropdownItem.innerHTML = dataValue;
            dropdownContainer.append(dropdownItem);
        
            dropdownItem.onclick = ()=>{
                e.srcElement.value = decodeEntities(dataValue);
                dropdownContainer.textContent = null;
            }
        }else{
            e.srcElement.autocomplete = 'on';
        }
    }
}

//---------------------------------------------------------------------

const editorIklanPopkategori = document.getElementById("editor_iklan_pop_kategori");

editorIklanPopkategori.onclick = async () =>{
    editorIklanPopkategori.disabled = true;
    nestedDataPopUp(await jsonData.getJsonKategori(), kategoriPopUpEditorIklan, "Kategori");
    editorIklanPopkategori.disabled = false;
}

function kategoriPopUpEditorIklan(data){
    if(data){
        const confirmEditorKategori = window.confirm(`Kategori "${decodeEntities(data.n_nd)}"?`);  
        if (confirmEditorKategori === true) {
            kategori.innerHTML = data.n_nd;
            kategori.setAttribute('data-kategori', data.i_nd);
            closeDisplayPopup();
        }
    }
}

const editor_iklan_pop_lokasi = document.getElementById("editor_iklan_pop_lokasi");

editor_iklan_pop_lokasi.onclick = async () =>{
    editor_iklan_pop_lokasi.disabled = true;
    nestedDataPopUp(await jsonData.getJsonWilayah(), lokasiPopUpEditorIklan, "Wilayah");
    editor_iklan_pop_lokasi.disabled = false;
}

function lokasiPopUpEditorIklan(data){
    if(data){
        const confirmEditorKategori = window.confirm(`Lokasi "${decodeEntities(data.n_nd)}"?`);  
        if (confirmEditorKategori === true) {
            lokasi.textContent = data.n_nd;
            lokasi.setAttribute('data-lokasi', data.i_nd);
            closeDisplayPopup();
        }
    }
}