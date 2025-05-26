async function uploadDataToAPI(judulValue, kategoriValue, hargaValue, negoIklanValue, isiValue, jenisSexValue, umurValue, warnaValue, keywordValue, lokasiValue, alamatIklanValue, emailIklanValue, noTlpIklanValue, noWaIklanValue, binaryBlobArray) {
    try {
        const response = await fetch("/data/template/data/database/api.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                
                fjudul: judulValue,
                fkategori: kategoriValue,
                fharga: hargaValue,
                fnego: negoIklanValue,
                fisi: isiValue,
                fsex: jenisSexValue,
                fumur: umurValue,
                fwarna: warnaValue,
                fkeyword: keywordValue,
                fkota: lokasiValue,
                falamat: alamatIklanValue,
                femail: emailIklanValue,
                fnoTlp: noTlpIklanValue,
                fnoWa: noWaIklanValue,
                foto: binaryBlobArray.map(img => img.link),
                action: "uploadIklan"
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

if(dataToken.payload.wilayahUser){
    (async () => {
        const defaultWiUser = findKategoriById(dataToken.payload.wilayahUser, await jsonData.getJsonWilayah());
        lokasi.textContent = defaultWiUser.n_nd;
        lokasi.setAttribute('data-lokasi', defaultWiUser.i_nd);
    })();
}