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
                <h1>Grupos Alérgenos</h1>
            </div>
            <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="<?=BASE_URL?>admin">Dashboard</a></li>
                    <li class="breadcrumb-item active">Grupos Alérgenos</li>
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
                            <a href="<?=BASE_URL?>admin/allergens/create" class="btn btn-sm btn-success
                            text-uppercase"><i
                                        class="fa fa-plus"></i> Adicionar Grupo Alérgeno</a>
                        </div>
                    </div>
                    <!-- /.card-header -->
                    <div class="card-body">
                        <table id="example1" class="table table-bordered table-striped">
                            <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Ações</th>
                            </tr>
                            </thead>
                            <tbody>
                            <?php if ($list_allergens) : ?>
                                <?php foreach ($list_allergens as $allergen) : ?>
                                    <tr>
                                        <td><?= $allergen['name']?></td>
                                        <td>
                                            <a href="<?=BASE_URL?>admin/allergens/edit/<?=$allergen['id']?>" class="btn btn-info btn-sm" title="Editar"><i class="fas fa-pencil-alt"></i></a>
                                            <a href="#" class="btn btn-danger btn-sm allergen-delete" data-allergen_id="<?=$allergen['id']?>" title="Excluir"><i class="fas fa-trash"></i></a>
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
<script src="<?=BASE_URL?>assets/admin/dist/js/pages/allergens-delete.js"></script>
<!-- /.content -->