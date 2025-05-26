function ucWords(str) {
    return str.split(' ').map(function(word) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
}

function decodeEntities(encodedString) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = encodedString;
    return textArea.value;
}

function timeAgo(timestamp, type) {
    const now = Date.now();
    const delta = now - (timestamp * 1000);

    const seconds = Math.floor(delta / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if(type === 1){
        if (years > 0) {
            return years + " yr" + (years > 1 ? "s" : "") + " ago";
        } else if (months > 0) {
            return months + " mo" + (months > 1 ? "s" : "") + " ago";
        } else if (days > 0) {
            return days + " d" + (days > 1 ? "s" : "") + " ago";
        } else if (hours > 0) {
            return hours + " hr" + (hours > 1 ? "s" : "") + " ago";
        } else if (minutes > 0) {
            return minutes + " min" + (minutes > 1 ? "s" : "") + " ago";
        } else {
            return "now";
        }
    }else if(type === 2){
        if (years > 0) {
            return years + " year" + (years > 1 ? "s" : "") + " ago";
        } else if (months > 0) {
            return months + " month" + (months > 1 ? "s" : "") + " ago";
        } else if (days > 0) {
            return days + " day" + (days > 1 ? "s" : "") + " ago";
        } else if (hours > 0) {
            return hours + " hour" + (hours > 1 ? "s" : "") + " ago";
        } else if (minutes > 0) {
            return minutes + " minute" + (minutes > 1 ? "s" : "") + " ago";
        } else {
            return "just now";
        }
    }else if(type === 3){
        if (days > 0) {
            if (years > 0) {
                return years + "yr" + (years > 1 ? "s" : "") + " ago";
            } else if (months > 0) {
                return months + "mo" + (months > 1 ? "s" : "") + " ago";
            } else if (days > 0) {
                return days + "d" + (days > 1 ? "s" : "") + " ago";
            }
        } else {
            const formattedTime = new Date(timestamp * 1000);
            const jam = formattedTime.getHours().toString().padStart(2, 0);
            const menit = formattedTime.getMinutes().toString().padStart(2, 0);
            return `${jam}:${menit}`;
        }
    }
}

//-----------------------------------------------

const infoMsg_container = document.getElementById("infoMsg_container");
const infoMsg = document.getElementById("infoMsg");
//console.log(infoMsg)

let messageTimeOutID;
let isImpMessage = false;

function setInfoMsg(message, interval, isHtml){
    if(interval == 1){
        if(!isImpMessage){
            clearTimeout(messageTimeOutID);

            if(isHtml){
                infoMsg.innerHTML = message;
            }else{
                infoMsg.textContent = message;
            }
    
            infoMsg_container.style.visibility = "visible";
            messageTimeOutID = setTimeout(()=>{
                infoMsg_container.style.visibility = "hidden";
                infoMsg.textContent = null;
            }, 4000);
        }
    }else if(interval == 2){
        if(!isImpMessage){
            infoMsg_container.style.visibility = "visible";
            if(isHtml){
                infoMsg.innerHTML = message;
            }else{
                infoMsg.textContent = message;
            }
        }
    }else if(interval == 3){
        if(!isImpMessage){
            infoMsg_container.style.visibility = "hidden";
            infoMsg.textContent = null;
        }
    }else if(interval == 4){
        isImpMessage = true;
        clearTimeout(messageTimeOutID);

        if(isHtml){
            infoMsg.innerHTML = message;
        }else{
            infoMsg.textContent = message;
        }

        infoMsg_container.style.visibility = "visible";
        messageTimeOutID = setTimeout(()=>{
            isImpMessage = false;
            infoMsg_container.style.visibility = "hidden";
            infoMsg.textContent = null;
        }, 4000);
    }else {
        console.error("Invalid interval value");
    }
}

//-------------------------------------------------------

function convertLink(str) { //function corverLink
    str = str.replace(/[^a-zA-Z0-9 ]/g, " ");
    const words = str.toLowerCase().split(" ");
    const kebabCaseStr = words.join("-");
    return kebabCaseStr;
}

function formatHarga(input) {
    let num = input.value.replace(/\D/g, '');
    
    num = num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    
    input.value = num;
}

//-------------------------------------------------------------

async function fetchIklan(list_row_caller, thisKategori, thisListArray, thisLimit, thisSex, thisMin, thisMax, thisOrder, thisWarna, thisKota, thisSearch, thisUser){
        
    const response = await fetch("/data/template/data/database/api.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            fIdK:thisKategori,
            fNotIn:thisListArray,
            fLimit:thisLimit,
            fSex:thisSex,
            fMin:thisMin,
            fMax:thisMax,
            fOrder:thisOrder,
            fColor:thisWarna,
            fKota:thisKota,
            fSearch:thisSearch,
            fUser:thisUser,
            action:"fetchIklan"
        })
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(async (results) => {
        if(results.Success == true){
            //console.log(results.Message)
            await listItem(results, list_row_caller);
            setInfoMsg(null, 3);
            return results.Data;
        }else{
            //console.log("no data: " + results.Message);
            setInfoMsg(null, 3);
            return 1;
        }
    })
    .catch((error) => {
        //console.log("Error: "+error)
        setInfoMsg('Reconnecting', 1);
        return null;
    })

    return response;

    async function listItem(results, list_row_caller){ //blok per iklan
        const jsonWilayahData = await jsonData.getJsonWilayah();
        results.Data.forEach(result => {
            const list_item = document.createElement("article");
            list_item.classList.add("list_item");
            list_item.classList.add("carousel_item");
            const listall_item_control = document.createElement("div");
            listall_item_control.classList.add("list_item_control");
            const listall_item_link = document.createElement("a");
            const nameLink = convertLink(result.judul);
            listall_item_link.href = `/iklan/${result.id_i}/${nameLink}`;
            const listall_item_image_container = document.createElement("div");
            listall_item_image_container.classList.add("list_item_img_container");
            const listall_item_image = document.createElement("img");
            listall_item_image.classList.add("imgUnderLoad");
            listall_item_image.setAttribute('draggable', 'false');
            const list_item_text = document.createElement("div");
            list_item_text.classList.add("list_item_text");
    
            const divJudul = document.createElement("div");
            divJudul.classList.add("item_judul_container");
            const list_item_text_title = document.createElement("h3");
            list_item_text_title.classList.add("list_item_judul");
    
            const list_item_text_harga = document.createElement("span");
            list_item_text_harga.classList.add("list_item_harga");
            const list_item_text_lokasi = document.createElement("span");
            list_item_text_lokasi.classList.add("list_item_lokasi");
            const list_item_text_time = document.createElement("span");
            list_item_text_time.classList.add("list_item_time");
            
            if(result.namafoto){
                listall_item_image.src = `/data/assets/image/iklan/${result.id_i}/${result.namafoto}` //"/data/assets/image/iklan/red.jpeg";
            }else{
                listall_item_image.src = "/data/assets/image/logo/icon/nophoto.jpg";
            }
    
            listall_item_image.alt = result.judul;
            
            list_item_text_title.innerHTML = result.judul;
            list_item_text_harga.textContent = 'Rp ' + new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(result.harga);
            
            const wilayahHierarchy = findKategoriParentById(result.id_r, jsonWilayahData, []);
    
            const LokasiWilayah = wilayahHierarchy[0].n_nd;

            if(wilayahHierarchy.length > 1){
                
                let LokasiWilayahChild = null;

                if(wilayahHierarchy.length > 2){
                    LokasiWilayahChild = wilayahHierarchy[2].n_nd;
                }else{
                    LokasiWilayahChild = wilayahHierarchy[1].n_nd;
                }
                
                list_item_text_lokasi.textContent = `${LokasiWilayahChild} - ${LokasiWilayah}`.toUpperCase();
            }else{
                list_item_text_lokasi.textContent = LokasiWilayah.toUpperCase();
            }

            /*
            let LokasiWilayah = null;
            let LokasiWilayahChild = null;
            if(wilayahHierarchy.length > 1){
                LokasiWilayah = wilayahHierarchy[0].n_nd;

                if(wilayahHierarchy.length > 2){
                    LokasiWilayahChild = wilayahHierarchy[2].n_nd;
                }else{
                    LokasiWilayahChild = wilayahHierarchy[1].n_nd;
                }
            }else{
                LokasiWilayah = 'INDONESIA';
                LokasiWilayahChild = wilayahHierarchy[0].n_nd;
            }
            list_item_text_lokasi.textContent = `${LokasiWilayahChild} - ${LokasiWilayah}`;
            */
            
            list_item_text_time.textContent = timeAgo(result.tanggal_post, 2);
    
            list_row_caller.parentNode.insertBefore(list_item, list_row_caller);
            
            list_item.append(listall_item_control)
            listall_item_control.append(listall_item_link)
            listall_item_link.append(listall_item_image_container)
            listall_item_image_container.append(listall_item_image)
            listall_item_link.append(list_item_text)
            
            list_item_text.append(list_item_text_harga)
            list_item_text.append(divJudul)
            divJudul.append(list_item_text_title)
            list_item_text.append(list_item_text_lokasi)
            list_item_text.append(list_item_text_time)
        });
    
        imgLoader();
    }
}

/* async function listAll(thisListCaller, thisKategori, thisListArray, thisLimit, thisSex, thisMin, thisMax, thisOrder, thisWarna, thisKota, thisSearch){

    const item = await fetchIklan(thisListCaller, thisKategori, thisListArray, thisLimit, thisSex, thisMin, thisMax, thisOrder, thisWarna, thisKota, thisSearch)
    if(item){
        return item
    }else{
        return null
    }
} */

/*-----------------------------------------*/

const search_form = document.getElementById("search_form");
const search_input = document.getElementById("search_input");
const search_dropdown_container = document.getElementById("search_dropdown_container");

let isFetchSearch = false;
let waitCurrentSearch = false;

search_input.oninput = async () =>{
    if(!isFetchSearch){
        isFetchSearch = true;

        await fetchSearchText(search_input.value.trim());

        isFetchSearch = false;
        if(waitCurrentSearch){
            waitCurrentSearch = false;
            fetchSearchText(search_input.value.trim());
        }
    }else{
        waitCurrentSearch = true;
        //console.log(waitCurrentSearch)
    }
};

async function fetchSearchText(searchText){
    //console.log("last call", searchText);

    if(navigator.onLine){
        if(searchText){
            const searchText_split = searchText.split(' ');
            const searchText_lastWord = searchText_split[searchText_split.length - 1];
            const searchText_remain = searchText_split.slice(0, -1).join(' ');

            await fetch("/data/template/data/database/api.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fSearchText:searchText_lastWord,
                    fLimit:5,
                    action:"fetchSearchText"
                }),
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json()
            })
            .then((results) => {
                search_dropdown_container.textContent = null;
                if(results.Success == true){
                    const resData = results.Data;

                    const search_next_array = search_next_data(resData, searchText_lastWord);

                    search_next_array.forEach(search_next_text => {
                        const dropdown_item_main = document.createElement("div");
                        dropdown_item_main.classList.add("dropdown_search_item_main");
                        const dropdown_fulltext = searchText_remain + " " + search_next_text.toLowerCase();
                        dropdown_item_main.innerHTML = dropdown_fulltext;
                        search_dropdown_container.append(dropdown_item_main);
        
                        dropdown_item_main.onclick = () =>{
                            search_input.value = dropdown_fulltext;
                            search_form.submit();
                            showPopupLoading();
                        }
                    });

                    /* function matchingWords(dataArray, query) {
                        //console.log(dataArray)
                        const matches = new Set();
                        dataArray.forEach(data => {
                            const words = data.search_text.split(' ');
                            const datamatches = words.filter(word => word.toLowerCase().startsWith(query.toLowerCase()));
                            datamatches.forEach(match => matches.add(match.toLowerCase()));
                        });
                        return Array.from(matches);
                    } */

                    function search_next_data(dataArray, query){
                        const matches = new Set();
                        dataArray.forEach(data => {
                            const words = data.search_text.split(' ');
                            const matchingIndex = words.findIndex(word => word.toLowerCase().includes(query.toLowerCase()));
                            if (matchingIndex !== -1) {
                                const result = words.slice(matchingIndex).join(' ');
                                matches.add(result.toLowerCase());
                            }
                        });
                        return Array.from(matches);
                    }
                }
            })
            .catch((error) => {
                setInfoMsg('Error!', 1);
            })
        }else{
            search_dropdown_container.textContent = null;
        }
    }else{
        setInfoMsg("Tidak ada jaringan internet.", 1);
    }
}

/*-----------------------------------------*/

class carouselSystem{
    constructor(container, thisLoop){
        this.container = container;
        this.carousel_control = container.querySelector('.carousel_control');
        this.button_left = container.querySelector('.carousel_item_button_left');
        this.button_right = container.querySelector('.carousel_item_button_right');
        this.loop = thisLoop;

        if(this.loop){
            this.isHovered = false;
            
            container.addEventListener('mouseenter', () => {
                this.isHovered = true;
            });
            
            container.addEventListener('mouseleave', () => {
                this.isHovered = false;
            });

            setInterval(()=>{
                if(!this.isHovered){
                    this.itemScroll(true);
                }
            },10000);
        }

        this.button_left.addEventListener('mousedown', () => {
            this.itemScroll(false);
        });

        this.button_right.addEventListener('mousedown', () => {
            this.itemScroll(true);
        });

        if(this.carousel_control){
            if (this.carousel_control.scrollWidth > this.carousel_control.clientWidth) { //this.carousel_control.scrollWidth > this.carousel_control.clientWidth * 1.4
                this.displayScrollBtn();
                this.carousel_control.onscroll = () => this.displayScrollBtn();
    
                this.startXCarouselSystem;
                this.container.addEventListener('mousedown', this.handleStart.bind(this), false);
                this.container.addEventListener('touchstart', this.handleStart.bind(this), false);
    
                this.container.addEventListener('mousemove', this.handleMove.bind(this), false);
                this.container.addEventListener('touchmove', this.handleMove.bind(this), false);
    
                this.container.addEventListener('mouseup', this.handleEnd.bind(this), false);
                this.container.addEventListener('touchend', this.handleEnd.bind(this), false);
            }else{
                this.button_left.style.display = "none";
                this.button_right.style.display = "none";
    
                
                this.navContainer = this.container.querySelector(".navbar_sub");
                if(this.navContainer){
                    /* this.navContainer.style.overflow = "visible"; */
                    this.navContainer.classList.add("container_sub_dropdown");
                }
            }
        }
    }

    handleStart(event) {
        this.startXCarouselSystem = (event.type === 'mousedown') ? event.clientX : event.touches[0].clientX;
    }
    
    handleMove(event) {
        //event.preventDefault();
        
        if (!this.startXCarouselSystem) return;
        this.carousel_control.classList.add("dragging");
        let currentX = (event.type === 'mousemove') ? event.clientX : event.touches[0].clientX;
        let diffX = this.startXCarouselSystem - currentX;
    
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                //console.log("Swiped right");
                this.itemScroll(true);
            } else {
                //console.log("Swiped left");
                this.itemScroll(false);
            }
        }
    }
    
    handleEnd() {
        this.startXCarouselSystem = null;
        this.carousel_control.classList.remove("dragging");
    }

    itemScroll(direction) {
        const containerWidth = this.carousel_control.clientWidth;
        let scrollDirection;

        /* if(direction){
            scrollDirection = 1;
        }else{
            scrollDirection = -1;
        } */

        if(direction){
            const scrollDirection = 1;

            if(this.loop){
                if (this.carousel_control.scrollLeft + this.carousel_control.clientWidth === this.carousel_control.scrollWidth) {
                    
                    this.carousel_control.scrollLeft = 0;
                }else{
                    this.carousel_control.scrollLeft += scrollDirection * containerWidth;
                }
            }else{
                this.carousel_control.scrollLeft += scrollDirection * containerWidth;
                this.displayScrollBtn();
            }

        }else{
            const scrollDirection = -1;

            if(this.loop){
                if (this.carousel_control.scrollLeft === 0) {
                    
                    this.carousel_control.scrollLeft = this.carousel_control.scrollWidth;
                }else{
                    this.carousel_control.scrollLeft += scrollDirection * containerWidth;
                }
            }else{
                this.carousel_control.scrollLeft += scrollDirection * containerWidth;
                this.displayScrollBtn();
            }
        }

        /* this.carousel_control.scrollLeft += scrollDirection * containerWidth;

        this.displayScrollBtn(); */
    }

    displayScrollBtn(){
        if(!this.loop){
            if(this.button_left.style.display == "none"){
                this.button_left.style.display = "block";
            }
            
            if(this.button_right.style.display == "none"){
                this.button_right.style.display = "block";
            }
    
            if (this.carousel_control.scrollLeft === 0) {
                this.button_left.style.display = "none";
            }else if (this.carousel_control.scrollLeft + this.carousel_control.clientWidth === this.carousel_control.scrollWidth) {
                this.button_right.style.display = "none";
            }
        }
    }
}

class ButtonRow {
    constructor(container, id_k, thisListArray, thisLimit, thisSex, thisMin, thisMax, thisOrder, thisWarna, thisKota, thisSearch) {
        this.container = container;
        this.id_k = id_k;
        this.thisListArray = thisListArray;
        this.thisLimit = thisLimit;
        this.thisSex = thisSex;
        this.thisMin = thisMin;
        this.thisMax = thisMax;
        this.thisOrder = thisOrder;
        this.thisWarna = thisWarna;
        this.thisKota = thisKota;
        this.thisSearch = thisSearch;

        this.isQueued = false;
        this.waitQueued = false;

        this.list_row_container_control = container.querySelector(".list_row_container_control");
        this.list_row_caller = container.querySelector('.list_row_caller');

        this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
            root: null,
            rootMargin: '0px',
            threshold: 0
        });

        this.observer.observe(this.list_row_caller);

        this.carousel = new carouselSystem(this.list_row_container_control, false);
    }

    handleIntersection(entries) {
        if (!this.isQueued) {
            this.isQueued = true;
            setTimeout(async () => {
                entries.forEach(async entry => {
                    if (entry.isIntersecting) {
                        await this.fetchRow();
                    }
                });
                if(this.waitQueued){
                    await this.fetchRow();
                    this.waitQueued = false;
                }
                this.isQueued = false;
            }, 1000);
        }else{
            this.waitQueued = true;
        }
    }
    async fetchRow(){
        if(navigator.onLine){
            const results_row = await fetchIklan(this.list_row_caller, this.id_k, this.thisListArray, this.thisLimit, this.thisSex, this.thisMin, this.thisMax, this.thisOrder, this.thisWarna, this.thisKota, this.thisSearch, null);
            //imgLoader();
            if(results_row){
                if(results_row === 1){
                    this.list_row_caller.style.display = "none";
                }else{
                    this.carousel.displayScrollBtn();
                    results_row.forEach(result_row => {
                        listArray.push(result_row.id_i)
                    })
                    if(results_row.length < this.thisLimit){
                        //console.log(results_row.length)
                        this.list_row_caller.style.display = "none"
                    }else{
                        this.observer.unobserve(this.list_row_caller);
                        this.observer.observe(this.list_row_caller);
                    }
                }
            }else{
                //this.list_row_caller.style.display = "none";
                this.observer.unobserve(this.list_row_caller);
                this.observer.observe(this.list_row_caller);
            }
        }else{
            setInfoMsg("Tidak ada jaringan internet.", 1);
            this.observer.unobserve(this.list_row_caller);
            this.observer.observe(this.list_row_caller);
        }
    }
}

async function listrow_next(thisListContainer, thisData, thisListArray, thisLimit, thisSex, thisMin, thisMax, thisOrder, thisWarna, thisKota, thisSearch){
    const listrow = document.createElement("div");
    listrow.classList.add("listrow");

    const dataIdk = convertToArray(thisData.i_nd);
    
    const listrow_title_link = document.createElement("a");

    const listrow_title = document.createElement("h2");
    listrow_title.classList.add("rowTitle");
    listrow_title.innerHTML = thisData.n_nd;

    const listrow_button_left = document.createElement("button");
    listrow_button_left.classList.add("carousel_item_button_left");
    listrow_button_left.classList.add("carousel_button");
    listrow_button_left.innerHTML = "&#10094;";

    const listrow_button_right = document.createElement("button");
    listrow_button_right.classList.add("carousel_item_button_right");
    listrow_button_right.classList.add("carousel_button");
    listrow_button_right.innerHTML = "&#10095;";

    const list_row_container_control = document.createElement("div");
    list_row_container_control.classList.add("list_row_container_control");
    list_row_container_control.classList.add("carousel_container");

    const carousel_control = document.createElement("div");
    carousel_control.classList.add("carousel_control");

    const list_row_caller = document.createElement("div");
    list_row_caller.classList.add("list_row_caller");
    const list_row_caller_img = document.createElement("img");
    list_row_caller_img.src = "/data/assets/image/logo/icon/loading.svg";
    list_row_caller_img.alt= "loading";
    list_row_caller_img.setAttribute('draggable', 'false');

    carousel_control.append(list_row_caller);
    list_row_caller.append(list_row_caller_img);

    const item = await fetchIklan(list_row_caller, dataIdk, thisListArray, thisLimit, thisSex, thisMin, thisMax, thisOrder, thisWarna, thisKota, thisSearch, null)
    
    if(item){
        if(item === 1){
            return null
        }else{
            //const rowPaths = await fetchNamaKategori(dataIdk[0]);
            const namaKategori = findKategoriById(dataIdk[0], await jsonData.getJsonKategori());
            //console.log(namaKategori)

            listrow_title_link.href = namaKategori.link;

            thisListContainer.append(listrow)
            listrow.append(listrow_title_link)
            listrow_title_link.append(listrow_title)
            listrow.append(list_row_container_control)
            list_row_container_control.append(carousel_control)
            list_row_container_control.append(listrow_button_left)
            list_row_container_control.append(listrow_button_right)

            if(item.length < thisLimit){
                list_row_caller.style.display = "none"
            }

            new ButtonRow(listrow, dataIdk, thisListArray, thisLimit, thisSex, thisMin, thisMax, thisOrder, thisWarna, thisKota, thisSearch);

            imgLoader();
            return item
        }
    }else{
        return null
    }
}

function convertToArray(value) {
    if (Array.isArray(value)) {
        return value;
    } else {
        return [value];
    }
}

/* ------------------------------------------------------------ */

let log_message = null; //tdk pel

async function login(e){

    e.preventDefault();

    if(navigator.onLine){
        const email = e.srcElement.elements.logEmail;
        const emailValue = email.value.trim();
        const password = e.srcElement.elements.logPassword;
        const passwordValue = password.value;
        const submitBtn = e.srcElement[2];
    
        log_message.textContent = "Loading...";
        submitBtn.disabled = true;
    
        await fetch("/data/template/data/database/api.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                femail:emailValue,
                fpassword:passwordValue,
                action:"login"
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
                //localStorage.setItem('token_user', results.Data);
                setInfoMsg(results.Message, 1);
                displayLog();
                log_message.textContent = null;
                password.value = null;
            }else{
                setInfoMsg(results.Message , 1);
                log_message.textContent = results.Message;
            }
        })
        .catch((error) => {
            //console.log("Error: "+error)
            log_message.textContent = "Terjadi kesalahan, mohon coba lagi!";
        })
    
        submitBtn.disabled = false;   
    }else{
        log_message.textContent = "Tidak ada jaringan internet.";
        setInfoMsg("Tidak ada jaringan internet.", 1);
    }
}

async function signup(e){

    e.preventDefault();

    if(navigator.onLine){
        log_message.textContent = "Loading...";

        const name = e.srcElement.elements.signName;
        const email = e.srcElement.elements.signEmail;
        const password = e.srcElement.elements.signPassword;
        
        const nameValue = name.value.trim();
        const emailValue = email.value.trim();
        const passwordValue = password.value;
    
        const submitBtn = e.srcElement[3];
    
        submitBtn.disabled = true;
    
        await fetch("/data/template/data/database/api.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fname:nameValue,
                femail:emailValue,
                fpassword:passwordValue,
                action:"signup"
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
    
                verifikasiEmailSignupForm(emailValue);
    
                log_message.textContent = results.Message;
    
                setInfoMsg(results.Message, 1);
    
                name.value = null;
                email.value = null;
                password.value = null;
            }else{
                setInfoMsg(results.Message , 1);
                log_message.textContent = results.Message;
            }
        })
        .catch((error) => {
            //console.log("Error: "+error);
            log_message.textContent = "Terjadi kesalahan, mohon coba lagi!";
        })
    
        submitBtn.disabled = false;
    }else{
        log_message.textContent = "Tidak ada jaringan internet.";
        setInfoMsg("Tidak ada jaringan internet.", 1);
    }
}

async function verifikasiSignUp(e, email){
    e.preventDefault();

    if(navigator.onLine){
        log_message.textContent = "Loading...";

        const code = e.srcElement.elements.codeVerifikasiSignUp;
        const codeValue = code.value.trim();
        const submitBtn = e.srcElement[1];
        submitBtn.disabled = true;
    
        await fetch("/data/template/data/database/api.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fEmail: email,
                fCode: codeValue,
                action:"verifikasiSignUp"
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
                //localStorage.setItem('token_user', uTokenSignUp);
                displayLog();
                code.value = null;
            }else{
                setInfoMsg(results.Message , 1);
                log_message.textContent = results.Message;
            }
        })
        .catch((error) => {
            //console.log("Error: "+error);
            log_message.textContent = "Terjadi kesalahan, mohon coba lagi!";
        })
        submitBtn.disabled = false;
    }else{
        log_message.textContent = "Tidak ada jaringan internet.";
        setInfoMsg("Tidak ada jaringan internet.", 1);
    }
}

async function changePassword(e){
    e.preventDefault();

    if(navigator.onLine){
        log_message.textContent = "Loading...";
        const email = e.srcElement.elements.forgetEmail;
        const submitBtn = e.srcElement[1];
        submitBtn.disabled = true;
        
        const emailValue = email.value.trim();
    
        await fetch("/data/template/data/database/api.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fEmail: emailValue,
                action:"changPassLog"
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
                log_message.textContent = results.Message;
                email.value = null;
            }else{
                setInfoMsg(results.Message , 1);
                log_message.textContent = results.Message;
            }
        })
        .catch((error) => {
            //console.log("Error: "+error);
            log_message.textContent = "Terjadi kesalahan, mohon coba lagi!";
        })
        
        submitBtn.disabled = false;
    }else{
        log_message.textContent = "Tidak ada jaringan internet.";
        setInfoMsg("Tidak ada jaringan internet.", 1);
    }
}

function delete_cookie( name, path, domain ) {
    if(get_cookie(name)) {
        document.cookie = name + "=" +
            ((path) ? ";path="+path:"")+
            ((domain)?";domain="+domain:"") +
            ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
    function get_cookie(name){
        return document.cookie.split(';').some(c => {
            return c.trim().startsWith(name + '=');
        });
    }
}

function logout(){
    //document.cookie = userCookieName + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    delete_cookie( userCookieName, "/", domain);
    setInfoMsg("Logged out", 1);
    displayLog();
}

//-----------------------------------------------------------

const popupcontainer = document.getElementById("popupcontainer");
const popupcontrol = document.getElementById("popupcontrol");
const closePopupDisplayBtn = document.getElementById("closePopupDisplayBtn");

closePopupDisplayBtn.onclick = closeDisplayPopup;

function closeDisplayPopup(){
    popupcontainer.style.display = "none";
    document.body.style.overflow = null;
}

function displayPopupData(htmldata, thisclass){
    document.body.style.overflow = "hidden";
    
    popupcontainer.style.display = "flex";
    /* popupcontainer.style.animation = "displayFade 0.15s"; */
    
    popupcontrol.classList.value = "";
    popupcontrol.classList.add(thisclass);

    const popupDataContainer = document.getElementById("popupDataContainer");
    popupDataContainer.innerHTML = htmldata;
}


//-------------------------------------------------------------

function displayLoginForm(){
    const loginTemplate = `
    <div class="log_title">Login</div>
    <div class="log_message"></div>
    <form onsubmit="login(event)">
        <label class="formLabel">Email:
            <input class='form-control' type="email" name="logEmail" placeholder="Email">
        </label>

        <label class="formLabel">Password:
            <input class='form-control' type="password" name="logPassword" placeholder="Password">
        </label>
        
        <input class="btn" type="submit" value="Login">
    </form>
    <a class="google_auth_btn_container" href="${authUrlGoole}">
        <img draggable="false" class="google_auth_logo" src="/data/assets/image/logo/icon/google.svg" alt="Sign in with Google">
        <span class="google_auth_text">Sign in with Google</span>
    </a>
    <p class="text_log" id="displayLogForgetBtn">Lupa Password</p>
    <p class="text_log">Belum punya account? <span id="displayLogSignUpBtn">Sign up</span></p>
    `;
    
    const classLogin = "log_container_control";
    displayPopupData(loginTemplate, classLogin);
    log_message = document.querySelector(".log_message");

    //const displayLogLoginBtn = document.getElementById("displayLogLoginBtn");
    const displayLogForgetBtn = document.getElementById("displayLogForgetBtn");
    const displayLogSignUpBtn = document.getElementById("displayLogSignUpBtn");

    displayLogSignUpBtn.onclick = displaySignupForm;
    displayLogForgetBtn.onclick = displayForgetPasswordForm;
}


function displaySignupForm(){
    const signupTemplate = `
    <div class="log_title">Sign Up</div>
    <div class="log_message"></div>
    <form onsubmit="signup(event)">
        <label class="formLabel">Username:
            <input class='form-control' type="text" name="signName" placeholder="Username">
        </label>

        <label class="formLabel">Email:
            <input class='form-control' type="email" name="signEmail" placeholder="Email">
        </label>

        <label class="formLabel">Password: 
            <input class='form-control' type="password" name="signPassword" placeholder="Password">
        </label>
        
        <input class="btn" type="submit" value="Sign up">
    </form>
    <a class="google_auth_btn_container" href="${authUrlGoole}">
        <img draggable="false" class="google_auth_logo" src="/data/assets/image/logo/icon/google.svg" alt="Sign up with Google">
        <span class="google_auth_text">Sign up with Google</span>
    </a>
    <p class="text_log">Sudah punya account? <span id="displayLogLoginBtn">Login</span></p>
    `;
    
    const classSignup = "log_container_control";
    displayPopupData(signupTemplate, classSignup);
    log_message = document.querySelector(".log_message");

    const displayLogLoginBtn = document.getElementById("displayLogLoginBtn");
    displayLogLoginBtn.onclick = displayLoginForm;
}

function verifikasiEmailSignupForm(email){
    const verifikasiSignupTemplate = `
    <div class="log_title">Verifikasi Email</div>
    <div class="log_message"></div>
    <div class="emailSignUpContainer">
        <span class="emailSignUpTitle">Email: </span><span id="verifEmailSignUpText"></span>
    </div>
    <form onsubmit="verifikasiSignUp(event, '${email}')">
        <label class="formLabel">Code:
            <input class='form-control' type="text" name="codeVerifikasiSignUp" placeholder="Code">
        </label>
        <input class="btn" type="submit" value="Verifikasi">
    </form>
    <p class="text_log">Kembali? <span id="displayLogLoginBtn">Login</span></p>
    `;
    
    const classVerifikasiSignup = "log_container_control";
    displayPopupData(verifikasiSignupTemplate, classVerifikasiSignup);
    log_message = document.querySelector(".log_message");
    const displayLogLoginBtn = document.getElementById("displayLogLoginBtn");
    displayLogLoginBtn.onclick = displayLoginForm;

    const verifEmailSignUpText = document.getElementById("verifEmailSignUpText");
    verifEmailSignUpText.textContent = email;
}


function displayForgetPasswordForm(){
    const forgerpasswordTemplate = `
    <div class="log_title">Ubah Password</div>
    <div class="log_message"></div>
    <form onsubmit="changePassword(event)">
        <label class="formLabel">Email:
            <input class='form-control' type="email" name="forgetEmail" placeholder="Email">
        </label>
        <input class="btn" type="submit" value="Change">
    </form>
    <p class="text_log">Kembali? <span id="displayLogLoginBtn">Login</span></p>
    `;
    
    const classForgetPassword = "log_container_control";
    displayPopupData(forgerpasswordTemplate, classForgetPassword);
    log_message = document.querySelector(".log_message");
    const displayLogLoginBtn = document.getElementById("displayLogLoginBtn");
    displayLogLoginBtn.onclick = displayLoginForm;
}

//------------------------------------------------------------


const pasangIkanBtn = document.getElementById("pasangIkanBtn");
const logControlBtn = document.getElementById("logControlBtn");
//const log_container = document.getElementById("log_container");

pasangIkanBtn.onclick = () =>{
    const res = logCheck();
    if(res){
        //go to link
        showPopupLoading();
        window.location.href = "/editor-iklan";
    }else{
        //log_container.style.display = "flex";
        displayLoginForm();
        setInfoMsg("Login terlebih dahulu", 1);
    }
}

logControlBtn.onclick = () =>{
    const res = logCheck();
    if(res){
        logout();
    }else{
        //log_container.style.display = "flex";
        displayLoginForm();
    }
}

function displayLog(){
    const profileBtn = document.getElementById("profileBtn");
    const res = logCheck();
    if(res){
        displayClient();
        closeDisplayPopup();
    }else{
        displayGuest();
    }

    function displayClient(){
        logControlBtn.textContent = "Logout";
        logControlBtn.style.display = "none";
        profileBtn.style.display = "block";

        profileBtn.innerHTML = `
            <button class="btn">Profile</button>
            <div class="dropdown_container_child dropdown_item_parent profile_dropdown">
                <div class="dropdown_container_parent dropdown_item_child"><a class="dropdown_item_main" href="/setting-profile">Setting</a></div>
                <div class="dropdown_container_parent dropdown_item_child"><a class="dropdown_item_main" href="/chat">Pesan</a></div>
                <div class="dropdown_container_parent dropdown_item_child"><a class="dropdown_item_main" href="/wishlist">Wishlist</a></div>
                <div class="dropdown_container_parent dropdown_item_child"><a class="dropdown_item_main" href="/iklan-saya">Iklan Saya</a></div>
                <div class="dropdown_container_parent dropdown_item_child"><span class="dropdown_item_main profile_logout" onclick='logout()'>Logout</span></div>
            </div>
        `;
        
        /* const adminCheck = verifAdmin();
        if(adminCheck){
            //adminBtn.style.display = "block";
        } */
    }

    function displayGuest(){
        logControlBtn.style.display = "block";
        logControlBtn.textContent = "Login";
        profileBtn.style.display = "none";
    }
}

displayLog();

//----------------------------------------------------------------------

document.addEventListener('click', function(event) {
    const anchor = event.target.closest('a');
    if (anchor) {
        const showPopupAttr = anchor.getAttribute('data-cpop');
        if (showPopupAttr !== 'false') {
            showPopupLoading();
        }
    }
});

function showPopupLoading() {
    const popLoadingTemplate = `
        <div class="popup_loader"></div>
    `;
    const classPopLoading = "popup_loader_container";
    displayPopupData(popLoadingTemplate, classPopLoading);
}

window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        closeDisplayPopup();
    }
});


//--------------------------------------------------------------------------------

function showImgLoaded(loadingImg){
    //console.log(loadingImg);
    loadingImg.classList.remove('imgUnderLoad');
    loadingImg.classList.add('imgLoaded');
}

function imgLoader() {
    const loadingImgs = document.querySelectorAll('.imgUnderLoad');

    loadingImgs.forEach(function(loadingImg) {
        if (!loadingImg.complete) {
            loadingImg.onload = function() {
                showImgLoaded(loadingImg);
            };
        } else {
            showImgLoaded(loadingImg);
        }
    });
}

document.addEventListener('DOMContentLoaded', imgLoader);


//---------------------------------------------- adm

function insertImage(inputFileKategori) {
    return new Promise((resolve, reject) => {
        const file = inputFileKategori.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const binaryBlob = reader.result;
                resolve(binaryBlob);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        } else {
            resolve(null);
        }
    });
}

//----------

const navbar_container = document.querySelector(".navbar_container");
new carouselSystem(navbar_container, false);


//-----------------------

function findKategoriById(id_k, thisData) {
    if(id_k){
        for (let i = 0; i < thisData.length; i++) {
            if (thisData[i].i_nd === id_k) {
                return thisData[i];
            }
            if (thisData[i].c_nd) {
                const result = findKategoriById(id_k, thisData[i].c_nd);
                if (result) return result;
            }
        }
    }

    return null;
}

function findKategoriParentById(id_k, thisData, pathKategori) {
    const kategoriIdParent = findKategoriById(id_k, thisData);

    if(kategoriIdParent){
        //pathKategori.push(kategoriIdParent);
        pathKategori = [kategoriIdParent, ...pathKategori];

        if(kategoriIdParent.s_nd){
            return findKategoriParentById(kategoriIdParent.s_nd, thisData, pathKategori);
        }else{
            return pathKategori;
        }
    }else{
        reError(404);
    }
}

function findKategoriChild(thisKategoriAll, thisLevel){
    return findKategoriChildLevel(thisKategoriAll, 1);

    function findKategoriChildLevel(thisKategoriLevel, thisIndexLevel){
        let result = [];
        thisKategoriLevel.forEach(thisKategoriChild => {
            if(thisIndexLevel <= thisLevel){
                if (thisIndexLevel === thisLevel) {
                    result.push(thisKategoriChild);
                }
                const childKategori = thisKategoriChild.c_nd;
                if (thisIndexLevel < thisLevel) {
                    result.push(...findKategoriChildLevel(childKategori, thisIndexLevel + 1));
                }
            }
        })
        return result;
    }
}

function findKategoriByName(name, thisData, thisRes) {
    if (name) {
        name = name.toLowerCase();
        for (let i = 0; i < thisData.length; i++) {
            if (thisData[i].n_nd.toLowerCase().includes(name)) {
                thisRes.push(thisData[i]);
            }
            if (thisData[i].c_nd) {
                const result = findKategoriByName(name, thisData[i].c_nd, thisRes);
            }
        }
    }
    return thisRes;
}

//---------------------------------------------------------------------

function nestedDataPopUp(jsonData, nestedCallback, nestedMainName){
    const popNestedDataTemplate = `
        <div id="pop_nested_header"></div>
        <div class="input_search_container_nested input_search_container">
            <input class="search_input_form" aria-label="cari" id="search_input_nested" autocomplete="off" placeholder="Cari">
            <div class="dropdown_search_item" id="search_dropdown_container_nested"></div>
        </div>
        <div id="pop_nested_child"></div>
    `;
    
    const classNestedData = "pop_nested_data_container";
    displayPopupData(popNestedDataTemplate, classNestedData);

    displayNestedData(jsonData, null);
    displayNestedSearch();

    function displayNestedSearch(){
        const search_input_nested = document.getElementById("search_input_nested");
        const search_dropdown_container_nested = document.getElementById("search_dropdown_container_nested");

        search_input_nested.oninput = ()=>{

            search_dropdown_container_nested.textContent = null;

            const resSearch = findKategoriByName(search_input_nested.value.trim(), jsonData, []);

            if(resSearch.length){
                /* resSearch.forEach((thisData, index) => {
                    if (index >= 100) {
                        console.log("break");
                        return;
                    }
                    const dropdown_item_main = document.createElement("div");
                    dropdown_item_main.classList.add("dropdown_search_item_main");
                    dropdown_item_main.innerHTML = thisData.n_nd.toLowerCase();
                    search_dropdown_container_nested.append(dropdown_item_main);
    
                    dropdown_item_main.onclick = () =>{
                        search_input_nested.value = thisData.n_nd.toLowerCase();
                        nestedCallback(thisData);
                    }
                    console.log(index);
                }); */
                resSearch.slice(0, 100).forEach(thisData => {
                    let parentData = null;
                    let parentName = null;
                    if(thisData.s_nd){
                        parentData = findKategoriById(thisData.s_nd,jsonData);
                        parentName = parentData.n_nd.toLowerCase();
                    }
                    const dropdown_item_main = document.createElement("div");
                    dropdown_item_main.classList.add("dropdown_search_item_main");
                    dropdown_item_main.innerHTML = thisData.n_nd.toLowerCase() 
                        + (parentName ? ` - ${parentName}` : '');
                    search_dropdown_container_nested.append(dropdown_item_main);
            
                    dropdown_item_main.onclick = () => {
                        search_input_nested.value = thisData.n_nd.toLowerCase();
                        nestedCallback(thisData);
                    }
                    
                    //console.log(parentData);
                });
            }
        }
    }

    function displayNestedData(nestedChildData, nestedParentData) {
        const childContainer = document.getElementById("pop_nested_child");
        const popNestedHeader = document.getElementById("pop_nested_header");
        childContainer.textContent = null;
        popNestedHeader.textContent = null;
    
        const popNestedTitle = document.createElement("span");
        popNestedTitle.classList.add("pop_nested_title");
    
        if(nestedParentData){
            const backButton = document.createElement("button");
            backButton.classList.add("btn");
            backButton.textContent = "«";
    
            popNestedTitle.innerHTML = nestedParentData.n_nd;
            popNestedTitle.onclick = ()=>{
                nestedCallback(nestedParentData);
            }
    
            popNestedHeader.append(backButton);
    
            backButton.onclick = () => {
                if(nestedParentData.s_nd){
                    const nestedParentParentData = findKategoriById(nestedParentData.s_nd, jsonData);
                    displayNestedData(nestedParentParentData.c_nd, nestedParentParentData);
                }else{
                    displayNestedData(jsonData, null);
                }
            }
        }else{
            popNestedTitle.innerHTML = nestedMainName;
            popNestedTitle.onclick = ()=>{
                nestedCallback(null);
            }
        }
    
        popNestedHeader.append(popNestedTitle);
        
        nestedChildData.map(thisData => {
            const containerNestedList = document.createElement("div");
            containerNestedList.classList.add("container_nested_list");
    
            const containerNestedListName = document.createElement("span");
            containerNestedListName.classList.add("container_nested_list_name");
            containerNestedListName.innerHTML = thisData.n_nd;

            containerNestedListName.onclick = ()=>{
                nestedCallback(thisData);
            }
    
            containerNestedList.append(containerNestedListName);
            
            if(thisData.c_nd.length){
                const childBtn = document.createElement("button");
                childBtn.classList.add("btn");
                childBtn.textContent = "»";
        
                childBtn.onclick = () => {
                    displayNestedData(thisData.c_nd, thisData);
                };
                containerNestedList.append(childBtn);
            }
            
            childContainer.append(containerNestedList);
        });
    }
}

//------------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", function() {
    const popKategoriBtn = document.querySelectorAll(".pop_kategori_btn");

    popKategoriBtn.forEach(thisKategori => {
        thisKategori.onclick = async () =>{
            thisKategori.disabled = true;
            nestedDataPopUp(await jsonData.getJsonKategori(), kategoriPopUpBase, "Kategori");
            thisKategori.disabled = false;
        }
    });
});

function kategoriPopUpBase(data){
    showPopupLoading();
    if(data){
        window.location.href = data.link;
    }else{
        window.location.href = '/kategori';
    }
}

//------------------------------------------------------------------------------

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

async function updateOnlineStatus() {
    const netz_text = navigator.onLine ? "Jaringan Online" : 'Jaringan Offline';
    setInfoMsg(netz_text, 1);
}

//------------------------------------------------------------------------------------

function sendChatMail(idp){
    if(navigator.onLine){
        fetch("/data/template/data/database/api.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fidp:idp,
                action:"mailPesanChat"
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
                /* if(results.noAccess){
                    reError(401);
                }else if(results.unToken){
                    logout();
                } */
                setInfoMsg(results.Message , 1);
            }
        })
        .catch((error) => {
            setInfoMsg("Error!", 1);
        })
    }else{
        setInfoMsg("Tidak ada jaringan internet.", 1);
    }
}

search_input.addEventListener("focus", function() {
    this.select();
});