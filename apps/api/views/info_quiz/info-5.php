
<section class="container-fluid pt-5">
    <div class="col-12 col-lg-4 mx-auto">
        <div class="progress mb-5">
            <div class="progress-bar bg-success progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%"></div>
        </div>
        <h1 class="text-center">O impacto das Doenças Crônicas nos EUA:</h1>
        <h4 class="text-center">Uma doença é considerada crônica quando persiste por pelo menos um ano e requer atenção médica contínua ou limita as atividades diárias.</h4>
        <h6 class="text-center">Aproximadamente 47% da população dos EUA, 150 milhões de americanos, sofriam de pelo menos uma doença crônica, em 2014.
            Quase 30 milhões de americanos vivem com cinco ou mais doenças crônicas.</h6>
        <h6 class="text-center">Estima-se que 84% dos custos com saúde sejam atribuídos ao tratamento de doenças crônicas.</h6>

        <div class="d-flex justify-content-between">
        <button class="btn btn-danger" onclick="history.back()">Voltar</button>

        <!-- O link envia valores para o controller informando que é info e qual info -->
            <a href="<?=BASE_URL?>quiz/step?step=info&val=5" class="btn btn-success">Próxima</a>
        </div>
    </div>
</section>