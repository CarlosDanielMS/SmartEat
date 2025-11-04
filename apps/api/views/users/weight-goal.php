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

<script src="<?= BASE_URL ?>assets/js/jquery.min.js"></script>
<div class="content-header">
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0">Peso e Objetivo</h1>
            </div><!-- /.col -->
            <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="#">Home</a></li>
                    <li class="breadcrumb-item active">Peso e Objetivo</li>
                </ol>
            </div><!-- /.col -->
        </div><!-- /.row -->
    </div><!-- /.container-fluid -->
</div>
<!-- /.content-header -->
<!-- Main content -->

<section class="content" data-url="<?= BASE_URL; ?>">
    <div class="container-fluid">
        <!-- Small boxes (Stat box) -->
        <div class="row">
            <div class="col-12 col-lg-6 mx-auto">
                <div class="card card-primary">
                    <div class="card-header">
                        <h3 class="card-title">Peso e Objetivo</h3>
                    </div>
                    <div class="card-body">
                        <div class="d-flex justify-content-center">
                            <div class="img-thumbnail mr-1">
                                <?php $photo = $main_data['photo'] ? "<img src='{$main_data['photo']}' width='150' height='150'>" : BASE_URL . "assets/upload/images/avatar.jpg"; ?>
                                <img src="<?= $photo; ?>" alt="Photo" class="preview-photo" width="150px"
                                    height="150px">
                            </div>
                            <form action="" method="post" enctype="multipart/form-data">
                                <input type="file" name="photo" class="d-none">
                                <div class="d-flex align-items-end h-100">
                                    <button type="button" class="btn-photo btn btn-sm btn-primary">
                                        <span class="fa fa-camera"></span>
                                    </button>
                                    <button type="submit" class="btn-photo-save btn btn-sm btn-success ml-1">
                                        <span class="fa fa-save"></span>
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div class="d-flex justify-content-between">
                            <h5 class="m-0">Sexo:</h5>
                            <?php
                            switch ($main_data['sex']) {
                                case 1:
                                    echo "<h5 class='m-0'>Homem</h5>";
                                    break;
                                case 2:
                                    echo "<h5 class='m-0'>Mulher</h5>";
                                    break;
                            }
                            ?>
                        </div>
                        <div class="d-flex justify-content-between">
                            <h5 class="m-0">Altura:</h5>
                            <h5 class="m-0"><?= $main_data['height']; ?> cm</h5>
                        </div>
                        <div class="d-flex justify-content-between">
                            <h5 class="m-0">Peso Inicial:</h5>
                            <h5 class="m-0"><?= $main_data['initial_weight']; ?> kg</h5>
                        </div>
                        <div class="d-flex justify-content-between">
                            <h5 class="m-0">Peso Atual:</h5>
                            <h5 class="m-0"><?= $main_data['weight']; ?> kg</h5>
                        </div>
                        <div class="d-flex justify-content-between">
                            <h5 class="m-0">Idade:</h5>
                            <h5 class="m-0"><?= $main_data['age']; ?> anos</h5>
                        </div>
                        <div class="d-flex justify-content-between">
                            <h5 class="m-0">Perfil Nutricional:</h5>
                            <?php
                            switch ($main_data['model_diet']) {
                                case 1:
                                    echo "<h5 class='m-0'>Baixa</h5>";
                                    break;
                                case 2:
                                    echo "<h5 class='m-0'>Média</h5>";
                                    break;
                                case 3:
                                    echo "<h5 class='m-0'>Alta</h5>";
                                    break;
                            }
                            ?>
                        </div>
                        <div class="d-flex justify-content-between">
                            <h5 class="m-0">Nível de Atividade Física:</h5>
                            <?php
                            switch ($main_data['physical_activity_level']) {
                                case 1.2:
                                    echo "<h5 class='m-0'>Sedentário</h5>";
                                    break;
                                case 1.375:
                                    echo "<h5 class='m-0'>Leve atividade</h5>";
                                    break;
                                case 1.55:
                                    echo "<h5 class='m-0'>Atividade moderada</h5>";
                                    break;
                                case 1.725:
                                    echo "<h5 class='m-0'>Atividade intensa</h5>";
                                    break;
                                case 1.90:
                                    echo "<h5 class='m-0'>Atividade muito intensa</h5>";
                                    break;
                            }
                            ?>
                        </div>

                        <div class="d-flex row mt-3">
                            <form action="<?= BASE_URL; ?>WeightGoal/updateWeight" method="post" class="col-12 col-lg-6">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">Atualizar o seu Peso</span>
                                    </div>
                                    <input type="number" id="weight" name="weight" value="<?= $main_data['weight']; ?>" class="form-control" step="0.01">
                                    <div class="input-group-append">
                                        <button type="submit" class="btn btn-primary" title="Atualizar">
                                            <span class="fa fa-save"></span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                            <form action="<?= BASE_URL; ?>WeightGoal/updateTargetWeight" method="post" class="col-12 col-lg-6">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">Atualizar Objetivo</span>
                                    </div>
                                    <input type="number" id="target_weight" name="target_weight" value="<?= $main_data['target_weight']; ?>" class="form-control" step="0.01">
                                    <div class="input-group-append">
                                        <button type="submit" class="btn btn-primary" title="Atualizar">
                                            <span class="fa fa-save"></span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <p class="d-none">Peso Inicial: <span class="initial-weight-graphic"><?= $main_data['initial_weight']; ?></span>kg</p>
                        <p class="d-none">Peso Atual: <span class="weight-graphic"><?= $main_data['weight']; ?></span>kg</p>
                        <p class="d-none">Peso Alvo: <span class="target-weight-graphic"><?= $main_data['target_weight']; ?></span>kg</p>
                        <canvas class="mb-3" id="targetWeightGraphic"></canvas>
                    </div>
                </div>
            </div>
        </div>
        <!-- /.row -->
    </div><!-- /.container-fluid -->
</section>

<script>
    let inputPhoto = document.querySelector("[name=photo]")
    let btnPhoto = document.querySelector(".btn-photo")
    let previewPhoto = document.querySelector(".preview-photo")
    btnPhoto.addEventListener("click", () => {
        inputPhoto.click()
    })

    inputPhoto.addEventListener("change", () => {

        let photo = inputPhoto.files[0]
        if (photo) {
            let reader = new FileReader()
            reader.onload = function(e) {
                previewPhoto.src = e.target.result
            }
            reader.readAsDataURL(photo)
        }
    })
</script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
    window.addEventListener('load', () => {
        let initialWeight = document.querySelector('.initial-weight-graphic')?.innerHTML;
        let weight = document.querySelector('.weight-graphic')?.innerHTML;
        let targetWeight = document.querySelector('.target-weight-graphic')?.innerHTML;
        let weightLossPerWeek = 1;

        let weeks = [];
        for (let i = 0; i <= (weight - targetWeight) / weightLossPerWeek; i++) {
            weeks.push(i);
        }

        let weights = weeks.map(function(semana) {
            return weight - semana * weightLossPerWeek;
        });

        let ctx = document.getElementById('targetWeightGraphic')?.getContext('2d');
        if (ctx) {
            let targetWeightGraphic = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: weeks,
                    datasets: [{
                        label: 'Peso/Semana',
                        data: weights,
                        borderColor: 'blue',
                        borderWidth: 2,
                        pointBackgroundColor: 'blue',
                        pointRadius: 5,
                        fill: false,
                    }],
                },
                options: {
                    title: {
                        display: true,
                        text: 'Perda de Peso ao Longo do Tempo',
                    }
                },
            });
        }

    })
</script>
<!-- <script src="<?= BASE_URL; ?>assets/js/custom/weight-goal.js"></script> -->