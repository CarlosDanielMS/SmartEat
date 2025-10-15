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
<section class="content-header">
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1>Alimentos</h1>
            </div>
            <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="<?= BASE_URL ?>admin">Dashboard</a></li>
                    <li class="breadcrumb-item active">Alimentos</li>
                </ol>
            </div>
        </div>
    </div><!-- /.container-fluid -->
</section>
<!-- Main content -->
<section class="content">
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <div class="d-flex justify-content-end">
                            <a href="<?= BASE_URL ?>admin/foods/create" class="btn btn-sm btn-success text-uppercase"><i class="fa fa-plus"></i> Adicionar Alimento</a>
                        </div>
                    </div>
                    <!-- /.card-header -->
                    <div class="card-body">
                        <table id="example1" class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>Foto</th>
                                    <th>Nome</th>
                                    <th>Porção</th>
                                    <th>Calorias</th>
                                    <th>Proteínas</th>
                                    <th>Gorduras</th>
                                    <th>Carboídratos</th>
                                    <th>Fibras</th>
                                    <th>Índice Glicêmico</th>
                                    <th>Classificação</th>
                                    <th>Grupo Alérgeno</th>
                                    <th>Divisão</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if ($list_foods) : ?>
                                    <?php foreach ($list_foods as $food) : ?>
                                        <tr>
                                            <td><img src="<?= BASE_URL . $food['photo'] ?>" alt="Foto" style="width: 30px; height:30px"></td>
                                            <td><?= $food['name']; ?></td>
                                            <td><?= $food['portion_food']; ?></td>
                                            <td><?= $food['calories']; ?></td>
                                            <td><?= $food['proteins']; ?></td>
                                            <td><?= $food['fats']; ?></td>
                                            <td><?= $food['carbohydrates']; ?></td>
                                            <td><?= $food['fibers']; ?></td>
                                            <td><?= $food['sugar_level']; ?></td>
                                            <td class="text-uppercase font-weight-bold"><?= $food['classf_name']; ?></td>
                                            <td class="text-uppercase font-weight-bold"><?= $food['allerg_names']; ?></td>
                                            <td class="text-uppercase font-weight-bold"><?= array_key_exists($food['division_id'], $division) ? $division[$food['division_id']] : '' ?></td>
                                            <td>
                                                <a href="<?= BASE_URL ?>admin/foods/edit/<?= $food['id'] ?>" class="btn btn-info btn-sm" title="Editar"><i class="fas fa-pencil-alt"></i></a>

                                                <a href="#" class="btn btn-danger btn-sm food-delete" data-food_id="<?= $food['id']; ?>" title="Excluir"><i class="fas fa-trash"></i></a>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                    <!-- /.card-body -->
                </div>
                <!-- /.card -->
            </div>
            <!-- /.col -->
        </div>
        <!-- /.row -->
    </div>
    <!-- /.container-fluid -->
</section>
<!-- /.content -->