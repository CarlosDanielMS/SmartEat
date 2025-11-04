<!-- Content Header (Page header) -->
<section class="content-header">
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1>Usuários</h1>
            </div>
            <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="<?=BASE_URL?>admin/dash/home">Dashboard</a></li>
                        <li class="breadcrumb-item active">Usuários</li>
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
                            <a href="<?=BASE_URL?>admin/users/create" class="btn btn-sm btn-success text-uppercase"><i class="fa fa-plus"></i> Adicionar Usuário</a>
                        </div>
                    </div>
                    <!-- /.card-header -->
                    <div class="card-body">
                        <table id="example1" class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Perfil de Acesso</th>
                                    <th>E-mail</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if ($list_users) : ?>
                                    <?php foreach ($list_users as $user) : ?>
                                        <tr>
                                            <td><?= $user['first_name'] ." ".$user['last_name']; ?></td>
                                            <td>
                                                <?= array_key_exists($user['level'], $level)?$level[$user['level']]:'Não encontrado'?></td>
                                            <td><?= $user['email']; ?></td>
                                            <td>
                                                <a href="<?= BASE_URL?>admin/users/edit/<?=$user['id']?>" class="btn btn-info btn-sm" title="Editar"><i class="fas fa-pencil-alt"></i></a>

                                                <a href="#" class="btn btn-danger btn-sm user-delete" data-user_id="<?= $user['id']; ?>" title="Excluir"><i class="fas fa-trash"></i></a>
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
<script src="<?=BASE_URL?>assets/admin/dist/js/pages/users-delete.js"></script>
<!-- /.content -->