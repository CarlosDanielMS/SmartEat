window.addEventListener("load", () => {
    let btnWeight = document.querySelector(".btn-weight"),
        inputWeight = document.querySelector("[name=weight]"),
        btnTargetWeight = document.querySelector(".btn-target-weight"),
        inputTargetWeight = document.querySelector("[name=target_weight]"),
        btnPhoto = document.querySelector(".btn-photo-save"),
        inputPhoto = document.querySelector("[name=photo]"),
        url = document.querySelector("section.content").getAttribute("data-url")

    btnPhoto.addEventListener("click", () => {
        let fileInput = document.querySelector("[name=photo]"),
        file = fileInput.files[0],
        formData = new FormData();
        
        formData.append("image", file)
      
        sendDataUpdate({
            photo: formData
        })
    })

    btnWeight.addEventListener("click", () => {
        sendDataUpdate({
            weight: inputWeight.value
        })
    })

    btnTargetWeight.addEventListener("click", () => {
        sendDataUpdate({
            target_weight: inputTargetWeight.value
        })
    })

    async function sendDataUpdate(data) {
        await fetch(`${BASE_URL}weight-goal/ajax-update`, {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then((response) => {
            if (!response.ok) {
                throw new Error("Error Requisition")
            }
            return response.json()
        }).then((data) => {
            if (data.reload) {
                window.location.href = `${BASE_URL}weight-goal`
            }
        }).catch((error) => {
            console.error(error)
        })
    }
})