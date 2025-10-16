
<section class="container-fluid pt-5">
    <div class="col-12 col-lg-4 mx-auto">
        <div class="progress mb-5">
            <div class="progress-bar bg-success progress-bar" role="progressbar" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100" style="width: 65%"></div>
        </div>
        <h1 class="text-center mb-2">Maiores condições crônicas:</h1>
        <div>
            <p class="text-center"><span><b>*</b></span> Doenças Cardiovasculares</p>
            <p class="text-center"><span><b>*</b></span> Diabetes</p>
            <p class="text-center"><span><b>*</b></span> Alzheimer</p>
            <p class="text-center"><span><b>*</b></span> Artrite e dor nas costas</p>
        </div>
        <div class="d-flex justify-content-between">
        <button class="btn btn-danger" onclick="history.back()">Voltar</button>

        <!-- O link envia valores para o controller informando que é info e qual info -->
            <a href="<?=BASE_URL?>quiz/step?step=info&val=6" class="btn btn-success">Próxima</a>
        </div>
    </div>
</section>