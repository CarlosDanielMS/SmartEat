<!-- Content Header (Page header) -->
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
<section class="content" data-url="<?= BASE_URL?>" data-p="<?= $p_percentage; ?>" data-calories="<?= $amount_calories_deficit; ?>" data-c="<?= $c_percentage; ?>" data-f="<?= $f_percentage; ?>" data-page="week">
    <div class="container-fluid">
        <!-- Small boxes (Stat box) -->
        <div class="col-12 mb-5">
            <div class="d-flex align-items-center">
                <div class="border rounded bg-dark mr-3">
                    <a href="<?= BASE_URL?>planner/today" class="btn btn-sm btn-dark">Dia</a>
                    <a href="<?= BASE_URL?>planner/week" class="btn btn-sm btn-success">Semana</a>
                </div>
                <h3 class="m-0">Essa Semana</h3>
            </div>
        </div>
        <div class="col-12">
            <?php if ($week_days) : ?>
                <?php foreach ($week_days as $week_day) : ?>
                    <div class="row">
                        <div class="d-flex flex-column align-items-center col-12 col-lg-2">
                            <div class="d-flex flex-column align-items-center">
                                <h3 class="<?= $day == $week_day['day'] ? 'text-warning' : ''; ?> mb-0"><?= $name_day_week[$week_day['day']]; ?></h3>
                                <div class="d-flex align-items-center">
                                    <svg viewBox="-11 -11 22 22" class="svelte-zh5dbf inline mr-1" width="20px" height="20px">
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
                                    <p class="m-0"><?= $amount_calories_deficit; ?> Calorias</p>
                                </div>
                            </div>
                            <div class="d-flex">
                                <button class="btn-refresh-meals btn p-0 mr-4" data-day_id="<?= $week_day['id']; ?>">
                                    <span>
                                        <i class="fa fa-sync"></i>
                                    </span>
                                </button>
                                <button class="btn p-0">
                                    <span>
                                        <i class="fa fa-ellipsis-v"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                        <?php if ($week_day['meals']) : ?>
                            <?php foreach ($week_day['meals'] as $meal) : ?>
                                <div class="col-2">
                                    <div class="meals border rounded p-3 mb-3">
                                        <div class="d-flex justify-content-between align-items-center mb-3">
                                            <div>
                                                <h4 class="mb-0">Refeição: <?= $meal['meal']; ?></h4>
                                                <div class="d-flex align-items-center">
                                                    <svg viewBox="-11 -11 22 22" class="svelte-zh5dbf inline mr-1" width="20px" height="20px">
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
                                                    <p class="calories-meal m-0" data-calories-meal="<?= $amount_calories_deficit * $number_meals_arr[$meal['meal'] - 1]; ?>"><?= $amount_calories_deficit * $number_meals_arr[$meal['meal'] - 1]; ?> Calorias</p>
                                                </div>
                                            </div>
                                            <button class="btn p-0">
                                                <span>
                                                    <i class="fa fa-ellipsis-v"></i>
                                                </span>
                                            </button>
                                        </div>
                                        <?php if ($meal['foods']) : ?>
                                            <?php foreach ($meal['foods'] as $food) : ?>
                                                <div class="d-flex align-items-center mb-3">
                                                    <div class="p-3">
                                                        <input type="checkbox" name="<?= $food['type']; ?>" class="form-control form-control-sm" <?= $food['checked'] ? "checked" : null; ?> data-food_id="<?= $food['id']; ?>" >
                                                    </div>
                                                    <div class="d-flex">
                                                    <img src="<?=BASE_URL . $food['photo']; ?>" style="width: 40px; height:40px" alt="Foto" class="img-fluid rounded">
                                                        <div class="px-2">
                                                            <a href="#" class="nav-link p-0"><?= $food['name']; ?></a>
                                                            <p class="m-0"><?= $food['portion_food']; ?>g</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            <?php endforeach; ?>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        <?php endif ?>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div><!-- /.container-fluid -->
</section>
<!-- /.content -->
<script src="<?=BASE_URL?>assets/js/custom/planner-check-foods.js"></script>
<script src="<?=BASE_URL?>assets/js/custom/planner-refresh-foods.js"></script>