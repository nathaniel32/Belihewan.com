reAdmin(null);

const updateSitemapBtn = document.getElementById("updateSitemapBtn");

updateSitemapBtn.onclick = () => {
    //console.log("update");

    if(navigator.onLine){
        fetch("/data/template/data/database/api.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                
                action:"UpdateSitemapAdmin"
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


const updateWilayahBtn = document.getElementById("updateWilayahBtn");

updateWilayahBtn.onclick = () => {
    updateJsonDataDB(1)
}

const updateKategoriBtn = document.getElementById("updateKategoriBtn");
updateKategoriBtn.onclick = () => {
    updateJsonDataDB(2)
}

function updateJsonDataDB(type){
    if(navigator.onLine){
        fetch("/data/template/data/database/api.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ftype:type,
                action:"UpdateDataJSONAdmin"
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