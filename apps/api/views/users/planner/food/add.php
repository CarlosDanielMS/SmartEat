<script>
    arr_foods = <?= json_encode($all_foods); ?>;
</script>

<button class="close-btn btn btn-danger">&times;</button>
<div class="sidebar-content p-3">

    <div class="container">
        <div class="row">
            <div class="col-sm overflow-auto" style="max-height: 30rem;">

                <div class="input-group d-flex justify-content-between space-betwenn p-2">

                    <div class="input-group w-75">
                        <input type="text" class="form-control" placeholder="Pesquisar..." id="search">
                        <label class="input-group-text bg-light" for="search">
                            <i class="fa-solid fa-magnifying-glass"></i>
                        </label>
                    </div>

                    <div>
                        <button class="btn btn-light border shadow-none" id="btn_filters">
                            Filtros
                            <i class="fa-solid fa-filter"></i>
                        </button>
                    </div>

                </div>
                <ul class="px-2" id="list_foods">
                    <?php foreach ($all_foods as $food) : ?>
                        <li class="py-1 select_food" data-food_id="<?= $food['id']; ?>">
                            <img
                                class="rounded"
                                src="<?= BASE_URL; ?><?= $food['photo']; ?>"
                                alt="<?= $food['name']; ?>"
                                style="width: 2.5rem;">
                            <?= $food['name']; ?>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </div>


            <div class="col-sm overflow-auto" style="max-height: 30rem;">


                <div id="container_filters" class="d-none">
                    <form id="form_filter_food" action="<?= BASE_URL; ?>Ajax/getAllFood" method="POST">

                        <div class="py-1 pb-4 d-flex align-items-center">
                            <h2>Filtros</h2>
                            <a class="ps-4 btn text-primary clean_filters">Limpar</a>
                        </div>

                        <div class="principal-focus">
                            <div class="px-4 py-1">
                                <h3>Foco Principal </h3>
                            </div>
                            <div class="d-flex flex-wrap  justify-content-around w-100">

                                <label class="btn_filter_food btn btn-light border fw-normal mx-2" for="filter-protein">
                                    Proteina
                                    <input class="d-none" type="checkbox" name="division_id[]" id="filter-protein" value="1">
                                </label>

                                <label class="btn_filter_food btn btn-light border fw-normal  mx-2" for="filter-carbohydrate">
                                    Carboidrato
                                    <input class="d-none" type="checkbox" name="division_id[]" id="filter-carbohydrate" value="2">
                                </label>

                                <label class="btn_filter_food btn btn-light border fw-normal  mx-2" for="filter-fat">
                                    Gordura
                                    <input class="d-none" type="checkbox" name="division_id[]" id="filter-fat" value="3">
                                </label>

                                <label class="btn_filter_food btn btn-light border fw-normal  mx-2" for="filter-others">
                                    Outros
                                    <input class="d-none" type="checkbox" name="division_id[]" id="filter-others" value="4">
                                </label>

                            </div>
                        </div>

                        <div class="Allergenic_foods">
                            <div class="px-4 py-1">
                                <h3>Alimentos Alergênicos </h3>
                            </div>
                            <div class="d-flex flex-wrap justify-content-around w-100">

                                <label class="btn_filter_food btn btn-light border fw-normal  mx-2" for="filter-soy">
                                Soja
                                    <input class=" d-none" type="checkbox" name="allergens[]" id="filter-soy" value="1">
                                </label>

                                <label class="btn_filter_food btn btn-light border fw-normal  mx-2" for="filter-milk">
                                Leite
                                    <input class="d-none" type="checkbox" name="allergens[]" id="filter-milk" value="2">
                                </label>

                                <label class="btn_filter_food btn btn-light border fw-normal  mx-2" for="filter-egg">
                                Ovo
                                    <input class="d-none" type="checkbox" name="allergens[]" id="filter-egg" value="3">
                                </label>

                                <label class="btn_filter_food btn btn-light border fw-normal" for="filter-nuts">
                                Nozes
                                    <input class="d-none" type="checkbox" name="allergens[]" id="filter-nuts" value="4">
                                </label>

                                <label class="btn_filter_food btn btn-light border fw-normal  mx-2" for="filter-peanut">
                                Amendoim
                                    <input class="d-none" type="checkbox" name="allergens[]" id="filter-peanut" value="5">
                                </label>

                                <label class="btn_filter_food btn btn-light border fw-normal  mx-2" for="filter-fish">
                                Peixe
                                    <input class="d-none" type="checkbox" name="allergens[]" id="filter-fish" value="6">
                                </label>

                                <label class="btn_filter_food btn btn-light border fw-normal  mx-2" for="filter-seafood">
                                Marisco
                                    <input class="d-none" type="checkbox" name="allergens[]" id="filter-seafood" value="7">
                                </label>

                                <label class="btn_filter_food btn btn-light border fw-normal  mx-2" for="filter-wheat-gluten">
                                Trigo/Glúten
                                    <input class="d-none" type="checkbox" name="allergens[]" id="filter-wheat-gluten" value="8">
                                </label>

                            </div>
                        </div>

                    </form>
                </div>


                <div id="container_selected_food" class="container_selected_food d-none">
                    <form id="form_add_food" action="<?= BASE_URL; ?>Ajax/AddItemPlannerFood" method="POST">

                        <div>
                            <div class="px-2 py-3">
                                <h3 class="selected_name_food"></h3>
                            </div>
                            <div class="d-flex">
                                <img class="rounded w-50 selected_photo_food" src="http://localhost/omnidiet/assets/admin/images/peito-de-frango-cozido.jpg" alt="Peito de Frango Cozido">
                                <div class="ms-2 w-50">

                                    <div class="d-flex justify-content-between align-items-center">
                                        <h5>Nutrição</h5>
                                        <span class="selected_portion_food"></span>
                                    </div>

                                    <div>
                                        <div class="d-flex justify-content-between">
                                            <div>Calorias</div>
                                            <div><span class="selected_calories"></span> kcal</div>
                                        </div>
                                        <div class="d-flex justify-content-between">
                                            <div>Carboidratos</div>
                                            <div><span class="selected_carbohydrates"></span> g</div>
                                        </div>
                                        <div class="d-flex justify-content-between">
                                            <div>Gorduras</div>
                                            <div><span class="selected_fats"></span> g</div>
                                        </div>
                                        <div class="d-flex justify-content-between">
                                            <div>Proteínas</div>
                                            <div><span class="selected_proteins"></span> g</div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div class="input-group d-flex py-3">
                                <input class="d-none" type="number" value="" name="food_id">
                                <input class="d-none" type="number" value="" name="meal_id">
                                <input class="d-none" type="number" value="" name="type">
                                <input class="col-md-2 form-control" type="number" name="portion_food" id="portion_food" min="1">
                                <label for="" class="input-group-text">g</label>
                                <button class="btn btn-success ms-2" id="btn_add">
                                    <i class="fa-solid fa-circle-plus"></i> Adicionar
                                </button>
                            </div>

                        </div>

                    </form>
                </div>

            </div>
        </div>
    </div>
</div>