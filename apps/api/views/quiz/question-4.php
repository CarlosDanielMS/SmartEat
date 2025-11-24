
<section class="container-fluid pt-5" data-screen="4">
    <div class="col-12 col-lg-4 mx-auto">
        <div class="progress mb-5">
            <div class="progress-bar bg-success progress-bar" role="progressbar" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100" style="width: 30%"></div>
        </div>
        <div class="card bg-light mb-3">
            <div class="card-header text-center">
                <h4 class="text-center">Exclua grupos de alimentos que você não deseja consumir</h4>
                <h6 class="text-center">Isto pode ser devido a alergias ou qualquer outro motivo.</h6>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>Alimentos Alergênicos</label>
                    <select class="select2bs4" multiple="multiple" data-placeholder="Selecione alimento" style="width: 100%;">
                        <?php if ($allergens) : ?>
                            <?php foreach ($allergens as $allergen) : ?>
                                <option value="<?= $allergen['id']; ?>"><?= $allergen['name']; ?></option>
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