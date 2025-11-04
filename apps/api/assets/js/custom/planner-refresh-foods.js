window.addEventListener("load", () => {
    
    let url = document.querySelector("section.content").getAttribute("data-url"),
        page = document.querySelector("section.content").getAttribute("data-page"),
        btnsRefreshMeals = document.querySelectorAll(".btn-refresh-meals"),
        btnsRefreshFood = document.querySelectorAll(".btn-refresh-food");

    // btnsRefreshMeals.forEach((btn) => {
    //     btn.addEventListener("click", async () => {
    //         try {
    //             const dayId = btn.getAttribute("data-day_id");
    //             console.log('Enviando requisição para o dia:', dayId);

    //             const response = await fetch(`${url}planner/refresh-food`, {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify({
    //                     day_id: dayId,
    //                 }),
    //             });

    //             console.log('Response Status:', response.status);
    //             console.log('Response Headers:', response.headers);

    //             const contentType = response.headers.get('content-type');
    //             const responseBody = await response.text();

    //             console.log('Content-Type da resposta:', contentType);
    //             console.log('Corpo da resposta:', responseBody);

    //             let data;
    //             try {
    //                 data = JSON.parse(responseBody);
    //                 console.log('Resposta é JSON:', data);
    //             } catch (e) {
    //                 console.error('Resposta não é JSON:', responseBody);
    //                 throw new Error('Resposta não é JSON');
    //             }

    //             if (data?.redirect) {
    //                 window.location.href = `${url}/planner/today/${page}`;
    //             }
    //         } catch (error) {
    //             console.error('Erro na requisição:', error);
    //         }
    //     });
    // });

    $(document).on("click", ".btn-refresh-food", async function () {
        try {
            const foodId = $(this).data("food_id");  // Usando $(this) para pegar os dados do botão
            const type = $(this).data("type");
            const calories = $(this).data("calories-meal");
            console.log('Enviando requisição para food_id:', foodId);
    
            const response = await fetch(`${url}/planner/single-refresh-food-ajax`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    food_id: foodId,
                    type: type,
                    calories: calories,
                }),
            });
    
            if (!response.ok) {
                console.error('Erro na resposta:', response.status, response.statusText);
                throw new Error('Erro na requisição');
            }
    
            const data = await response.json();
            console.log('Dados recebidos:', data);
    
            if (data?.redirect) {
                window.location.href = `${url}/planner/${page}`;
            }
    
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    });
    


});
