const container = document.getElementById('displayAdsBar');

reAdmin(getAds);

function getAds(){
    if(navigator.onLine){
        container.textContent = null;
        fetch("/data/template/data/database/api.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                
                action:"adminDataAds"
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
                //console.log(results.Data);
                displayAds(results.Data);
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
        setInfoMsg("Tidak ada jaringan internet.", 1);
    }
}

function displayAds(adsData) {

    const ulElement = document.createElement('ul');
    adsData.forEach(function(thisad) {

        const liElement = document.createElement('li');
        liElement.textContent = `${thisad.id_ab} ----- ${thisad.deskripsi} ------------------ ${thisad.ads_link} `;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "Delete";

        ulElement.appendChild(liElement);
        liElement.appendChild(deleteBtn);

        if(thisad.nama){
            const imgItem = document.createElement('img');
            imgItem.src = `/data/assets/image/logo/ads/${thisad.nama}`;
            imgItem.classList.add("imgAdsList");
            liElement.appendChild(imgItem);
        }

        deleteBtn.addEventListener('click', function() {
            deleteAds(thisad.id_ab);
        });
    });
    container.appendChild(ulElement);
}

function deleteAds(fid){
    if(navigator.onLine){
        const confirm = window.confirm(`Hapus Ads ${fid}?`);
        if (confirm === true) {
    
            fetch("/data/template/data/database/api.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    
                    fadsId:fid,
                    action:"adminDeleteAds"
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
                    getAds();
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
        }
    }else{
        setInfoMsg("Tidak ada jaringan internet.", 1);
    }
}

async function inputAds(){
    if(navigator.onLine){
        const inputDeskripsiAds = document.getElementById("inputDeskripsiAds");
        const inputDeskripsiAdsIdValue = inputDeskripsiAds.value.trim() ? inputDeskripsiAds.value.trim() : null;
    
        const inputLinkAds = document.getElementById("inputLinkAds")
        const inputLinkAdsValue = inputLinkAds.value.trim() ? inputLinkAds.value.trim() : null;
    
        const inputFileAds = document.getElementById("inputFileAds");
    
        if(inputFileAds.files.length != 0){
            const urlImg = await insertImage(inputFileAds);
    
            fetch("/data/template/data/database/api.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fdeskripsi:inputDeskripsiAdsIdValue,
                    flink:inputLinkAdsValue,
                    fUrlImg:urlImg,
                    action:"adminInputAds"
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
                    inputFileAds.value = null;
                    inputDeskripsiAds.value = null;
                    inputLinkAds.value = null;
                    getAds();
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
            setInfoMsg("Isi Foto" , 1);
        }
    }else{
        setInfoMsg("Tidak ada jaringan internet.", 1);
    }
}

document.getElementById("inputSubmitAds").onclick = inputAds;