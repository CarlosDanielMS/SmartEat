
<section class="container-fluid pt-5" data-screen="5">
    <div class="col-12 col-lg-4 mx-auto">
        <div class="progress mb-5">
            <div class="progress-bar bg-success progress-bar" role="progressbar" aria-valuenow="35" aria-valuemin="0" aria-valuemax="100" style="width: 35%"></div>
        </div>
        <div class="card bg-light mb-3">
            <div class="card-header text-center">
                <h4 class="text-center">Você está em risco de algum dos seguintes?</h4>
            </div>
            <div class="card-body">
                <div class="d-flex flex-column">
                    <a class="btn btn-info mb-2">Deficiência de Testoterona</a>
                    <a class="btn btn-info mb-2">Doença cardíaca ou acidente vascular cerebral</a>
                    <a class="btn btn-info mb-2">Pressão Artesial Elevada</a>
                    <a class="btn btn-info mb-2">Diabetes</a>
                    <a class="btn btn-info mb-2">Colesterol Alto</a>
                    <a class="btn btn-info mb-2">Depressão</a>
                    <input type="text" name="others" value="" class="form-control form-control-sm mb-2" placeholder="Outros">
                    <a class="btn btn-info mb-2">Nenhum</a>
                </div>
            </div>
        </div>
        <div class="d-flex justify-content-between">
        <button class="btn btn-danger" onclick="history.back()">Voltar</button>
            <button type="button" class="btn-next btn btn-success" disabled>Próxima</button>
        </div>
    </div>
</section>