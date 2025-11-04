
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1>Classificações</h1>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="<?=BASE_URL?>admin">Dashboard</a></li>
                        <li class="breadcrumb-item"><a href="<?=BASE_URL?>admin/classifications">Grupos
                                Classificação</a></li>
                        <li class="breadcrumb-item active">Editar Classificação</li>
                    </ol>
                </div>
            </div>
        </div><!-- /.container-fluid -->
    </section>
    <div class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-12">
                    <div class="card card-primary">
                        <div class="card-header">
                            <h3 class="card-title">Editar Classificação</h3>
                        </div>
                        <div class="card-body">
                            <form action="<?=BASE_URL?>admin/classifications/store" method="post">
                                <input type="hidden" name="action" value="update">
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label>Nome</label>
                                        <input type="text" class="form-control" name="name" placeholder="Digite o nome do alimento">
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-primary ">Criar</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
<!--/App-Content-->