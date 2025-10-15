
<section class="container-fluid pt-5">
    <div class="col-12 col-lg-4 mx-auto">
        <div class="progress mb-5">
            <div class="progress-bar bg-success progress-bar" role="progressbar" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100" style="width: 90%"></div>
        </div>
        <h4 class="text-center">Essa vai ser a última dieta que você precisará.</h4>
        <h4 class="text-center">Dietas não funcionam como deveriam.</h4>
        <h4 class="text-center">A XXX é uma metodologia fácil, barata e dará resultados expressivos...</h4>
        <p>Peso: <span class="weight-graphic"><?= $weight; ?></span>kg</p>
        <p>Peso Alvo: <span class="target-weight-graphic"><?= $targetWeight; ?></span>kg</p>
        <canvas class="mb-3" id="targetWeightGraphic"></canvas>

        <div class="d-flex justify-content-between">
        <button class="btn btn-danger" onclick="history.back()">Voltar</button>

        <!-- O link envia valores para o controller informando que é info e qual info -->
            <a href="<?=BASE_URL?>quiz/step?step=info&val=11" class="btn btn-success">Próxima</a>
        </div>
    </div>
</section>