
<section class="container-fluid pt-5" data-screen="7">
    <div class="col-12 col-lg-4 mx-auto">
        <div class="progress mb-5">
            <div class="progress-bar bg-success progress-bar" role="progressbar" aria-valuenow="55" aria-valuemin="0" aria-valuemax="100" style="width: 55%"></div>
        </div>
        <div class="card bg-light mb-3">
            <div class="card-header text-center">
                <h6 class="text-center">O CDC e os profissionais de saúde desaconselham fortemente o peso mudanças de mais de 0,9 kg por semana.</h4>
            </div>
            <div class="card-body">
                <form action="">
                    <div class="form-line">
                        <div class="form-group col-12 col-lg-4 mx-auto">
                            <label>Quantos Anos tem?</label>
                            <input type="text" name="age" class="form-control" value="<?= $_SESSION['screen6']->age; ?>" readonly>
                        </div>
                        <div class="form-group col-12 col-lg-4 mx-auto">
                            <label>Quantos é o seu Peso?</label>
                            <input type="text" name="weight" class="form-control" value="<?= $_SESSION['screen6']->weight; ?>" readonly>
                        </div>
                        <div class="form-group col-12 col-lg-4 mx-auto">
                            <label>Quantos é o seu Peso-Alvo?</label>
                            <input type="text" name="target_weight" class="form-control">
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div class="d-flex justify-content-between">
        <button class="btn btn-danger" onclick="history.back()">Voltar</button>
            <button type="button" class="btn-next btn btn-success">Próxima</button>
        </div>
    </div>
</section>