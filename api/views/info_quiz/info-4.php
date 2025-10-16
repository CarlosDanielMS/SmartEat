
<section class="container-fluid pt-5">
    <div class="col-12 col-lg-4 mx-auto">
        <div class="progress mb-5">
            <div class="progress-bar bg-success progress-bar" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width: 50%"></div>
        </div>
        <h1 class="text-center font-italic mb-2">"Se você não arrumar tempo para cuidar de sua saúde um dia terá que arrumar tempo para cuidar de sua doença."</h1>
        <h4 class="text-center">A recompensa de investir em você:</h4>
        <div>
            <p class="text-center"><span class="text-success">√</span> Aumento na Qualidade de Vida</p>
            <p class="text-center"><span class="text-success">√</span> Menos doenças</p>
            <p class="text-center"><span class="text-success">√</span> Melhor Cognição</p>
            <p class="text-center"><span class="text-success">√</span> Imunidade aumentada</p>
            <p class="text-center"><span class="text-success">√</span> Longevidade</p>
            <p class="text-center"><span class="text-success">√</span> Melhorar Libido e Vida Sexual</p>
        </div>

        <div class="d-flex justify-content-between">
        <button class="btn btn-danger" onclick="history.back()">Voltar</button>

        <!-- O link envia valores para o controller informando que é info e qual info -->
            <a href="<?=BASE_URL?>quiz/step?step=info&val=4" class="btn btn-success">Próxima</a>
        </div>
    </div>
</section>