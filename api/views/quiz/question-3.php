<section class="container-fluid pt-5" data-screen="3">
    <div class="col-12 col-lg-4 mx-auto">
        <div class="progress mb-5">
            <div class="progress-bar bg-success progress-bar" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style="width: 25%"></div>
        </div>
        <div class="card bg-light mb-3">
            <div class="card-header text-center">
                <h4 class="text-center">Bem-vindo à parte mais empolgante do nosso questionário!</h4>
                <h6 class="text-center">Tome o que tempo que achar necessário.</h6>
                <h6 class="text-center">Liste os alimentos que você gosta e deseja manter em sua rotina diária:</h6>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>Alimentos</label>
                    <select class="select2bs4" name="foods" multiple="multiple" data-placeholder="Selecione alimento" style="width: 100%;">
                        <?php if ($foods) : ?>
                            <?php foreach ($foods as $food) : ?>
                                <option value="<?= $food['id']?>"><?= $food['name']?></option>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </select>
                </div>
            </div>
        </div>
        <div class="d-flex justify-content-between">
        <button class="btn btn-danger" onclick="history.back()">Voltar</button>
            <button type="button" class="btn-next btn btn-success">Próxima</button>
        </div>
    </div>
</section>