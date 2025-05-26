let listArray = [];
const kategoriArray = null;
const sendLimitAll = 18;
const sendSex = null;
const sendHargaMin = null;
const sendHargaMax = null;
const sendOrder = 3;
const sendWarna = null;
const sendLokasi = null;
const sendSearch = null;

const listAllItemContainer = document.getElementById("listAllItemContainer");
const itemCall = document.getElementById("itemCall");

const allCaller = document.createElement("div")
allCaller.classList.add("list_all_caller")

const list_row_caller_img = document.createElement("img");
list_row_caller_img.src = "/data/assets/image/logo/icon/loading.svg";
list_row_caller_img.alt = "loading";
list_row_caller_img.setAttribute('draggable', 'false');

allCaller.append(list_row_caller_img);

listAllItemContainer.append(allCaller);

itemCall.onclick = fetchListAll;

async function fetchListAll(){
    allCaller.style.display = "flex";
    itemCall.disabled = true;
    itemCall.style.display = "none";
    if(navigator.onLine){
        const results_all = await fetchIklan(allCaller, kategoriArray, listArray, sendLimitAll, sendSex, sendHargaMin, sendHargaMax, sendOrder, sendWarna, sendLokasi, sendSearch, sendUser);
        if(results_all){
            if(results_all === 1){
                //console.log("End!1");
                if(!listArray.length){
                    setInfoMsg("Tidak ada iklan", 1);
                }
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

fetchListAll();