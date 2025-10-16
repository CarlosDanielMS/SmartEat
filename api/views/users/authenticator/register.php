<form action="<?= BASE_URL; ?>register" method="post" id="register">
    <div class="card box-shadow-0 mb-xl-0">
        <div class="card-header">
            <h3 class="card-title">Crie sua conta</h3>
        </div>
        <div class="card-body">
            <div class="ajax_response">
                <?php if (isset($_SESSION["failed"])) : ?>
                    <div class="alert alert-danger" role="alert">
                        <?= $_SESSION["failed"]; ?>
                    </div>

                    <?php unset($_SESSION['failed']); ?>
                <?php endif; ?>
            </div>
            <?= $csrf_input; ?>
            <div class="form-group">
                <label class="form-label text-dark">Nome</label>
                <input type="text" name="first_name" class="form-control" placeholder="Digite seu nome">
            </div>
            <div class="form-group">
                <label class="form-label text-dark">Sobrenome</label>
                <input type="text" name="last_name" class="form-control" placeholder="Digite seu sobrenome">
            </div>
            <div class="form-group">
                <label class="form-label text-dark">E-mail</label>
                <input type="email" name="email" class="form-control" placeholder="Digite seu e-mail" value="<?= ($best_email) ? $best_email : '' ?>">
            </div>
            <div class="form-group">
                <label class="form-label text-dark">Senha</label>
                <input type="password" id="password" name="password" class="form-control" placeholder="Digite sua senha">
            </div>
            <div class="form-group">
                <label class="form-label text-dark">Confirmar Senha</label>
                <input type="password" name="c_password" class="form-control" placeholder="Digite sua senha novamente">
            </div>
            <div class="form-footer mt-2">
                <button type="submit" class="btn btn-primary btn-block">Criar Conta</button>
            </div>
            <div class="text-center  mt-3 text-dark">
                Já tem conta?<a href="<?= BASE_URL; ?>admin/login"> Entrar</a>
            </div>
        </div>
    </div>
</form>
<script src="<?= BASE_URL; ?>assets/js/pages/register-validate.js"></script>
<script src="<?= BASE_URL; ?>assets/js/jquery.validate.min.js"></script>