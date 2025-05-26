const container_myads = document.getElementById("container_myads");

reUser(getMyAds);

//----------------------

class myAdsItem {
    constructor(container, id_i) {
        this.container = container;
        this.id_i = id_i;
        this.deleteBtn = container.querySelector('.delete_btn');
        this.deleteBtn.onclick = this.delete.bind(this);

        this.displayBtn = container.querySelector('.display_btn');
        this.displayBtn.onclick = this.display.bind(this);
    }

    async delete() {
        if(navigator.onLine){
            //console.log("deleted" + this.id_i);
            const confirm = window.confirm(`ID: ${this.id_i}\nApakah Anda ingin menghapus iklan ini?`);

            if (confirm === true) {
                this.deleteBtn.disabled = true;
                await fetch("/data/template/data/database/api.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        idI:this.id_i,
                        
                        action:"deleteAds"
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
                        //getMyAds();
                        this.container.remove();
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

                this.deleteBtn.disabled = false;
            }
        }else{
            setInfoMsg("Tidak ada jaringan internet.", 1);
        }
    }

    async display(){
        if(navigator.onLine){
            const displayType = this.displayBtn.getAttribute("data-display");

            if(displayType && (displayType == 1 || displayType == "null")){
                let displayText;
                let displayNextAttribute;
                let displayNextText;

                if(displayType == "null"){
                    displayText = "disable";
                    displayNextAttribute = 1;
                    displayNextText = "enable";
                }else{
                    displayText = "enable";
                    displayNextAttribute = null;
                    displayNextText = "disable";
                }

                const confirm = window.confirm(`ID: ${this.id_i}\nApakah Anda ingin ${displayText} iklan ini?`);

                if (confirm === true) {
                    this.displayBtn.disabled = true;
                    await fetch("/data/template/data/database/api.php", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            idI:this.id_i,
                            
                            displayType:displayType,
                            action:"displayAds"
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
                            
                            this.displayBtn.setAttribute("data-display", displayNextAttribute);
                            this.displayBtn.textContent = displayNextText;
                            
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
                    this.displayBtn.disabled = false;
                }
            }else{
                setInfoMsg("Tombol Error!" , 1);
            }
        }else{
            setInfoMsg("Tidak ada jaringan internet.", 1);
        }
    }
}

//------------------------------

function getMyAds(){
    if(navigator.onLine){
        fetch("/data/template/data/database/api.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                
                action:"myAds"
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
                container_myads.textContent = '';
                displayMyAds(results.Data);
                imgLoader();
            }else{
                if(results.noAccess){
                    reError(401);
                }else if(results.unToken){
                    //console.log("logout");
                    logout();
                }
                setInfoMsg(results.Message , 1);
                container_myads.textContent = results.Message;
            }
        })
        .catch((error) => {
            //console.log("Error: "+error);
            setInfoMsg("Error!", 1);
        })
    }else{
        container_myads.textContent = 'Tidak ada jaringan internet.';
        setInfoMsg("Tidak ada jaringan internet.", 1);
    }
}

function displayMyAds(results){
    results.forEach(result => {
        const article = document.createElement("article");
        article.classList.add("myads_item");

        const div1 = document.createElement("div");
        div1.classList.add("myads_item_img_container");

        const img = document.createElement("img");
        img.classList.add("imgUnderLoad");
        img.setAttribute('draggable', 'false');

        if(result.namafoto){
            img.src = `/data/assets/image/iklan/${result.id_i}/${result.namafoto}` //"/data/assets/image/iklan/red.jpeg";
        }else{
            img.src = "/data/assets/image/logo/icon/nophoto.jpg";
        }

        const div2 = document.createElement("div");
        div2.classList.add("myads_item_control_container");

        const div3 = document.createElement("div");
        div3.classList.add("myads_item_control_inter");

        const div4 = document.createElement("div");
        div4.classList.add("myads_item_text");

        const judul = document.createElement("h3");
        judul.innerHTML = result.judul;

        const harga = document.createElement("div");
        harga.textContent = 'Rp. ' + new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(result.harga);
        harga.classList.add("myads_item_text_harga");

        const tanggalupload = document.createElement("div");
        tanggalupload.textContent = timeAgo(result.tanggal_post, 2);
        tanggalupload.classList.add("myads_item_text_waktu");

        const div5 = document.createElement("div");
        div5.classList.add("myads_btn_container");

        const displayBtn = document.createElement("button");
        displayBtn.classList.add("btn");
        displayBtn.classList.add("display_btn");
        
        if(result.kondisi === null){
            displayBtn.textContent = "disable";
            displayBtn.setAttribute("data-display", result.kondisi);
        }else{
            displayBtn.textContent = "enable";
            displayBtn.setAttribute("data-display", result.kondisi);
        }

        const viewLink = document.createElement("a");
        const nameLink = convertLink(result.judul);
        viewLink.href = `/iklan/${result.id_i}/${nameLink}`;
        viewLink.textContent = 'lihat content';
        viewLink.setAttribute("data-cpop", false);
        viewLink.target = "_blank";
        viewLink.classList.add("btn");

        const editBtn = document.createElement("a");
        editBtn.href = `/editor-iklan?edit=${result.id_i}`;
        editBtn.textContent = "Edit";
        editBtn.classList.add("btn");

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("btn");
        deleteBtn.classList.add("delete_btn");

        container_myads.append(article);
        //article.append(div1);
        article.append(div1);
            div1.append(img);
        article.append(div2);
        div2.append(div3);
            div3.append(div4);
                div4.append(judul);
                div4.append(harga);
                div4.append(tanggalupload);
            div3.append(div5);
                div5.append(editBtn);
                div5.append(displayBtn);
                div5.append(viewLink);
                div5.append(deleteBtn);
        new myAdsItem(article, result.id_i);
    })
}

//-------------------------------------------------------