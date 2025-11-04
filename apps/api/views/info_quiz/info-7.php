
<section class="container-fluid pt-5">
    <div class="col-12 col-lg-4 mx-auto">
        <div class="progress mb-5">
            <div class="progress-bar bg-success progress-bar" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style="width: 70%"></div>
        </div>
        <h1 class="text-center">OBESIDADE</h1>
        <h4 class="text-center">É apontada como o maior fator de risco individual para doenças crônicas.</h4>
        <h6 class="text-center">Ela é  responsável por quase 44% dos custos diretos com cuidados de saúde nos EUA.</h6>

        <div class="d-flex justify-content-between">
        <button class="btn btn-danger" onclick="history.back()">Voltar</button>

        <!-- O link envia valores para o controller informando que é info e qual info -->
            <a href="<?=BASE_URL?>quiz/step?step=info&val=7" class="btn btn-success">Próxima</a>
        </div>
    </div>
</section>