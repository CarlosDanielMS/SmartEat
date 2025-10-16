<!-- Content Header (Page header) -->
<section class="content-header">
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1>Alimentos</h1>
            </div>
            <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="<?= BASE_URL ?>admin">Dashboard</a></li>
                    <li class="breadcrumb-item"><a href="<?= BASE_URL ?>admin/foods'">Alimentos</a></li>
                    <li class="breadcrumb-item active">Criar Alimento</li>
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
                        <h3 class="card-title">Alimentos</h3>
                    </div>
                    <div class="card-body">
                        <form id="form_add_food" action="<?= BASE_URL ?>admin/foods/store" method="post" enctype="multipart/form-data">
                            <input type="hidden" name="action" value="create">
                            <div class="row">
                                <div class="form-group col-md-3">
                                    <label>Foto</label>
                                    <input type="file" class="form-control" name="photo" required>
                                </div>
                                <div class="form-group col-md-3">
                                    <label>Nome</label>
                                    <input type="text" class="form-control" name="name"
                                        placeholder="Digite o nome do alimento" required>
                                </div>
                                <div class="form-group col-md-3">
                                    <label>Classificações</label>
                                    <select name="classification_id" class="form-control" required>
                                        <option selected disabled value="">Selecionar</option>
                                        <?php if ($classification_list): ?>
                                            <?php foreach ($classification_list as $classification): ?>
                                                <option value="<?= $classification['id']; ?>"><?=
                                                                                                $classification['name'] ?></option>
                                            <?php endforeach; ?>
                                        <?php endif; ?>
                                    </select>
                                </div>
                                <div class="form-group col-md-3">
                                    <label>Grupos Alérgenos</label>
                                    <select name="allergen_id[]" class="form-control select2" multiple="multiple"
                                        data-placeholder="Selecionar">
                                        <?php if ($allergen_list): ?>
                                            <?php foreach ($allergen_list as $allergen): ?>
                                                <option value="<?= $allergen['id']; ?>"><?= $allergen['name'] ?></option>
                                            <?php endforeach; ?>
                                        <?php endif; ?>
                                    </select>
                                </div>
                                <div class="form-group col-md-3 col-6">
                                    <label>Divisão</label>
                                    <select name="division_id" class="form-control" required>
                                        <option selected disabled value="">Selecionar</option>
                                        <option value="1">Proteína</option>
                                        <option value="2">Carboidrato</option>
                                        <option value="3">Gordura</option>
                                        <option value="4">Recomendável</option>
                                    </select>
                                </div>
                                <div class="form-group col-md-2 col-3">
                                    <label>Porção (g)</label>
                                    <input type="text" class="mask-decimal form-control" name="portion" required>
                                </div>
                                <div class="form-group col-md-2 col-3">
                                    <label>Calorias</label>
                                    <input type="text" class="mask-decimal form-control" name="calories" required>
                                </div>

                                <hr class="col-md-12">

                                <div class="row">
                                    <span class="col-md-12 text-bold">Macronutrientes</span>
                                    <div class="form-group col-md-2 col-3">
                                        <label>Proteínas</label>
                                        <input type="text" class="mask-decimal form-control" name="proteins" required>
                                    </div>
                                    <div class="form-group col-md-2 col-3">
                                        <label>Gorduras</label>
                                        <input type="text" class="mask-decimal form-control" name="fats" required>
                                    </div>
                                    <div class="form-group col-md-2 col-3">
                                        <label>Carboidratos</label>
                                        <input type="text" class="mask-decimal form-control" name="carbohydrates" required>
                                    </div>
                                    <div class="form-group col-md-2 col-3">
                                        <label>Fibras</label>
                                        <input type="text" class="mask-decimal form-control" name="fibers" required>
                                    </div>
                                    <div class="form-group col-md-2 col-3">
                                        <label>Índice Glicêmico</label>
                                        <input type="text" class="mask-decimal form-control" name="sugar_level" required>
                                    </div>
                                </div>

                                <hr class="col-md-12">

                                <div class="row">
                                    <span class="col-md-12 text-bold">Micronutrientes</span>
                                    <div class="form-group col-md-2 col-3">
                                        <label>Colesterol</label>
                                        <input type="text" class="mask-decimal form-control" name="cholestreol">
                                    </div>
                                    <div class="form-group col-md-2 col-3">
                                        <label>Cálcio</label>
                                        <input type="text" class="mask-decimal form-control" name="calcium">
                                    </div>
                                    <div class="form-group col-md-2 col-3">
                                        <label>Magnésio</label>
                                        <input type="text" class="mask-decimal form-control" name="magnesium">
                                    </div>
                                    <div class="form-group col-md-2 col-3">
                                        <label>Fósforo</label>
                                        <input type="text" class="mask-decimal form-control" name="phosphorus">
                                    </div>
                                    <div class="form-group col-md-2 col-3">
                                        <label>Ferro</label>
                                        <input type="text" class="mask-decimal form-control" name="iron">
                                    </div>
                                    <div class="form-group col-md-2 col-3">
                                        <label>Sódio</label>
                                        <input type="text" class="mask-decimal form-control" name="sodium">
                                    </div>
                                    <div class="form-group col-md-2 col-3">
                                        <label>Potássio</label>
                                        <input type="text" class="mask-decimal form-control" name="potassium">
                                    </div>
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