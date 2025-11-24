<div class="content-header">
    <div class="container-fluid">
        <div class="row mb-2">

            <div class="col-sm-6">
                <div class="d-flex align-items-center">
                    <a class=" d-flex btn p-0 align-items-center" href="<?= BASE_URL; ?>planner/today">
                        <i class="fa-solid fa-caret-left fa-2x"></i>
                        <span class="text-bold ps-2">Cancelar</span>
                    </a>
                </div>
            </div>

            <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="<?= BASE_URL; ?>planner/today">Home</a></li>
                    <li class="breadcrumb-item active">Peso e Objetivo</li>
                </ol>
            </div><!-- /.col -->
        </div><!-- /.row -->
    </div><!-- /.container-fluid -->
</div>
<!-- /.content-header -->
<!-- Main content -->
<section class="content" data-url="<?= BASE_URL ?>">
    <div class="container-fluid">
        <!-- Small boxes (Stat box) -->
        <div class="row">
            <div class="col-12 col-lg-6 mx-auto">
                <div class="card card-primary">
                    <?php if (isset($_SESSION['ErrorEditPlannerMeal']) && $_SESSION['ErrorEditPlannerMeal']): ?>
                        <div class="alert alert-danger text-center" role="alert">
                            Falha ao atualizar as informações. Por favor, tente novamente.
                        </div>
                    <?php endif; ?>
                    <div class="card-header">
                        <h3 class="card-title">Editar "<?= ($info['name']) ? $info['name'] : 'refeição: ' . $info['meal'] ?>"</h3>
                    </div>
                    <div class="card-body">

                        <form action="<?= BASE_URL; ?>Planner/updatePlannerMeal/<?= $info['id']; ?>" method="POST">
                            <div class="row my-3">
                                <div class="input-group col-12 col-lg-6">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">Refeição:</span>
                                    </div>
                                    <input type="text" name="name" id="name" class="form-control"
                                        placeholder="Ex: Café da manhã, Almoço, Lanche ..."
                                        value="<?= $info['name']; ?>">
                                </div>
                            </div>
                            <div class="d-flex justify-content-between h-100">
                                <a class=" d-flex btn p-0 align-items-center" href="<?= BASE_URL; ?>planner/today">
                                    <span class="text-bold ps-2">Cancelar</span>
                                </a>
                                <button type="submit" class="btn-photo-save btn btn-sm btn-success ml-1">
                                    <span class="fa fa-save"> Salvar</span>
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
        <!-- /.row -->
    </div><!-- /.container-fluid -->
</section>