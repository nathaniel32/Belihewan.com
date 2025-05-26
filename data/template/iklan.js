(function () {
    const iklan_carousel_container = document.querySelector('.iklan_carousel_container');
    const prevSlideCarouselIklan = document.querySelector(".prevBtn_iklan_carousel");
    const nextSlideCarouselIklan = document.querySelector(".nextBtn_iklan_carousel");
    const iklan_carousel = iklan_carousel_container.querySelectorAll("img");
    let imgCarouselIklanIndex = 0;
    let intervalIdCarouselIklan = null;
    const NoImgCarouselIklan = document.getElementById("NoImgCarouselIklan");
    const NoAllImgCarouselIklan = document.getElementById("NoAllImgCarouselIklan");
    NoAllImgCarouselIklan.textContent = iklan_carousel.length;

    document.addEventListener("DOMContentLoaded", initializeSlider);

    window.prevSlideFunction = function(){
        if(imgCarouselIklanIndex > 0){
            imgCarouselIklanIndex--;
        }else{
            imgCarouselIklanIndex = iklan_carousel.length - 1;
        }
        initializeSlider();
    }

    window.nextSlideFunction = function() {
        if (imgCarouselIklanIndex + 1 < iklan_carousel.length) {
            imgCarouselIklanIndex++;
        } else {
            imgCarouselIklanIndex = 0;
        }
        initializeSlider();
    };

    prevSlideCarouselIklan.onclick = window.prevSlideFunction;
    nextSlideCarouselIklan.onclick = window.nextSlideFunction;

    function initializeSlider(){
        if(iklan_carousel.length > 0){
            showSlide();
            if(iklan_carousel.length > 1){
                clearInterval(intervalIdCarouselIklan);
                intervalIdCarouselIklan = setInterval(nextSlideFunction, 20000);
            }else{
                prevSlideCarouselIklan.style.display = "none";
                nextSlideCarouselIklan.style.display = "none";
            }
        }
        NoImgCarouselIklan.textContent = imgCarouselIklanIndex + 1;
    }

    function showSlide(){
        iklan_carousel.forEach(slide => {
            slide.classList.remove("displaySlide");
        });
        iklan_carousel[imgCarouselIklanIndex].classList.add("displaySlide");

        const zoom_img_container = document.querySelector(".zoom_img_container");
        if(zoom_img_container){
            zoom_img_container.querySelector("img").src = iklan_carousel[imgCarouselIklanIndex].src;
        }
    }

    let startXCarouselIklan;
    const control_iklan_image = document.querySelector(".control_iklan_image");

    control_iklan_image.addEventListener('mousedown', handleStart, false);
    control_iklan_image.addEventListener('touchstart', handleStart, false);

    control_iklan_image.addEventListener('mousemove', handleMove, false);
    control_iklan_image.addEventListener('touchmove', handleMove, false);

    control_iklan_image.addEventListener('mouseup', handleEnd, false);
    control_iklan_image.addEventListener('touchend', handleEnd, false);

    function handleStart(event) {
        startXCarouselIklan = (event.type === 'mousedown') ? event.clientX : event.touches[0].clientX;
    }

    function handleMove(event) {
        if (!startXCarouselIklan) return;
        control_iklan_image.classList.add("dragging");

        let currentX = (event.type === 'mousemove') ? event.clientX : event.touches[0].clientX;
        let diffX = startXCarouselIklan - currentX;

        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                nextSlideFunction();
            } else {
                prevSlideFunction();
            }
            startXCarouselIklan = null;
            control_iklan_image.classList.remove("dragging");
        }
    }

    function handleEnd() {
        let diffX = startXCarouselIklan - event.clientX;
        if(diffX === 0){
            zoomImg();
        }
        startXCarouselIklan = null;
        control_iklan_image.classList.remove("dragging");
    }

    //------------------------------------------------------

    function zoomImg() {
        const zoomImgTemplate = `<div class="zoom_img_container"><img draggable="false" src="${iklan_carousel[imgCarouselIklanIndex].src}" alt="Zoom"></div>` + (iklan_carousel.length > 1 ? `<button class="prevZoomBtn_iklan_carousel btn btn_iklan_carousel" onclick="prevSlideFunction()"><span>&#10094;</span></button><button class="nextZoomBtn_iklan_carousel btn btn_iklan_carousel" onclick="nextSlideFunction()"><span>&#10095;</span></button>` : "");
        const classZoomLoading = "zoom_pop_container";
        displayPopupData(zoomImgTemplate, classZoomLoading);
    }

    /*------------------------------------------------------------------------------------------*/

    const listAllItemContainer = document.getElementById("listAllItemContainer");
    const itemCall = document.getElementById("itemCall");
    const kategoriArray = null;
    const sendLimitAll = 18;
    const sendSex = null;
    const sendHargaMin = null;
    const sendHargaMax = null;
    const sendOrder = null;
    const sendWarna = null;
    const sendLokasi = null;
    const sendSearch = null;
    window.listArray = [];

    listArray.push(getIdi);

    const allCaller = document.createElement("div")
    allCaller.classList.add("list_all_caller")

    const list_row_caller_img = document.createElement("img");
    list_row_caller_img.src = "/data/assets/image/logo/icon/loading.svg";
    list_row_caller_img.alt = "loading";
    list_row_caller_img.setAttribute('draggable', 'false');

    allCaller.append(list_row_caller_img);

    listAllItemContainer.append(allCaller)

    async function fetchListAll(){
        allCaller.style.display = "flex";
        itemCall.disabled = true;
        itemCall.style.display = "none";
        if(navigator.onLine){
            const results_all = await fetchIklan(allCaller, kategoriArray, listArray, sendLimitAll, sendSex, sendHargaMin, sendHargaMax, sendOrder, sendWarna, sendLokasi, sendSearch, null);
            if(results_all){
                if(results_all === 1){
                    itemCall.style.display = "none";
                }else{
                    results_all.forEach(result_all => {
                        listArray.push(result_all.id_i)
                    })
                    
                    if(results_all.length < sendLimitAll){
                        itemCall.style.display = "none";
                    }else{
                        itemCall.style.display = "block";
                    }
                }
            }else{
                //console.log("End!1");
                //itemCall.style.display = "none";
                setTimeout(() => {
                    fetchListAll();
                }, 1000);
            }
            allCaller.style.display = "none";
            itemCall.disabled = false;
        }else{
            setInfoMsg("Tidak ada jaringan internet.", 1);
            setTimeout(() => {
                fetchListAll();
            }, 1000);
        }
    }

    itemCall.onclick = fetchListAll;

    //---------------------------------------------------------------------------------------------------------------------

    const listRowElements = document.getElementById("listRowElements");
    const rekomendasiData = {"i_nd":getIdkArray,"n_nd":"Rekomendasi"};

    async function rekomendasiList(){
        if(navigator.onLine){
            const results = await listrow_next(listRowElements, rekomendasiData, listArray, sendLimitAll, sendSex, sendHargaMin, sendHargaMax, sendOrder, sendWarna, sendLokasi, sendSearch)
            if(results){
                results.forEach(result => {
                    listArray.push(result.id_i)
                })
            }
            //console.log(rekomendasiData)
            fetchListAll();
        }else{
            setInfoMsg("Tidak ada jaringan internet.", 1);
        }
    }

    rekomendasiList();

    if(getIdkArray.length > 0){
        localStorage.setItem('Rekomendasi_Kategori', JSON.stringify(getIdkArray));
    }

    /*---------------------------------------------------------------------------------------- */

    const shareButtons = document.querySelectorAll('.share-button');
    shareButtons.forEach(button => {
        button.addEventListener('click', () => {
            const url = window.location.href;
            const platform = button.classList[1];
            let shareUrl;
            switch (platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/share?url=${encodeURIComponent(url)}`;
                    break;
                case 'mail':
                    const subject = 'Iklan Hewan';
                    const body = `Saya ingin menawarkan iklan saya pada Anda Link: ${url}`;
                    shareUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    break;
                case 'reddit':
                    shareUrl = `https://reddit.com/submit?url=${encodeURIComponent(url)}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`;
                    break;
            }
            window.open(shareUrl, '_blank', 'noopener noreferrer');
        });
    });

    //--------------------------------------------------

    window.reportIklan = async function(e){
        e.preventDefault();
        if(navigator.onLine){
            const textReport = e.srcElement.elements.textReport;
            const submitBtn = e.srcElement.elements.submitBtn;
            submitBtn.disabled = true;
        
            const textReportValue = textReport.value.trim();
            if(textReportValue){
        
                await fetch("/data/template/data/database/api.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        fidi:getIdi,
                        fketerangan:textReportValue,
                        action:"reportIklan"
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
                        closeDisplayPopup();
                    }else{
                        setInfoMsg(results.Message , 1);
                    }
                })
                .catch((error) => {
                    //console.log("Error: "+error);
                    setInfoMsg("Error!", 1);
                })
            }else{
                setInfoMsg("Tolong Isi Keterangan.", 1);
            }
        
            submitBtn.disabled = false;
        }else{
            setInfoMsg("Tidak ada jaringan internet.", 1);
        }
    }

    const repotIklanBtn = document.getElementById("repotIklanBtn");

    const repotIklanTemplate = `
        <div class="form_title">Report Iklan</div>
        <form class="reportForm" onsubmit="reportIklan(event)">
            <label class="formLabel">
                Keterangan*
                <textarea class="form-control" name='textReport'></textarea>
            </label>
            <input type='submit' class="btn" name='submitBtn' value='Report'>
        </form>
    
    `;

    repotIklanBtn.onclick = () =>{
        const classReport = "popupReport_form";
        displayPopupData(repotIklanTemplate, classReport);
    };

    //----------------------------------------------------------------------------------------------

    const chatIklanBtn = document.getElementById("chatIklanBtn");

    const chatIklanTemplate = `
        <div class="form_title">Kirim Pesan</div>
        <form class="chatForm" onsubmit="chatIklan(event)">
            <label class="formLabel">
                Pesan*
                <textarea class="form-control" name='textPesan'></textarea>
            </label>
            <input type='submit' class="btn" name='submitBtn' value='Kirim'>
        </form>
    `;

    chatIklanBtn.onclick = () =>{
        const res = logCheck();
        if(res){
            const classChat = "popupChat_form";
            displayPopupData(chatIklanTemplate, classChat);
        }else{
            displayLoginForm();
            setInfoMsg("Login first", 1);
        }
    };

    window.chatIklan = async function(e){
        e.preventDefault();

        if(navigator.onLine){
            const textPesan = e.srcElement.elements.textPesan;
            const submitBtn = e.srcElement.elements.submitBtn;
            submitBtn.disabled = true;
            //console.log(getIdi);
        
            const textPesanValue = textPesan.value.trim();
            if(textPesanValue){
        
                await fetch("/data/template/data/database/api.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        
                        fidi:getIdi,
                        fpesan:textPesanValue,
                        action:"pesanIklan"
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
                        closeDisplayPopup();
                        sendChatMail(results.Data);
                        window.open("/chat", "_blank");
                    }else{
                        setInfoMsg(results.Message , 1);
                    }
                })
                .catch((error) => {
                    //console.log("Error: "+error);
                    setInfoMsg("Error!", 1);
                })
            }else{
                setInfoMsg("Tolong Isi Keterangan.", 1);
            }
        
            submitBtn.disabled = false;
        }else{
            setInfoMsg("Tidak ada jaringan internet.", 1);
        }
    }

    //-----------------------------------------------------------------------------------------------

    setTimeout(() =>{
        if(navigator.onLine){
            fetch("/data/template/data/database/api.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fidi:getIdi,
                    action:"iklanViewInc"
                })
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json()
            })
            .then(async (results) => {
                if(!results.Success){
                    setInfoMsg(results.Message , 1);
                }
            })
            .catch((error) => {
                //console.log("Error: "+error);
                setInfoMsg("Error!", 1);
            })
        }
    }, 3000);


    const wishlistIklanBtn = document.getElementById("wishlistIklanBtn");
    wishlistIklanBtn.onclick = addWishlistIklan;

    function addWishlistIklan(){
        const res = logCheck();
        if(res){
            if(navigator.onLine){
                fetch("/data/template/data/database/api.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        
                        fidi:getIdi,
                        action:"addWishlistIklan"
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
                    }else{
                        setInfoMsg(results.Message , 1);
                    }
                })
                .catch((error) => {
                    //console.log("Error: "+error);
                    setInfoMsg("Error!", 1);
                })
            }else{
                setInfoMsg("Tidak ada jaringan internet.", 1);
            }
        }else{
            displayLoginForm();
            setInfoMsg("Login first", 1);
        }
    }
})();