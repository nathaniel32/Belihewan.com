const formulir_email = document.getElementById("formulir_email");

formulir_email.onsubmit = async (e) => {
    e.preventDefault();
    if(navigator.onLine){
        const name = formulir_email["nama"];
        const email = formulir_email["email"];
        const subject = formulir_email["subject"];
        const pesan = formulir_email["pesan"];
        const submitBtn = formulir_email["submitBtn"];
    
        submitBtn.disabled = true;
    
        if(name){
            if(email){
                if(pesan){
                    await fetch("/data/template/data/database/api.php", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            fname:name.value.trim(),
                            femail:email.value.trim(),
                            fsubject:subject.value.trim(),
                            fpesan:pesan.value.trim(),
                            action:"formulirKontakEmail"
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
                            name.value = null;
                            email.value = null;
                            subject.value = null;
                            pesan.value = null;
                        }else{
                            setInfoMsg(results.Message , 1);
                        }
                    })
                    .catch((error) => {
                        //console.log("Error: "+error);
                        setInfoMsg("Error", 1);
                    })
    
    
                }else{
                    setInfoMsg("Tolong isi Pesan.", 1);
                }
            }else{
                setInfoMsg("Tolong isi Email.", 1);
            }
        }else{
            setInfoMsg("Tolong isi Nama.", 1);
        }
        
        submitBtn.disabled = false;
    }else{
        setInfoMsg("Tidak ada jaringan internet.", 1);
    }
}