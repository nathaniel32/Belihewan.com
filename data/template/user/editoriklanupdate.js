fetchEditDataIklan();

function fetchEditDataIklan(){
    uploadBtn.disabled = true;
    setInfoMsg('Loading...', 2);
    fetch("/data/template/data/database/api.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            fIdi:iklanId,
            
            action:"dataEditIklan"
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
            judul.value = decodeEntities(results.Data.judul);
            
            const kategoriDataValue = findKategoriById(results.Data.id_k, await jsonData.getJsonKategori());
            kategori.innerHTML = kategoriDataValue.n_nd;
            kategori.setAttribute('data-kategori', kategoriDataValue.i_nd);

            harga.value = results.Data.harga;
            formatHarga(harga);
            negoIklan.checked = results.Data.ketharga;
            //isi.value = results.Data.deskripsi.replace(/&lt;br&gt;/g, '\n');
            //isi.value = decodeEntities(results.Data.deskripsi.replace(/&lt;br&gt;/g, '\n').replace(/&amp;nbsp;/g, ' '));
            isi.value = decodeEntities(results.Data.deskripsi);
            umur.value = results.Data.umur;
            warna.value = results.Data.id_w === null ? '' : results.Data.id_w;
            keyword.value = decodeEntities(results.Data.keyword);
            jenisSex.value = results.Data.jenis_kelamin === null ? '' : results.Data.jenis_kelamin;
            alamatIklan.value = decodeEntities(results.Data.alamat);
            emailIklan.value = results.Data.email;
            noTlpIklan.value = results.Data.nomor_tlp;
            noWaIklan.value = results.Data.nomor_wa;

            //console.log(findKategoriById(results.Data.id_r, await jsonData.getJsonWilayah()))

            lokasi.innerHTML = findKategoriById(results.Data.id_r, await jsonData.getJsonWilayah()).n_nd;
            lokasi.setAttribute('data-lokasi', results.Data.id_r);

            fetchEditImgIklan(results.Data.id_i);
        }else{
            setInfoMsg(results.Message , 1)
        }
    })
    .catch((error) => {
        //console.log("Error: "+error);
        setInfoMsg("Error!", 1);
    })
}

async function fetchBlobImg(path) {
    try {
        const response = await fetch(path);
        const blob = await response.blob();
        
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                resolve(reader.result);
            };
            reader.onerror = reject;
        });
    } catch (error) {
        console.error('Error fetching image:', error);
        return null;
    }
}

function fetchEditImgIklan(idi) {
    //console.log(idi);

    fetch("/data/template/data/database/api.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            fIdi:idi,
            
            action:"imgEditIklan"
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
            /* results.Data.forEach(async res => {
                //console.log(res.nama);
                const imageURL = `/data/assets/image/iklan/${idi}/${res.nama}`;
                const binaryBlob = await fetchBlobImg(imageURL);
                console.log(binaryBlob)
                displayImgEditor(binaryBlob);
            }) */
            for (const res of results.Data) {
                const imageURL = `/data/assets/image/iklan/${idi}/${res.nama}`;
                const binaryBlob = await fetchBlobImg(imageURL);
                displayImgEditor(binaryBlob);
            }
        }else{
            setInfoMsg(results.Message , 1)
        }
        
        setInfoMsg(null, 3);
        uploadBtn.disabled = false;
    })
    .catch((error) => {
        //console.log("Error: "+error);
        setInfoMsg("Foto Error!", 1);
        uploadBtn.disabled = false;
    })
}

async function uploadDataToAPI(judulValue, kategoriValue, hargaValue, negoIklanValue, isiValue, jenisSexValue, umurValue, warnaValue, keywordValue, kotaValue, alamatIklanValue, emailIklanValue, noTlpIklanValue, noWaIklanValue, binaryBlobArray) {
        
    try {
        const response = await fetch("/data/template/data/database/api.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fIdi: iklanId,
                
                fjudul: judulValue,
                fkategori: kategoriValue,
                fharga: hargaValue,
                fnego: negoIklanValue,
                fisi: isiValue,
                fsex: jenisSexValue,
                fumur: umurValue,
                fwarna: warnaValue,
                fkeyword: keywordValue,
                fkota: kotaValue,
                falamat: alamatIklanValue,
                femail: emailIklanValue,
                fnoTlp: noTlpIklanValue,
                fnoWa: noWaIklanValue,
                foto: binaryBlobArray.map(img => img.link),
                action: "updateIklan"
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const results = await response.json();

        if (results.Success) {
            setInfoMsg(results.Message, 1, true);
            return results.Message;
        } else {
            setInfoMsg(results.Message, 1);
            return null;
        }
    } catch (error) {
        setInfoMsg('Terjadi kesalahan', 1);
        return null;
    }
}