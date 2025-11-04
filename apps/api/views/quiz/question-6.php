
<section class="container-fluid pt-5" data-screen="6">
    <div class="col-12 col-lg-4 mx-auto">
        <div class="progress mb-5">
            <div class="progress-bar bg-success progress-bar" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 45%"></div>
        </div>
        <div class="card bg-light mb-3">
            <div class="card-header text-center">
                <h6 class="text-center">"Utilizamos a Equação de Mifflin-St Jeor para estimar a Taxa Metabólica Basal (TMB), que reflete as calorias que o corpo consome em repouso para sustentar funções vitais como respiração e circulação. A fórmula varia entre homens e mulheres."</h6>
            </div>
            <div class="card-body">
                <form action="">
                    <div class="form-line">
                        <div class="form-group col-12 col-lg-8 mx-auto">
                            <select name="sex" class="form-control">
                                <option selected disabled value="">Sexo</option>
                                <option value="1">Homem</option>
                                <option value="2">Mulher</option>
                            </select>
                        </div>
                        <div class="input-group col-12 col-lg-8 mb-3 mx-auto">
                            <div class="input-group-prepend">
                                <span class="input-group-text">Altura</span>
                            </div>
                            <input type="text" name="height" class="form-control">
                            <div class="input-group-append">
                                <span class="input-group-text">Cm</span>
                            </div>
                        </div>
                        <div class="input-group col-12 col-lg-8 mb-3 mx-auto">
                            <div class="input-group-prepend">
                                <span class="input-group-text">Peso</span>
                            </div>
                            <input type="text" name="weight" class="form-control">
                            <div class="input-group-append">
                                <span class="input-group-text">Kg</span>
                            </div>
                        </div>
                        <div class="input-group col-12 col-lg-8 mb-3 mx-auto">
                            <div class="input-group-prepend">
                                <span class="input-group-text">Idade</span>
                            </div>
                            <input type="text" name="age" class="form-control">
                            <div class="input-group-append">
                                <span class="input-group-text">Anos</span>
                            </div>
                        </div>
                        <div class="form-group col-12 col-lg-8 mx-auto">
                            <select name="physical_activity_level" class="form-control">
                                <option selected disabled value="">Nível de Atividade Física</option>
                                <option value="1.2">Sedentário (pouco ou nenhum exercício): TMB x 1,2</option>
                                <option value="1.375">Leve atividade (1-3 vezes/semana): TMB x 1,375</option>
                                <option value="1.55">Atividade moderada (4-5 vezes/semana): TMB x 1,55</option>
                                <option value="1.725">Atividade intensa (Exercício intenso 6-7 vezes/semana): TMB x 1,725</option>
                                <option value="1.90">Atividade muito intensa (Exercício diário muito intenso, ou trabalho físico): TMB x 1,90</option>
                            </select>
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