$(document).ready(function () {
    // função que calcula a barra de progresso

    let updateProgressBar = function () {

        var progressPercentage = 0;
        var individualCalories = 0;
        var caloriesPerItem = 0;
        var totalCalories = parseFloat($('.total_calories').data('total_calories')) || 0;

        // Calcula a soma das calorias de cada item marcado
        $('.checklist_food:checked').each(function () {
            caloriesPerItem = parseFloat($(this).data('calories_per_item')) || 0;
            individualCalories += caloriesPerItem; // soma a calaria dos intens marcados
            progressPercentage = (individualCalories / totalCalories) * 100; // regra de 3 p/calcular a %
            progressPercentage = parseFloat(progressPercentage.toFixed(2));
            $(this).closest('.food-div').find('.name_food, .portion_food').addClass('text-decoration-line-through');
        });

        // Calcular o gradiente de cor a partir da procentagem
        var barColor;
        if (progressPercentage >= 101) {
            barColor = 'rgb(255, 0, 0)'; // Cor vermelha quando ultrapassar 101%
        } else {
            var startColor = [0, 123, 255]; // Cor azul
            var endColor = [40, 167, 69]; // Cor verde
            var currentColor = [
                Math.round(startColor[0] + (endColor[0] - startColor[0]) * (progressPercentage / 100)),
                Math.round(startColor[1] + (endColor[1] - startColor[1]) * (progressPercentage / 100)),
                Math.round(startColor[2] + (endColor[2] - startColor[2]) * (progressPercentage / 100))
            ];
            barColor = 'rgb(' + currentColor.join(',') + ')'; // Cor dinamicamente calculada
        }


        $('.progress-bar').css({
            'width': progressPercentage + '%',
            'background-color': barColor, // Cor dinâmica ou vermelha           
        });

        $('.progress-bar').text(progressPercentage + '%');

        $('.progress-bar').attr('title', individualCalories + ' calorias consumidas');
    }

    // quando alterar o checkbox
    $(document).on('change', '.checklist_food', function (event) {

        event.preventDefault();

        var meal_id_checkbox = $(this).data('meal_id'); // pega o meal_id do checkbox clicado
        var calories_food_checkbox = $(this).data('calories_per_item').toFixed(3); // pega a caloria do alimento clicado
        var meal_id_p = 0;

        // indica qual formulário
        var form = $(this).closest('#form_checked');

        // dados do formulário
        var form_data = form.serialize();
        var form_url = form.attr("action");
        var form_method = form.attr("method").toUpperCase();

        // Envia o formulário via AJAX
        $.ajax({
            url: form_url,
            type: form_method,
            data: form_data,
            cache: false,
            success: function (response) {
                console.log("Formulário enviado com sucesso:", response); // Exibe a resposta no console

                // Alterna o valor do input 'checked'
                var inputChecked = form.find('input[name="checked"]');
                var currentValue = parseInt(inputChecked.val());


                // Margem de erro para os arredondamentos
                let marginOfErrorRemainingCaloriesPerMeal = function (total) {
                    if (total > -0.5 && total < 0.5) {
                        total = 0;
                    }
                    return total;
                }

                //loop pra verificar as qual refeição será feita a modificação da caloria
                $('.calories_per_meal').each(function () {
                    meal_id_p = $(this).data('meal_id'); // pega o meal_id de todos lugares que tem a classe .calories_per_meal
                    if (meal_id_p === meal_id_checkbox) {
                        remaining_calories_per_meal = $(this).find('.remaining_calories_per_meal ').text().trim().replace(',', '.');



                        // atualiza o valor do input no checkbox
                        //atualiza o texto no '..remaining_calories_per_meal "
                        if (currentValue === 1) {
                            total = Number(remaining_calories_per_meal) + Number(calories_food_checkbox);
                            total = marginOfErrorRemainingCaloriesPerMeal(total);
                            $(this).find('.remaining_calories_per_meal ').text(total.toFixed(2).replace('.',','));

                            inputChecked.val(0); // Muda para 0 se o atual é 1   

                        } else {
                            total = Number(remaining_calories_per_meal) - Number(calories_food_checkbox);
                            total = marginOfErrorRemainingCaloriesPerMeal(total);

                            $(this).find('.remaining_calories_per_meal ').text(total.toFixed(2).replace('.',','));
                            inputChecked.val(1); // Muda para 1 se o atual é 0                  
                        }
                    }
                });
            },
            error: function (xhr, status, error) {
                console.error("Erro ao enviar formulário:", error); // Exibe o erro no console
            }
        });

        // verifica se o checkbox está marcado ou não e aplica as classes
        if ($(this).is(':checked')) {
            $(this).closest('.food-div').find('.name_food, .portion_food').addClass('text-decoration-line-through');
            $(this).attr('value', 1);
        } else {
            $(this).closest('.food-div').find('.name_food, .portion_food').removeClass('text-decoration-line-through');
            $(this).attr('value', 0);
        }

        // atualiza a barra de progresso após a alteração
        updateProgressBar();
    });

    // atualiza a barra de progresso na carga inicial
    updateProgressBar();


    function checkDifferenceCaloriesAndAdjustDisplay() {
        let total_calories_meals = 0;

        $('.calories_per_meal').each(function () {
            let calories = parseFloat($(this).data('calories_per_meal'));
            total_calories_meals += calories;
        });

        total_calories_meals = (total_calories_meals).toFixed(2);
        var total_calories = $('.total_calories').data('total_calories');

        if (total_calories >= (total_calories_meals - 0.5) && total_calories <= (total_calories_meals + 0.5)) {
            $('.total_calories').find('span').text("");
        } else {
            let text = 0;
            if (total_calories > total_calories_meals) {
                text = 'a menos';
            } else {
                text = 'a mais'
            }
           
            $('.total_calories').attr('title', `As calorias indicadas são: ${total_calories}. Isso significa que você está consumindo ${Math.abs((total_calories - total_calories_meals).toFixed(2))} calorias ${text}.`);
        }       
    }

    checkDifferenceCaloriesAndAdjustDisplay()


    // --- Page Add

    let food_id_to_add_food;
  let food_add_display;
  let calc_calories_for_modal;
  let filtered_food_array;

  //captura o meal id de onde quero adicionar a refeição
  let meal_id_to_add_food;
  $(document).on("click", "#show-sidebar", function () {
    meal_id_to_add_food = $(this).data("id_meal");    
  });

  // calcula a caloria para adicionar aos modais(já existiam na página)
  $(document).on("click", "#show-sidebar", function () {
    calc_calories_for_modal = $(this).data("calc_calories_for_modal");   
  });

  const foodSearchBar = function () {
    var input = $("#search");
    var filter = input.val().toUpperCase(); // converte o valor digitado para maiúsculo
    var list_foods = $("#list_foods");
    var list_foods_items = list_foods.find("li"); // pega todos itens da lista

    list_foods_items.each(function () {
      var links = $(this); // Obtém o link do item
      if (links && links.html().toUpperCase().indexOf(filter) > -1) {
        // Pega o texto dentro do item, transforma em maiúsculo e verifica se o que foi digitado existe
        links.show(); // Exibe o item se corresponder
      } else {
        links.hide(); // Oculta o item se não corresponder
      }
    });
  };

  $(document).on("keyup", "#search", foodSearchBar);

  $(document).on(
    "change",
    '#form_filter_food input[type="checkbox"]',
    function () {
      $(this)
        .closest("label")
        .toggleClass("text-secondary fw-normal border border-secondary");

      filterFoodAjax();
    }
  );

  const filterFoodAjax = function () {
    // indica qual formulário
    var form = $("#form_filter_food");

    // dados do formulário
    var form_data = form.serialize();
    var form_url = form.attr("action");
    var form_method = form.attr("method").toUpperCase();

    $.ajax({
      url: form_url,
      type: form_method,
      data: form_data,
      success: function (foods) {
        $("#list_foods").html("");

        const listItems = foods
          .map(
            (food) =>
              `<li class="py-1 select_food" data-food_id="${food.id}">
                            <img class="rounded" src="${BASE_URL}${food.photo}" style="width: 2.5rem;">
                            ${food.name}
                        </li>`
          )
          .join("");

        filtered_food_array = foods.map((food) => food);

        $("#list_foods").html(listItems);

        foodSearchBar();
      },
      error: function (error) {
        console.error("Erro na requisição:", error);
      },
    });
  };

  /* selecionando o alimento para ser exibido como item a ser adicionado */
  $(document).on("click", ".select_food", function () {
    $("#portion_food").val("");

    $("#container_filters").addClass("d-none");
    $("#btn_filters").removeClass(
      "text-secondary fw-normal border border-secondary"
    );

    $("#container_selected_food").removeClass("d-none");
    $(".select_food").removeClass("bg-secondary bg-gradient active");
    $(this).toggleClass("bg-secondary bg-gradient active");

    food_id_to_add_food = $(this).data("food_id");

    let selected_food = arr_foods.find(
      (food) => food.id == food_id_to_add_food
    );
    food_add_display = selected_food; 

    $(".container_selected_food").attr(
      "data-selected_food_id",
      food_id_to_add_food
    );
    // inseri um data no container com o valor do id, para facilitar o uso em outras functions

    $("#form_add_food").find('[name="food_id"]').val(food_id_to_add_food);
    $("#form_add_food").find('[name="meal_id"]').val(meal_id_to_add_food);

    $("#form_add_food")
      .find('[name="type"]')
      .val(Number(selected_food.division_id));

    changing_html_add_food(selected_food);
  });

  $(document).on("change keyup", "#portion_food", function () {
    let food_id = $(".container_selected_food").attr("data-selected_food_id");

    let selected_food = arr_foods.find((food) => food.id == food_id);

    let portion_food = Number($("#portion_food").val());

    /* alterando os campos html */
    $(".container_selected_food")
      .find(".selected_name_food")
      .text(`${selected_food.name}`);

    let url_photo = BASE_URL + selected_food.photo;
    $(".container_selected_food")
      .find(".selected_photo_food")
      .attr("src", url_photo);

    $(".container_selected_food")
      .find(".selected_portion_food")
      .text(`(porção de: ${portion_food} g)`);

    $(".container_selected_food")
      .find(".selected_calories")
      .text(
        `${dynamicCalcValuesPerPortion(
          selected_food.portion_food,
          selected_food.calories,
          portion_food
        )}`
      );

    $(".container_selected_food")
      .find(".selected_carbohydrates")
      .text(
        `${dynamicCalcValuesPerPortion(
          selected_food.portion_food,
          selected_food.carbohydrates,
          portion_food
        )}`
      );
    $(".container_selected_food")
      .find(".selected_fats")
      .text(
        `${dynamicCalcValuesPerPortion(
          selected_food.portion_food,
          selected_food.fats,
          portion_food
        )}`
      );
    $(".container_selected_food")
      .find(".selected_proteins")
      .text(
        `${dynamicCalcValuesPerPortion(
          selected_food.portion_food,
          selected_food.proteins,
          portion_food
        )}`
      );
    /* alterando os campos html */

    if (!portion_food) {
      changing_html_add_food(selected_food);
    }
  });

  function dynamicCalcValuesPerPortion(
    standard_portion,
    default_value,
    dynamic_portion
  ) {
    let calc = (dynamic_portion * default_value) / standard_portion;
    return convertToBrl(calc);
  }

  const changing_html_add_food = function (selected_food) {
    /* alterando os campos html */
    $(".container_selected_food")
      .find(".selected_name_food")
      .text(`${selected_food.name}`);

    let url_photo = BASE_URL + selected_food.photo;
    $(".container_selected_food")
      .find(".selected_photo_food")
      .attr("src", url_photo);

    $(".container_selected_food")
      .find(".selected_portion_food")
      .text(`(porção de: ${selected_food.portion_food}g)`);
    $(".container_selected_food")
      .find(".selected_calories")
      .text(convertToBrl(Number(selected_food.calories)));
    $(".container_selected_food")
      .find(".selected_carbohydrates")
      .text(convertToBrl(Number(selected_food.carbohydrates)));
    $(".container_selected_food")
      .find(".selected_fats")
      .text(convertToBrl(Number(selected_food.fats)));
    $(".container_selected_food")
      .find(".selected_proteins")
      .text(convertToBrl(Number(selected_food.proteins)));

    /* alterando os campos html */
  };

  const convertToBrl = function (value) {
    let result = value.toFixed(2).replace(".", ",");
    return result;
  };

  $(document).on("click", "#btn_filters", function () {
    let check_selected_food = $(".select_food").hasClass("active");
    $("#container_filters").toggleClass("d-none");

    $(this).toggleClass("text-secondary fw-normal border border-secondary");

    if ($("#container_filters").hasClass("d-none")) {
      if (check_selected_food) {
        $("#container_selected_food").removeClass("d-none");
      }
    } else {
      $("#container_selected_food").addClass("d-none");
    }
  });

  $(document).on("click", "#container_filters .clean_filters", function () {
    $("#container_filters")
      .find('input[type="checkbox"]')
      .prop("checked", false);
    $(".btn_filter_food").removeClass(
      "text-secondary border border-secondary"
    );
    $(".btn_filter_food").addClass(
      "btn-light border fw-normal"
    );

    filterFoodAjax();
  });

  $(document).on("click", "#btn_add", function (e) {
  e.preventDefault();

  let portion_food = Number($('[name="portion_food"]').val()); 

  if (portion_food < 0.1){
      return; // para o código se a porção for enviada zerada
  } 

  let calories = Number(
    parseFloat(
      $(".container_selected_food").find(".selected_calories").text()
    )
  );
      
  let protein_foods = arr_foods.filter((food) => food.division_id == 1);
  let carbohydrate_foods = arr_foods.filter((food) => food.division_id == 2);
  let fat_foods = arr_foods.filter((food) => food.division_id == 3 || food.division_id == 4);

  var form = $("#form_add_food"); // indica qual formulário    
  var form_data = form.serialize();// dados do formulário
  var form_url = form.attr("action");
  var form_method = form.attr("method").toUpperCase();

  $('.sidebar').remove(); // Remove todas as sidebars
  sidebarCount = 0; // Reseta a contagem
  $('#overlay').removeClass('active'); // Remove overlay

  $.ajax({
    url: form_url,
    type: form_method,
    data: form_data,
    success: function (new_planner_food) {
           
let htmlContentBtns =
`${(new_planner_food.type === "P") ?
  `<div class="buttons-food new-buttons-food d-none">
  <button type="button" class="btn" title="Trocar Alimento" data-toggle="modal" data-target="#proteinModal${new_planner_food.id}">
    <span class="fa fa-exchange-alt border rounded p-1" style="font-size: 0.8em"></span>
  </button>
  <button type="button" class="btn-refresh-food btn p-0" title="GerarAlimento" data-food_id="${new_planner_food.id}" data-calories-meal="${calc_calories_for_modal}" data-type="${new_planner_food.type}">
    <span class="fa fa-sync border rounded p-1" style="font-size: 0.8em"></span>
  </button>
</div>
    <!-- Modal -->
  <div class="modal fade" id="proteinModal${new_planner_food.id}" aria-labelledby="proteinModal${new_planner_food.id}Label" aria-hidden="true">
     <div class="modal-dialog">
         <div class="modal-content">
              <div class="modal-body">
                 <form id="single" action="${BASE_URL}planner/single-refresh-food" method="post">                                               
                    <h4>Trocar Alimento (Proteína)</h4>
                    <input type="hidden" name="food_id" value="${new_planner_food.id}">
                    <input type="hidden" name="calories" value="${calc_calories_for_modal}">
                    <input type="hidden" name="type" value="${new_planner_food.type}">
                    <select name="selected_food_id" class="select2bs4">
                      ${
                        protein_foods.length >
                        0
                          ? protein_foods
                            .map(
                              (food) =>
                                `<option value="${food.id}">${food.name}</option>`
                            )
                            .join("")
                          : ""
                      }                                                                
                    </select>                                                           
                    <div class="modal-footer">
                      <button class="btn btn-success" type="button" onclick="enviarFormulario()">Confirmar</button>
                    </div>
                  </form>
                </div>
            </div>
       </div>
    </div>` 
    : ""
  }

 ${(new_planner_food.type === "C") ? 
  `<div class="buttons-food new-buttons-food d-none">
  <button type="button" class="btn" title="Trocar Alimento" data-toggle="modal" data-target="#carbModal${new_planner_food.id}">
    <span class="fa fa-exchange-alt border rounded p-1" style="font-size: 0.8em"></span>
  </button>
  <button type="button" class="btn-refresh-food btn p-0" title="GerarAlimento" data-food_id="${new_planner_food.id}" data-calories-meal="${calc_calories_for_modal}" data-type="${new_planner_food.type}">
    <span class="fa fa-sync border rounded p-1" style="font-size: 0.8em"></span>
  </button>
</div>
    <!-- Modal -->
  <div class="modal fade" id="carbModal${new_planner_food.id}" aria-labelledby="carbModal${new_planner_food.id}Label" aria-hidden="true">
     <div class="modal-dialog">
         <div class="modal-content">
              <div class="modal-body">
                 <form id="single" action="${BASE_URL}planner/single-refresh-food" method="post">                                               
                    <h4>Trocar Alimento (Carboidrato)</h4>
                    <input type="hidden" name="food_id" value="${new_planner_food.id}">
                    <input type="hidden" name="calories" value="${calc_calories_for_modal}">
                    <input type="hidden" name="type" value="${new_planner_food.type}">
                    <select name="selected_food_id" class="select2bs4">
                      ${
                        carbohydrate_foods.length >
                        0
                          ? carbohydrate_foods
                            .map(
                              (food) =>
                                `<option value="${food.id}">${food.name}</option>`
                            )
                            .join("")
                          : ""
                      }                                                                
                    </select>                                                           
                    <div class="modal-footer">
                      <button class="btn btn-success" type="button" onclick="enviarFormulario()">Confirmar</button>
                    </div>
                  </form>
                </div>
            </div>
       </div>
    </div>` 
    : ""
  }

  ${(new_planner_food.type === "F") ? 
    `<div class="buttons-food new-buttons-food d-none">
    <button type="button" class="btn" title="Trocar Alimento" data-toggle="modal" data-target="#fatModal${new_planner_food.id}">
      <span class="fa fa-exchange-alt border rounded p-1" style="font-size: 0.8em"></span>
    </button>
    <button type="button" class="btn-refresh-food btn p-0" title="GerarAlimento" data-food_id="${new_planner_food.id}" data-calories-meal="${calc_calories_for_modal}" data-type="${new_planner_food.type}">
      <span class="fa fa-sync border rounded p-1" style="font-size: 0.8em"></span>
    </button>
  </div>
      <!-- Modal -->
    <div class="modal fade" id="fatModal${new_planner_food.id}" aria-labelledby="fatModal${new_planner_food.id}Label" aria-hidden="true">
       <div class="modal-dialog">
           <div class="modal-content">
                <div class="modal-body">
                   <form id="single" action="${BASE_URL}planner/single-refresh-food" method="post">                                               
                      <h4>Trocar Alimento (Gordura)</h4>
                      <input type="hidden" name="food_id" value="${new_planner_food.id}">
                      <input type="hidden" name="calories" value="${calc_calories_for_modal}">
                      <input type="hidden" name="type" value="${new_planner_food.type}">
                      <select name="selected_food_id" class="select2bs4">
                        ${
                          fat_foods.length >
                          0
                            ? fat_foods
                              .map(
                                (food) =>
                                  `<option value="${food.id}">${food.name}</option>`
                              )
                              .join("")
                            : ""
                        }                                                                
                      </select>                                                           
                      <div class="modal-footer">
                        <button class="btn btn-success" type="button" onclick="enviarFormulario()">Confirmar</button>
                      </div>
                    </form>
                  </div>
              </div>
         </div>
      </div>` 
      : ""
    }

</div>
`

      let htmlContent = `
                      <div class="food-div drag-element d-flex justify-content-between align-items-center mb-3" draggable="true">
                          <div class="d-flex align-items-center">
                              <div class="p-3">
                                  <form id="form_checked" action="${BASE_URL}planner/updateCheckedFood/${new_planner_food.id}" method="POST">
                                      <input
                                          type="checkbox"
                                          name="${new_planner_food.type}"
                                          id="checkbox_food"
                                          class="checklist_food form-control-sm"                                                              
                                      data-food_id="${new_planner_food.id}"
                                      data-calories_per_item="${calories}"
                                      data-meal_id="${meal_id_to_add_food}"                                        
                                      value="0" />
                                      <input type="number" name="checked" value="0" style="display: none;">
                                  </form>
                              </div>
                              <div class="d-flex">
                                  <img src="${BASE_URL}${food_add_display.photo}" style="width: 100px; height:100px" alt="Foto" class="img-fluid rounded">
                                      <div class="px-2">
                                          <a href="#" class="nav-link p-0 name_food">${
                                            food_add_display.name
                                          }</a>
                                          <p class="m-0 portion_food">${(portion_food.toFixed(1).replace('.', ','))}g</p>

                                      </div>
                              </div>
                          </div> 
                       `

      $("#meal_foods").append(htmlContent + htmlContentBtns);   

      $('.select2bs4').select2();
      
      updateProgressBar();

     // atualiza as calorias por refeição adicionando o novo item
     $('.calories_per_meal').each(function() {
      if (meal_id_to_add_food == $(this).data('meal_id')) {
          let remaining_calories_per_meal = Number($(this).find('.remaining_calories_per_meal').text().trim().replace(',', '.')); 
          let update_remaining_calories_per_meal = (remaining_calories_per_meal + calories).toFixed(2).replace('.', ',');
          $(this).find('.remaining_calories_per_meal').text(update_remaining_calories_per_meal);
          
           $(this).data('calories_per_meal', (remaining_calories_per_meal + calories));
  
          let calories_total_meals = $('.total_calories').data("calories_total_meals");
  
          if (isNaN(calories_total_meals)) {
              calories_total_meals = 0;
          }
             
          let new_calories_total = calories_total_meals + calories;
          $('.total_calories').data("calories_total_meals", new_calories_total); // Atualiza o data
          $('.total_calories').find('span').text(new_calories_total.toFixed(2).replace('.', ',') + " /"); // Exibe a atualização
  
          console.log(new_calories_total);
  
          checkDifferenceCaloriesAndAdjustDisplay();
        }
      });

    },
  });    
});

$(document).on("mouseover", ".food-div", function(){
$(this).find(".new-buttons-food").removeClass("d-none")
});

$(document).on("mouseout", ".food-div", function(){
  $(this).find(".new-buttons-food").addClass("d-none")
    });


});