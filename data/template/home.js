
const ads_bar_container = document.querySelector(".ads_bar_container");
if(ads_bar_container){
    ads_bar_container.style.display = "block";
    new carouselSystem(ads_bar_container, true);
}

//---------------------------------------------------------------------------------------------------

const listRowElements = document.getElementById("listhome");
const listAllItemContainer = document.getElementById("listAllItemContainer");

let listArray = [];
let listKategori = [];

fStart();

async function fStart(){
    const sendSex = null;
    const sendHargaMin = null;
    const sendHargaMax = null;
    const sendOrder = null;
    const sendWarna = null;
    const sendKota = null;
    const sendSearch = null;

    const sendLimitRow = 8;

    //------

    const allCaller = document.createElement("div");
    allCaller.classList.add("list_all_caller");

    const list_row_caller_img = document.createElement("img");
    list_row_caller_img.src = "/data/assets/image/logo/icon/loading.svg";
    list_row_caller_img.alt = "loading";
    list_row_caller_img.setAttribute('draggable', 'false');

    allCaller.append(list_row_caller_img);
    
    listAllItemContainer.append(allCaller);

    //------

    const stored_rekomendasi_idk = localStorage.getItem('Rekomendasi_Kategori');
    if(stored_rekomendasi_idk){
        const retrieved_rekomendasi_idk = JSON.parse(stored_rekomendasi_idk);
        const rekomendasiData = {"i_nd":retrieved_rekomendasi_idk,"n_nd":"Rekomendasi"};

        //console.log(rekomendasiData)
        await startListRow(rekomendasiData);
    }

    const jsonKategoriData = await jsonData.getJsonKategori();
    
    for(let i = 0; i < 5; i++){
        
        const rowKategori = findKategoriChild(jsonKategoriData, 2);
        const notInKategori = notInArray(rowKategori, listKategori);
        if(notInKategori){
            const randomMyArray = randomDataArray(notInKategori);
            await startListRow(randomMyArray);
        }
    }

    const kategoriArray = null;
    const sendLimitAll = 12;

    const observer = new IntersectionObserver(handleIntersection, {
        root: null,
        rootMargin: '0px', 
        threshold: 0
    });

    observer.observe(allCaller);

    let isQueued = false;
    let waitQueued = false;

    function notInArray(dataAll, notInData){
        const result = dataAll.filter(element => !notInData.includes(element.i_nd));

        if(result.length){
            //console.log(result)
            return result;
        }else{
            return null;
        }
    }

    function randomDataArray(array) {
        const index = Math.floor(Math.random() * array.length);
        return array[index];
    }

    function handleIntersection(entries) {
        if (!isQueued) {
            isQueued = true;
            setTimeout(async () => {
                entries.forEach(async entry => {
                    if (entry.isIntersecting) {
                        await fetchListAll();
                    }
                });
                if(waitQueued){
                    await fetchListAll();
                    waitQueued = false;
                }
                isQueued = false;
            }, 1000);
        }else{
            waitQueued = true;
        }
    }

    async function startListRow(kategoriData) {
        if(navigator.onLine){
            listKategori.push(kategoriData.i_nd);
            const results_rekomendasi = await listrow_next(listRowElements, kategoriData, listArray, sendLimitRow, sendSex, sendHargaMin, sendHargaMax, sendOrder, sendWarna, sendKota, sendSearch)
            if(results_rekomendasi){
                results_rekomendasi.forEach(result => {
                    listArray.push(result.id_i);
                })
            }
        }else{
            setInfoMsg("Tidak ada jaringan internet.", 1);
        }
    }

    async function fetchListAll(){
        if(navigator.onLine){
            const results_all = await fetchIklan(allCaller, kategoriArray, listArray, sendLimitAll, sendSex, sendHargaMin, sendHargaMax, sendOrder, sendWarna, sendKota, sendSearch, null);
            if(results_all){
                if(results_all === 1){
                    allCaller.style.display = "none";
                }else{
                    results_all.forEach(result_all => {
                        listArray.push(result_all.id_i)
                    })
                    
                    if(results_all.length < sendLimitAll){
                        allCaller.style.display = "none";
                    }else{
                        observer.unobserve(allCaller);
                        observer.observe(allCaller);
                    }
                }
            }else{
                //console.log("End!");
                //allCaller.style.display = "none";
                observer.unobserve(allCaller);
                observer.observe(allCaller);
            }
        }else{
            setInfoMsg("Tidak ada jaringan internet.", 1);
            //allCaller.style.display = "none";
            observer.unobserve(allCaller);
            observer.observe(allCaller);
        }
    }
}