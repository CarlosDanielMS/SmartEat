
<section class="container-fluid pt-5">
    <div class="col-12 col-lg-4 mx-auto">
        <div class="progress mb-5">
            <div class="progress-bar bg-success progress-bar" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: 75%"></div>
        </div>
        <h1 class="text-center mb-2">Custos Indiretos</h1>
        <h4 class="text-center">Pessoas com doenças crônicas tem suas vidas impactadas de maneiras difíceis de medir objetivamente, mas potencialmente devastadoras.
            Um estudo feito nos EUA estima que os custos indiretos de algumas doenças superam em muitas vezes o custo direto.</h4>
        <div>
            <p class="text-center"><span><b>*</b></span> Trabalho e produtividade</p>
            <p class="text-center"><span><b>*</b></span> Educação e cognição</p>
            <p class="text-center"><span><b>*</b></span> Melhor Cognição</p>
            <p class="text-center"><span><b>*</b></span> Meios de subsistência</p>
            <p class="text-center"><span><b>*</b></span> Suas interações sociais</p>
        </div>

        <div class="d-flex justify-content-between">
        <button class="btn btn-danger" onclick="history.back()">Voltar</button>

        <!-- O link envia valores para o controller informando que é info e qual info -->
            <a href="<?=BASE_URL?>quiz/step?step=info&val=8" class="btn btn-success">Próxima</a>
        </div>
    </div>
</section>