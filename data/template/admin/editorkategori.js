reAdmin(getKategori);

function getKategori(){
    if(navigator.onLine){
        const container = document.getElementById('categories');
        container.textContent = null;
        fetch("/data/template/data/database/api.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                
                action:"adminDataKategori"
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
                displayCategories(results.Data, container);
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

function displayCategories(categories, parentElement) {
    const ulElement = document.createElement('ul');
    categories.forEach(function(category) {

        const liElement = document.createElement('li');
        liElement.textContent = `${category.nama} ------------------ ${category.id_k} `;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "Delete";

        ulElement.appendChild(liElement);
        liElement.appendChild(deleteBtn);

        if(category.imgpath){
            const imgItem = document.createElement('img');
            imgItem.src = `/data/assets/image/logo/kategori/${category.imgpath}`;
            imgItem.classList.add("imgKategoriList");
            liElement.appendChild(imgItem);
        }

        deleteBtn.addEventListener('click', function() {
            deleteKategori(category.id_k);
        });

        if (category.subcategories.length > 0) {
            displayCategories(category.subcategories, liElement);
        }
    });
    parentElement.appendChild(ulElement);
}

//-----------------------------------

async function inputKategori(){
    if(navigator.onLine){
        const kName = document.getElementById("inputNamaKategori");
        const nameValue = kName.value.trim() ? kName.value.trim() : null;
        
        const kParent = document.getElementById("inputParentIdKategori")
        const ParentIdValue = kParent.value.trim() ? kParent.value.trim() : null;
    
        const inputFileKategori = document.getElementById("inputFileKategori");
    
        if(nameValue){
            const urlImg = await insertImage(inputFileKategori);
    
            fetch("/data/template/data/database/api.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    
                    fname:nameValue,
                    fParentId:ParentIdValue,
                    fUrlImg:urlImg,
                    action:"adminInputKategori"
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
                    kName.value = null;
                    getKategori();
                    inputFileKategori.value = null;
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
            setInfoMsg("Isi Nama" , 1);
        }
    }else{
        setInfoMsg("Tidak ada jaringan internet.", 1);
    }
}

document.getElementById("inputSubmitKategori").onclick = inputKategori;

//--------------------------------------------



async function updateKategori(){
    if(navigator.onLine){
        const kId = document.getElementById("updateIdKategori")
        const IdValue = kId.value.trim() ? kId.value.trim() : null;
    
        const kName = document.getElementById("updateNamaKategori");
        const nameValue = kName.value.trim() ? kName.value.trim() : null;
    
        const kParent = document.getElementById("updateParentIdKategori")
        const ParentIdValue = kParent.value.trim() ? kParent.value.trim() : null;
    
        const updateFileKategori = document.getElementById("updateFileKategori");
    
        if(nameValue){
            const urlImg = await insertImage(updateFileKategori);
    
            fetch("/data/template/data/database/api.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    
                    fId:IdValue,
                    fname:nameValue,
                    fParentId:ParentIdValue,
                    fUrlImg:urlImg,
                    action:"adminUpdateKategori"
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
                    kName.value = null;
                    getKategori();
                    updateFileKategori.value = null;
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
            setInfoMsg("Isi Nama Kategori!" , 1);
        }
    }else{
        setInfoMsg("Tidak ada jaringan internet.", 1);
    }
}

document.getElementById("updateSubmitKategori").onclick = updateKategori;



//---------------------------------------------------


function deleteKategori(fid){
    if(navigator.onLine){
        const confirm = window.confirm(`Hapus Kategori ${fid}?`);
        if (confirm === true) {
    
            fetch("/data/template/data/database/api.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    
                    fkategoriId:fid,
                    action:"adminDeleteKategori"
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
                    getKategori();
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