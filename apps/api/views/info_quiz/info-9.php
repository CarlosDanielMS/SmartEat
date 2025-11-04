
<section class="container-fluid pt-5">
    <div class="col-12 col-lg-4 mx-auto">
        <div class="progress mb-5">
            <div class="progress-bar bg-success progress-bar" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style="width: 80%"></div>
        </div>
        <h4 class="text-center">Obesidade e doenças crônicas tem um impacto direto e significativo na vida social, financeira e um impacto no futuro e nas pessoas ao nosso redor.</h4>
        <h4 class="text-center">Despesas médicas, medicamentos, perda de produtividade, redução da qualidade de vida, isolamento social, redução da autoestim, entre outros.</h4>

        <div class="d-flex justify-content-between">
        <button class="btn btn-danger" onclick="history.back()">Voltar</button>

        <!-- O link envia valores para o controller informando que é info e qual info -->
            <a href="<?=BASE_URL?>quiz/step?step=info&val=9" class="btn btn-success">Próxima</a>
        </div>
    </div>
</section>