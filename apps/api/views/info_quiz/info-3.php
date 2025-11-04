
<section class="container-fluid pt-5">
    <div class="col-12 col-lg-4 mx-auto">
        <div class="progress mb-5">
            <div class="progress-bar bg-success progress-bar" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: 40%"></div>
        </div>
        <h1 class="text-center">Estamos muito felizes que você compartilhou.</h1>
        <h4 class="text-center">A perda de peso é um objetivo importante, mas a missão do OmniDiet é ajudar as pessoas a ficarem mais saudáveis, seja lá o que isso for para elas.</h4>
        <h6 class="text-center"><span class="text-danger">AVISO LEGAL:</span> O site, aplicativo, serviços e produtos da Perfect Body destinam-se a apoiar a saúde geral. Nossos produtos e serviços não se destinam a diagnosticar, tratar, curar ou prevenir qualquer doença. Eles não devem ser substituídos por aconselhamento médico ou intervenção médica. Consulte um profissional de saúde qualificado ao tomar decisões médicas.</h6>

        <div class="d-flex justify-content-between">
        <button class="btn btn-danger" onclick="history.back()">Voltar</button>

        <!-- O link envia valores para o controller informando que é info e qual info -->
            <a href="<?=BASE_URL?>quiz/step?step=info&val=3" class="btn btn-success">Próxima</a>
        </div>
    </div>
</section>