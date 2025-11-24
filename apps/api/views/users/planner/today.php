<link rel="stylesheet" href="<?= BASE_URL; ?>assets/css/sidebar.css">

<!-- Content Wrapper. Contains page content -->
<!-- Content Header (Page header) -->
<?php if (isset($_SESSION["success"])) : ?>
    <div class="alert alert-success" role="alert">
        <?= $_SESSION["success"]; ?>
    </div>
    <?php unset($_SESSION['success']); ?>
<?php elseif (isset($_SESSION["failed"])) : ?>
    <div class="alert alert-danger" role="alert">
        <?= $_SESSION["failed"]; ?>
    </div>
    <?php unset($_SESSION['failed']); ?>
<?php endif; ?>


<div class="content-header">
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0">Planejador</h1>
            </div><!-- /.col -->
            <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="#">Home</a></li>
                    <li class="breadcrumb-item active">Planejador</li>
                </ol>
            </div><!-- /.col -->
        </div><!-- /.row -->
    </div><!-- /.container-fluid -->
</div>
<!-- /.content-header -->
<!-- Main content -->
<section class="content" data-url="<?= BASE_URL; ?>" data-p="<?= $p_percentage; ?>" data-calories="<?= $amount_calories_deficit; ?>" data-c="<?= $c_percentage; ?>" data-f="<?= $f_percentage; ?>" data-page="today">
    <div class="container-fluid">
        <div class="row">
            <div class="col-12 mb-5">
                <div class="d-flex align-items-center">
                    <div class="border rounded bg-dark mr-3">
                        <a href="<?= BASE_URL; ?>planner/today" class="btn btn-sm btn-success">Dia</a>
                        <a href="<?= BASE_URL; ?>planner/week" class="btn btn-sm btn-dark">Semana</a>
                    </div>
                    <h3 class="m-0">Hoje<?= $currentDate ? ' - ' . $currentDate : '' ?></h3>
                </div>
            </div>
            <div class="col-12 col-lg-6">
                <div class="d-flex justify-content-between mb-5">
                    <div class="d-flex align-items-center">
                        <h3 class="mb-0 mr-5">Refeições</h3>
                        <div class="d-flex align-items-center">
                            <svg viewBox="-11 -11 22 22"
                                class="svelte-zh5dbf inline mr-1 <?= ($calories_total_meals >= ($amount_calories_deficit - 0.5) &&
                                                                        $calories_total_meals <= ($amount_calories_deficit + 0.5)) ? '' : 'd-none'; ?>"
                                width="20px" height="20px">
                                <path fill="hsl(185, 90%, 37.5%)" d="
                                M -10,-1.2246467991473533e-15
                                A 10 10 0 1 1 9.999813996107768 0.060992157259520195
                                L 0 0
                                z
                                " class="svelte-oeegzn"></path>
                                <path fill="hsl(44, 86%, 45%)" d="
                                M 9.999813996107768,0.060992157259520195
                                A 10 10 0 0 1 4.91021379186716 8.711475220544308
                                L 0 0
                                z
                                " class="svelte-oeegzn"></path>
                                <path fill="hsl(260, 48%, 50%)" d="
                                M 4.91021379186716,8.711475220544308
                                A 10 10 0 0 1 -10 -7.6571373978539e-15
                                L 0 0
                                z
                                " class="svelte-oeegzn"></path>
                            </svg>
                            <p class="m-0 total_calories" data-calories_total_meals="<?= $calories_total_meals ?>" data-total_calories="<?= $amount_calories_deficit; ?>">
                                <?= ($calories_total_meals >= ($amount_calories_deficit - 0.5) &&
                                    $calories_total_meals <= ($amount_calories_deficit + 0.5))
                                    ? ''
                                    :
                                    '<i class="fa-solid fa-triangle-exclamation text-danger"></i> ' .
                                    '<span>' . number_format($calories_total_meals, 2, ',', '') . ' / </span>';
                                ?>
                                <?= number_format($amount_calories_deficit, 2, ',', ''); ?> Calorias
                            </p>
                        </div>
                    </div>
                    <div class="d-flex">
                        <!-- botão de refresh -->
                        <button class="btn-refresh-meals btn p-0 mr-4" data-day_id="<?= $day_id; ?>">
                            <span>
                                <i class="fas fa-sync"></i>
                            </span>
                        </button>
                        <button class="btn p-0">
                            <span>
                                <i class="fa fa-ellipsis-v"></i>
                            </span>
                        </button>
                    </div>
                </div>

                <!-- Progress Bar -->
                <div class="progress mb-3 rounded">
                    <div class="progress-bar"></div>
                </div>
                <!-- Progress Bar -->

                <?php if ($meals) : ?>
                    <?php foreach ($meals as $meal) : ?>
                        <div id="meal_foods" class="drop-zone meals border rounded p-3 mb-3">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h4 class="mb-0"> <?= ($meal['name']) ? $meal['name'] : 'Refeição: ' . $meal['meal'] ?></h4>
                                    <div class="d-flex align-items-center">
                                        <svg viewBox="-11 -11 22 22" class="svelte-zh5dbf inline mr-1 " width="20px" height="20px">
                                            <path fill="hsl(185, 90%, 37.5%)" d="
                                            M -10,-1.2246467991473533e-15
                                            A 10 10 0 1 1 9.999813996107768 0.060992157259520195
                                            L 0 0
                                            z
                                            " class="svelte-oeegzn"></path>
                                            <path fill="hsl(44, 86%, 45%)" d="
                                            M 9.999813996107768,0.060992157259520195
                                            A 10 10 0 0 1 4.91021379186716 8.711475220544308
                                            L 0 0
                                            z
                                            " class="svelte-oeegzn"></path>
                                            <path fill="hsl(260, 48%, 50%)" d="
                                            M 4.91021379186716,8.711475220544308
                                            A 10 10 0 0 1 -10 -7.6571373978539e-15
                                            L 0 0
                                            z
                                            " class="svelte-oeegzn"></path>
                                        </svg>

                                        <?php if ($meals_info) : ?>
                                            <?php foreach ($meals_info as $meal_info) :
                                                $calories_per_meal = 0;
                                                $calories_food_checked = 0;
                                            ?>

                                                <?php foreach ($meal_info['foods'] as $food) : ?>
                                                    <?php if ($food['meal_id'] == $meal['id']) : ?>
                                                        <?php $calories_per_meal += $food['total_calories_per_item']; ?>
                                                        <?php if ($food['checked'] === 1) : ?>
                                                            <?php $calories_food_checked += $food['total_calories_per_item']; ?>
                                                        <?php endif; ?>
                                                    <?php endif; ?>
                                                <?php endforeach; ?>

                                                <?php if ($calories_per_meal > 0.01) : ?>
                                                    <p
                                                        class="calories_per_meal m-0"
                                                        data-meal_id="<?= $food['meal_id']; ?>"
                                                        data-calories_per_meal=" <?= $calories_per_meal ?> ">
                                                        <span class="remaining_calories_per_meal">
                                                            <?= ($calories_food_checked > 0.01) ? number_format(($calories_per_meal - $calories_food_checked), 2, ',', '') : number_format($calories_per_meal, 2, ',', '') ?>
                                                        </span> Calorias
                                                    </p>
                                                <?php endif; ?>
                                            <?php endforeach; ?>
                                        <?php endif; ?>

                                    </div>
                                </div>

                                <button class=" btn p-1" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false" title="Adicionar Alimento">
                                    <i class="fa fa-ellipsis-v"></i>
                                </button>
                                <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                                    <a 
                                    id="show-sidebar" 
                                    class="dropdown-item show-sidebar" 
                                    data-id_meal="<?= $meal['id'] ?>"
                                    data-calc_calories_for_modal="<?= $amount_calories_deficit * $number_meals_arr[$meal['meal'] - 1]; ?>">
                                        <i class="fa-regular fa-square-plus"></i> 
                                        Adicionar alimento
                                    </a>
                                    <a class="dropdown-item" href="<?= BASE_URL; ?>Planner/editPlannerMeal/<?= $meal['id'] ?>">
                                        <i class="fa-solid fa-pen-to-square"></i> 
                                        Editar refeição
                                    </a>
                                </div>

                            </div>
                            <?php if ($meals_info) : ?>


                                <?php foreach ($meals_info as $meal_info) : ?>

                                    <?php foreach ($meal_info['foods'] as $food): ?>

                                        <?php if ($food['meal_id'] == $meal['id']): ?>
                                            <div class="food-div drag-element d-flex justify-content-between align-items-center mb-3" draggable="true">
                                                <div class="d-flex align-items-center">
                                                    <div class="p-3">
                                                        <form id="form_checked" action="<?= BASE_URL; ?>planner/updateCheckedFood/<?= $food['id'] ?>" method="POST">
                                                            <input
                                                                type="checkbox"
                                                                name="<?= $food['type']; ?>"
                                                                id="checkbox_food"
                                                                class="checklist_food form-control-sm"
                                                                <?= $food['checked'] ? "checked" : null; ?>
                                                                data-food_id="<?= $food['id']; ?>"
                                                                data-calories_per_item="<?= $food['total_calories_per_item'] ?>"
                                                                data-meal_id="<?= $food['meal_id']; ?>"
                                                                value="<?= $food['checked'] ?>" />
                                                            <input type="number" name="checked" value="<?= $food['checked'] ?>" style="display: none;">
                                                        </form>
                                                    </div>
                                                    <div class="d-flex">
                                                        <img src="<?= BASE_URL . $food['photo']; ?>" style="width: 100px; height:100px" alt="Foto" class="img-fluid rounded">
                                                        <div class="px-2">
                                                            <a href="#" class="nav-link p-0 name_food"><?= $food['name']; ?></a>
                                                            <p class="m-0 portion_food"><?= number_format($food['portion_food'], 1, ',', ''); ?>g</p>

                                                        </div>
                                                    </div>
                                                </div>

                                                <?php if ($food['type'] == "P") : ?>
                                                    <div class="buttons-food d-none">
                                                        <button type="button" class="btn" title="Trocar Alimento" data-toggle="modal" data-target="#proteinModal<?= $food['id']; ?>">
                                                            <span class="fa fa-exchange-alt border rounded p-1" style="font-size: 0.8em"></span>
                                                        </button>
                                                        <button type="button" class="btn-refresh-food btn p-0" title="GerarAlimento" data-food_id="<?= $food['id']; ?>" data-calories-meal="<?= $amount_calories_deficit * $number_meals_arr[$meal['meal'] - 1]; ?>" data-type="<?= $food['type']; ?>">
                                                            <span class="fa fa-sync border rounded p-1" style="font-size: 0.8em"></span>
                                                        </button>
                                                    </div>
                                                    <!-- Modal -->
                                                    <div class="modal fade" id="proteinModal<?= $food['id']; ?>" aria-labelledby="proteinModal<?= $food['id']; ?>Label" aria-hidden="true">
                                                        <div class="modal-dialog">
                                                            <div class="modal-content">
                                                                <div class="modal-body">
                                                                    <form id="single" action="<?= BASE_URL ?>planner/single-refresh-food" method="post">
                                                                        <?php if ($protein_foods) : ?>
                                                                            <h4>Trocar Alimento (Proteína)</h4>
                                                                            <input type="hidden" name="food_id" value="<?= $food['id']; ?>">
                                                                            <input type="hidden" name="calories" value="<?= $amount_calories_deficit * $number_meals_arr[$meal['meal'] - 1]; ?>">
                                                                            <input type="hidden" name="type" value="<?= $food['type']; ?>">
                                                                            <select name="selected_food_id" class="select2bs4">
                                                                                <?php foreach ($protein_foods as $protein_food) : ?>
                                                                                    <option value="<?= $protein_food['id']; ?>"><?= $protein_food['name']; ?></option>
                                                                                <?php endforeach; ?>
                                                                            </select>
                                                                        <?php endif; ?>
                                                                        <div class="modal-footer">
                                                                            <button class="btn btn-success" type="button" onclick="enviarFormulario()">Confirmar</button>
                                                                        </div>
                                                                    </form>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                <?php endif; ?>

                                                <?php if ($food['type'] == "C") : ?>
                                                    <div class="buttons-food d-none">
                                                        <button type="button" class="btn" title="Trocar Alimento" data-toggle="modal" data-target="#carbModal<?= $food['id']; ?>">
                                                            <span class="fa fa-exchange-alt border rounded p-1" style="font-size: 0.8em"></span>
                                                        </button>
                                                        <button type="button" class="btn-refresh-food btn p-0" title="Gerar Alimento" data-food_id="<?= $food['id']; ?>" data-calories-meal="<?= $amount_calories_deficit * $number_meals_arr[$meal['meal'] - 1]; ?>" data-type="<?= $food['type']; ?>">
                                                            <span class="fa fa-sync border rounded p-1" style="font-size: 0.8em"></span>
                                                        </button>
                                                    </div>
                                                    <!-- Modal -->
                                                    <div class="modal fade" id="carbModal<?= $food['id']; ?>" aria-labelledby="carbModal<?= $food['id']; ?>Label" aria-hidden="true">
                                                        <div class="modal-dialog modal-dialog-centered">
                                                            <div class="modal-content">
                                                                <div class="modal-body">
                                                                    <form id="single" action="<?= BASE_URL ?>planner/single-refresh-food" method="post">
                                                                        <?php if ($carbohydrate_foods) : ?>
                                                                            <h4>Trocar Alimento (Carboidrato)</h4>
                                                                            <input type="hidden" name="food_id" value="<?= $food['id']; ?>">
                                                                            <input type="hidden" name="calories" value="<?= $amount_calories_deficit * $number_meals_arr[$meal['meal'] - 1]; ?>">
                                                                            <input type="hidden" name="type" value="<?= $food['type']; ?>">
                                                                            <select name="selected_food_id" class="select2bs4">
                                                                                <?php foreach ($carbohydrate_foods as $carbohydrate_food) : ?>
                                                                                    <option value="<?= $carbohydrate_food['id']; ?>"><?= $carbohydrate_food['name']; ?></option>
                                                                                <?php endforeach; ?>
                                                                            </select>
                                                                        <?php endif; ?>
                                                                        <div class="modal-footer">
                                                                            <button class="btn btn-success" type="button" onclick="enviarFormulario()">Confirmar</button>
                                                                        </div>
                                                                    </form>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                <?php endif; ?>

                                                <?php if ($food['type'] == "F") : ?>
                                                    <div class="buttons-food d-none">
                                                        <button type="button" class="btn p-0" title="Trocar Alimento" data-toggle="modal" data-target="#fatModal<?= $food['id']; ?>">
                                                            <span class="fa fa-exchange-alt border rounded p-1" style="font-size: 0.8em"></span>
                                                        </button>
                                                        <button type="button" class="btn-refresh-food btn p-0" title="Gerar Alimento" data-food_id="<?= $food['id']; ?>" data-calories-meal="<?= $amount_calories_deficit * $number_meals_arr[$meal['meal'] - 1]; ?>" data-type="<?= $food['type']; ?>">
                                                            <span class="fa fa-sync border rounded p-1" style="font-size: 0.8em"></span>
                                                        </button>
                                                    </div>
                                                    <!-- Modal -->
                                                    <div class="modal fade" id="fatModal<?= $food['id']; ?>" aria-labelledby="fatModal<?= $food['id']; ?>Label" aria-hidden="true">
                                                        <div class="modal-dialog modal-dialog-centered">
                                                            <div class="modal-content">
                                                                <div class="modal-body">

                                                                    <form id="single" action="<?= BASE_URL ?>planner/single-refresh-food" method="post">

                                                                        <?php if ($fat_foods) : ?>
                                                                            <h4>Trocar Alimento (Gordura)</h4>
                                                                            <input type="hidden" name="food_id" value="<?= $food['id']; ?>">
                                                                            <input type="hidden" name="calories" value="<?=
                                                                                                                        $amount_calories_deficit * $number_meals_arr[$meal['meal'] - 1]; ?>">
                                                                            <input type="hidden" name="type" value="<?= $food['type']; ?>">
                                                                            <select name="selected_food_id" class="select2bs4">
                                                                                <?php foreach ($fat_foods as $fat_food) : ?>
                                                                                    <option value="<?= $fat_food['id']; ?>"><?= $fat_food['name']; ?></option>
                                                                                <?php endforeach; ?>
                                                                            </select>
                                                                        <?php endif; ?>

                                                                        <div class="modal-footer">
                                                                            <button class="btn btn-success" type="button" onclick="enviarFormulario()">Confirmar</button>
                                                                        </div>
                                                                    </form>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                <?php endif; ?>

                                            </div>
                                        <?php endif; ?>

                                    <?php endforeach; ?>

                                <?php endforeach; ?>

                            <?php endif; ?>
                        </div>
                    <?php endforeach; ?>
                <?php endif ?>
            </div>
            <div class="col-12 col-lg-6">
                <div id="chart" data-p="<?= $p_percentage ?>" data-calories="<?= $amount_calories_deficit ?>" data-c="<?= $c_percentage ?>" data-f="<?= $f_percentage ?>"></div>
                <table class="table table-borderless">
                    <thead>
                        <tr align="center">
                            <th class="p-1 col-4" scope="col"></th>
                            <th class="col-4" scope="col">Totais</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr align="center">
                            <th class="p-1 col-4">Calorias</th>
                            <td class="p-0 col-4"><?= number_format($amount_calories_deficit, 2, ',', ''); ?></td>
                        </tr>
                        <tr align="center">
                            <th class="p-1 col-4"><span class="text-info fa fa-circle"></span> Proteínas</th>
                            <td class="p-0 col-4"><?= number_format($amount_calories_deficit * $p_percentage / 4, 2, ',', ''); ?>g</td>
                        </tr>
                        <tr align="center">
                            <th class="p-1 col-4"><span class="text-success fa fa-circle"></span> Gorduras</th>
                            <td class="p-0 col-4"><?= number_format($amount_calories_deficit * $f_percentage / 9, 2, ',', ''); ?>g</td>
                        </tr>
                        <tr align="center">
                            <th class="p-1 col-4"><span class="text-warning fa fa-circle"></span> Carboidratos</th>
                            <td class="p-0 col-4"><?= number_format($amount_calories_deficit * $c_percentage / 4, 2, ',', ''); ?>g</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <!-- /.row -->
    </div><!-- /.container-fluid -->
</section>

<!-- Modal para carregar o sidebar-->
<div class="container mt-5">
    <div id="sidebar-container" class="mt-4"></div>
</div>
<div id="overlay" class="overlay"></div>
<!-- Modal para carregar o sidebar -->

<script>
    function enviarFormulario() {
        var formulario = document.getElementById('single');
        var formData = new FormData(formulario);
        var jsonData = {};

        formData.forEach(function(value, key) {
            jsonData[key] = value;
        });
        console.log(jsonData);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '<?= BASE_URL ?>planner/single-refresh-food', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                location.reload();
            }
        };
        xhr.send(JSON.stringify(jsonData));
    }
</script>
<script src="<?= BASE_URL; ?>assets/js/custom/planner-refresh-foods.js"></script>
<script src="<?= BASE_URL; ?>assets/js/custom/refresh-foods-day.js"></script>
<!-- /.content -->
<!-- /.content-wrapper -->