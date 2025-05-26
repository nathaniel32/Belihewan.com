
const originalPath = kategori_Id;

const showmore = document.getElementById("showmore");
const itemCall = document.getElementById("itemCall");

const observer = new IntersectionObserver(handleIntersection, {
    root: null,
    rootMargin: '0px', 
    threshold: 0
});

function handleIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if(!isQueuedChFilter){
                isAutoCaller = true;
                getItem();
            }
        }
    });
}

const listElements = document.getElementById("listAllItemContainer");
let listArray = [];
let kategoriArray = [];
const globalLimit = 30;

let globalSex = null;
let globalHargaMin = null;
let globalHargaMax = null;
let globalOrder = null;
let globalWarna = null;
let globalKota = null;
let globalSearch = null;

let isQueued = false;
let isCurrentItem = true;
let isAutoCaller = false;

async function getItem(){
    if(listArray.length == 0){
        deleteDisplayAll();
    }
    if(navigator.onLine){
        //console.log("OKKLoading");
        setInfoMsg('Loading...', 2);
        if (!isQueued) {
            isQueued = true;
            const results_all = await fetchIklan(showmore, kategoriArray, listArray, globalLimit, globalSex, globalHargaMin, globalHargaMax, globalOrder, globalWarna, globalKota, globalSearch, null)
            if(results_all){
                if(results_all === 1){
                    itemCall.style.display = "none";
                    if(listArray.length == 0){
                        deleteDisplayAllNoCall();
                        const noDataSpan = document.createElement("span");
                        noDataSpan.classList.add("noDataItem");
                        noDataSpan.textContent = "Tidak ada iklan ditemukan.";
                        listElements.append(noDataSpan);
                    }
                }else{
                    results_all.forEach(result_all => {
                        listArray.push(result_all.id_i)
                    })
                    if(results_all.length < globalLimit){
                        itemCall.style.display = "none";
                    }else{
                        setTimeout(() => {
                            observer.unobserve(itemCall);
                            observer.observe(itemCall);
                        }, 1000);
                    }
                }
            }else{
                setTimeout(() => {
                    observer.unobserve(itemCall);
                    observer.observe(itemCall);
                }, 1000);
            }

            setTimeout(()=>{
                isQueued = false;
            
                if(!isCurrentItem && !isAutoCaller){
                    //console.log("getItem Again")
                    isCurrentItem = true;
                    isAutoCaller = true;
                    listArray = [];
                    deleteDisplayAll();
                    getItem();
                }else if(!isCurrentItem){
                    isCurrentItem = true;
                    getItem();
                    //console.log("autocurrent")
                }
            }, 1000);
        }else{
            isCurrentItem = false;
            //console.log("Call Again");
        }
    }else{
        //itemCall.style.display = "none";
        if(listArray.length == 0){
            const noDataSpan = document.createElement("span");
            noDataSpan.classList.add("noDataItem");
            noDataSpan.textContent = "Tidak ada jaringan internet.";
            listElements.append(noDataSpan);
        }else{
            setInfoMsg("Tidak ada jaringan internet.", 1);
        }

        setTimeout(() => {
            observer.unobserve(itemCall);
            observer.observe(itemCall);
        }, 1000);
    }
}

//---------------------------------------------------------------------------------------------------- filter

let optionCheckboxes = document.querySelectorAll('.option');
let subOptionCheckboxes = document.querySelectorAll('.subOption');

/* const changeFilter = document.getElementById("changeFilter");

changeFilter.onclick = changefFilter; */

const sexInput = document.getElementById("sexInput");
const hargaMin = document.getElementById("hargaMin");
const hargaMax = document.getElementById("hargaMax");
const orderInput = document.getElementById("orderInput");
const warnaInput = document.getElementById("warnaInput");
const searchItem = document.getElementById("searchItem");
const lokasiItem = document.getElementById("lokasiItem");

//changefFilter();

sexInput.oninput = changefFilter;
hargaMin.oninput = function() {
    formatHarga(this);
    changefFilter();
};
hargaMax.oninput = function() {
    formatHarga(this);
    changefFilter();
};
orderInput.oninput = changefFilter;
warnaInput.oninput = changefFilter;
searchItem.oninput = changefFilter;

let isQueuedChFilter = false;


const filterResultLokasiContainer = document.getElementById("filterResultLokasiContainer");
const lokasiInput = document.getElementById("lokasiInput");

lokasiInput.onclick = async () =>{
    lokasiInput.disabled = true;
    nestedDataPopUp(await jsonData.getJsonWilayah(), lokasiPopUpFilterKategori, "Wilayah");
    lokasiInput.disabled = false;
}

function lokasiPopUpFilterKategori(data){
    if(data){
        const ls_data = {
            id: data.i_nd,
            nama:data.n_nd
        }
        localStorage.setItem('usedWi', JSON.stringify(ls_data));
        lokasiItem.textContent = data.n_nd;
        lokasiItem.setAttribute('data-lokasi', data.i_nd);
        closeDisplayPopup();
        changefFilter();
        filterResultLokasiContainer.style.display = "flex";
    }
}

const lokasiDelete = document.getElementById("lokasiDelete");
lokasiDelete.onclick = ()=>{
    removeLokasiMain();
    changefFilter();
}

function removeLokasiMain(){
    localStorage.removeItem('usedWi');
    lokasiItem.textContent = null;
    lokasiItem.removeAttribute("data-lokasi");
    filterResultLokasiContainer.style.display = "none";
}

function deleteDisplayAll(){
    itemCall.style.display = "block";
    deleteDisplayAllNoCall();
}

function deleteDisplayAllNoCall(){
    const list_items_class = document.querySelectorAll(".list_item");
    list_items_class.forEach(item => {
        item.remove();
    });
    const list_nodata_class = document.querySelectorAll(".noDataItem");
    list_nodata_class.forEach(item => {
        item.remove();
    });
}

const info_filter_search = document.getElementById("info_filter_search");
const info_filter_wilayah = document.getElementById("info_filter_wilayah");
const info_filter_order = document.getElementById("info_filter_order");
const info_filter_sex = document.getElementById("info_filter_sex");
const info_filter_warna = document.getElementById("info_filter_warna");
const info_filter_min = document.getElementById("info_filter_min");
const info_filter_max = document.getElementById("info_filter_max");
const info_filter_kategori = document.getElementById("info_filter_kategori");

info_filter_search.onclick = () => {
    infoFilterControl(1, true);
    changefFilter();
};
info_filter_wilayah.onclick = () => {
    infoFilterControl(2, true);
    changefFilter();
};
info_filter_order.onclick = () => {
    infoFilterControl(3, true);
    changefFilter();
};
info_filter_sex.onclick = () => {
    infoFilterControl(4, true);
    changefFilter();
};
info_filter_warna.onclick = () => {
    infoFilterControl(5, true);
    changefFilter();
};
info_filter_min.onclick = () => {
    infoFilterControl(6, true);
    changefFilter();
};
info_filter_max.onclick = () => {
    infoFilterControl(7, true);
    changefFilter();
};
info_filter_kategori.onclick = () => {
    infoFilterControl(8, true);
    changefFilter();
    //window.location.href = "/kategori";
    //showPopupLoading();
};

function infoFilterControl(nrTarget, toDelete){
    switch (nrTarget) {
        case 1:
            if(toDelete){
                searchItem.value = null;
                info_filter_search.style.display = "none";
            }else{
                info_filter_search.style.display = "flex";
            }
            break;
        case 2:
            if(toDelete){
                removeLokasiMain();
                info_filter_wilayah.style.display = "none";
            }else{
                info_filter_wilayah.style.display = "flex";
            }
            break;
        case 3:
            //container_target = orderInput;
            if(toDelete){
                orderInput.value = '';
                info_filter_order.style.display = "none";
            }else{
                info_filter_order.style.display = "flex";
            }
            break;
        case 4:
            //container_target = sexInput;
            if(toDelete){
                sexInput.value = '';
                info_filter_sex.style.display = "none";
            }else{
                info_filter_sex.style.display = "flex";
            }
            break;
        case 5:
            //container_target = warnaInput;
            if(toDelete){
                warnaInput.value = '';
                info_filter_warna.style.display = "none";
            }else{
                info_filter_warna.style.display = "flex";
            }
            break;
        case 6:
            //container_target = hargaMin;
            if(toDelete){
                hargaMin.value = null;
                info_filter_min.style.display = "none";
            }else{
                info_filter_min.style.display = "flex";
            }
            break;
        case 7:
            //container_target = hargaMax;
            if(toDelete){
                hargaMax.value = null;
                info_filter_max.style.display = "none";
            }else{
                info_filter_max.style.display = "flex";
            }
            break;
        case 8:
            if(toDelete){
                const filterKategoriContainer = document.getElementById("filterKategoriContainer");
                if(filterKategoriContainer){
                    const checkboxesKategori = filterKategoriContainer.querySelectorAll('input[type="checkbox"]');
                    checkboxesKategori.forEach(checkbox => {
                        //console.log(checkbox);
                        checkbox.checked = false;
                    });
                }
                
                info_filter_kategori.style.display = "none";
            }else{
                info_filter_kategori.style.display = "flex";
            }
            break;
        default:
            console.log("Tombol Tidak Valid!");
    }
}

async function changefFilter(){
    isQueuedChFilter = true;

    deleteDisplayAll();

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    if(sexInput.value){
        globalSex = sexInput.value;
        infoFilterControl(4, false);
    }else{
        globalSex = null;
        infoFilterControl(4, true);
    }

    if(hargaMin.value){
        globalHargaMin = hargaMin.value.trim().replace(/\./g, '');
        infoFilterControl(6, false);
    }else{
        globalHargaMin = null;
        infoFilterControl(6, true);
    }

    if(hargaMax.value){
        globalHargaMax = hargaMax.value.trim().replace(/\./g, '');
        infoFilterControl(7, false);
    }else{
        globalHargaMax = null;
        infoFilterControl(7, true);
    }

    if(orderInput.value){
        globalOrder = orderInput.value;
        infoFilterControl(3, false);
    }else{
        globalOrder = null;
        infoFilterControl(3, true);
    }

    if(warnaInput.value){
        globalWarna = warnaInput.value;
        infoFilterControl(5, false);
    }else{
        globalWarna = null;
        infoFilterControl(5, true);
    }

    globalKota = lokasiItem.getAttribute('data-lokasi');
    if(globalKota){
        infoFilterControl(2, false);
    }else{
        infoFilterControl(2, true);
    }

    if(searchItem.value){
        globalSearch = searchItem.value.trim();
        infoFilterControl(1, false);
    }else{
        globalSearch = null;
        infoFilterControl(1, true);
    }

    const breadCrumbContainer = document.getElementById("breadCrumbContainer");
    const thisKategori = getfKategori();
    const jsonKategoriData = await jsonData.getJsonKategori();
    if(thisKategori.length != 0){
        if(thisKategori.length == 1 && thisKategori != originalPath){
            const currentNamePaths = findKategoriParentById(thisKategori[0], jsonKategoriData, []);
            changePath(currentNamePaths);
        }else{
            setOriPath(jsonKategoriData);
        }
        
        kategoriArray = thisKategori;
        infoFilterControl(8, false);
    }else{
        kategoriArray = [];
        setOriPath(jsonKategoriData);
        infoFilterControl(8, true);
    }

    listArray = [];
    isAutoCaller = false;
    await getItem();
    isQueuedChFilter = false;

    function setOriPath(thisJsonData){
        let oriNamePaths;
        
        if(originalPath){
            //oriNamePaths = await fetchNamaKategori(originalPath);
            oriNamePaths = findKategoriParentById(originalPath, thisJsonData, []);
            
            kategoriArray.push(originalPath);
        }else{
            oriNamePaths = null;
        }
        changePath(oriNamePaths);
    }

    function changePath(NamePaths){
        breadCrumbContainer.textContent = null;
        let currentLink;
        let currentTitle;

        if(NamePaths){
            const currentKategori = NamePaths[NamePaths.length - 1];
            currentLink = currentKategori.link;
            currentTitle = "Jual Beli " + decodeEntities(currentKategori.n_nd);

            let index = 1;
            NamePaths.forEach(NamePath => {
                const bcLink = NamePath.link;
                if(NamePaths.length > index){
                    changeBreadCrumb(bcLink, NamePath.n_nd, index, true);
                }else{
                    changeBreadCrumb(bcLink, NamePath.n_nd, index, false);
                }
                index++;
            });

            /* infoFilterControl(8, false); */
        }else{
            currentLink = "/kategori";
            currentTitle = "Cari Hewan";
            /* if(!thisKategori.length){
                infoFilterControl(8, true);
            } */
        }

        document.title = currentTitle;

        const searchFilter = searchItem.value.trim(); 
        if(searchFilter){
            currentLink += `?cari=${encodeURIComponent(searchFilter)}`;
        }

        history.replaceState(null, null, currentLink);
        
        const canonicalLink = document.querySelector('link[rel="canonical"]');
        if (canonicalLink) {
            //const canonicalURL = canonicalLink.getAttribute('href');
            const newCanonicalLink = `https://${domain}${currentLink}`;
            canonicalLink.setAttribute('href', newCanonicalLink);
        }
    }

    function changeBreadCrumb(link, nama, index, barrier){

        const span = document.createElement("span");
        span.setAttribute("itemprop", "itemListElement");
        span.setAttribute("itemscope", "");
        span.setAttribute("itemtype", "https://schema.org/ListItem");

        const a = document.createElement("a");
        a.classList.add("breadCrumbLink");
        a.setAttribute("itemprop", "item");
        a.href = link;

        const spanName = document.createElement("span");
        spanName.setAttribute("itemprop", "name");
        spanName.innerHTML = nama;

        a.appendChild(spanName);

        const meta = document.createElement("meta");
        meta.setAttribute("itemprop", "position");
        meta.setAttribute("content", index);

        span.appendChild(a);
        span.appendChild(meta);

        breadCrumbContainer.append(span);

        if(barrier){
            const backslash = document.createElement("span");
            backslash.classList.add("backslashBreadCrumb");
            backslash.textContent = "/";
            breadCrumbContainer.append(backslash);
        }
    }

    function getfKategori(){
        let getfKategoriArray = [];
        const optionCheckboxes = document.querySelectorAll('.option');
        optionCheckboxes.forEach( optionCheckbox => {
            if(optionCheckbox.checked){
                getfKategoriArray.push(optionCheckbox.getAttribute('data-parent'));
            }else{
                let relatedSubOptions = document.querySelectorAll('.subOption[data-child="' + optionCheckbox.getAttribute('data-parent') + '"]');
                relatedSubOptions.forEach(relatedSubOption =>{
                    if(relatedSubOption.checked){
                        getfKategoriArray.push(relatedSubOption.getAttribute('data-value')); //end result
                    }
                })
            }
        })
        return getfKategoriArray
    }
}
    
optionCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
        let parentValue = this.getAttribute('data-parent');
        let relatedSubOptions = document.querySelectorAll('.subOption[data-child="' + parentValue + '"]');

        relatedSubOptions.forEach(function(subCheckbox) {
            subCheckbox.checked = checkbox.checked;
        });

        updateParentCheckbox(this);
    });
});

subOptionCheckboxes.forEach(function(subCheckbox) {
    subCheckbox.addEventListener('change', function() {
        updateParentCheckbox(this);
    });
});

function updateParentCheckbox(checkbox) {
    let parentValue = checkbox.getAttribute('data-child');
    let parentCheckbox = document.querySelector('.option[data-parent="' + parentValue + '"]');
    
    if (parentCheckbox) {
        let relatedSubOptions = document.querySelectorAll('.subOption[data-child="' + parentValue + '"]');
        parentCheckbox.checked = Array.from(relatedSubOptions).every(subCheckbox => subCheckbox.checked);
    }
    changefFilter();
}

//---------------------------------------------------------------------------------------

function kategoriStart(){

    if(localStorage.getItem('usedWi')){
        const ls_storage = JSON.parse(localStorage.getItem('usedWi'));
        lokasiItem.innerHTML = ls_storage.nama;
        lokasiItem.setAttribute('data-lokasi', ls_storage.id);
        filterResultLokasiContainer.style.display = "flex";
    }

    changefFilter();
    
    observer.observe(itemCall);
}

kategoriStart();



//---------------------------------------