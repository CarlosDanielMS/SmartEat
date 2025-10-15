<div class="card-body">
    <p class="login-box-msg">Faça login para iniciar sua sessão</p>

    <form action="<?=BASE_URL?>checklogin" method="post">
    <input type="hidden" name="level" value="5">
    <div class="ajax_response">

<?php if (isset($_SESSION["success"])) : ?>
    <div class="alert alert-success" role="alert">
        <?= $_SESSION["success"]; ?>
    </div>
    <?php unset($_SESSION['success']); ?>
<?php endif; ?>

<?php if (isset($_SESSION["failed"])) : ?>
    <div class="alert alert-danger" role="alert">
        <?= $_SESSION["failed"]; ?>
    </div>
    <?php unset($_SESSION['failed']); ?>
<?php endif; ?>

</div>
         <?= $csrf_input; ?>
        <div class="input-group mt-3 mb-3">
            <input type="email" class="form-control" name="email" value="<?= ($cookie ?? null); ?>" placeholder="E-mail">
            <div class="input-group-append">
                <div class="input-group-text">
                    <span class="fas fa-envelope"></span>
                </div>
            </div>
        </div>
        <div class="input-group mb-3">
            <input type="password" name="password" class="form-control" placeholder="Senha">
            <div class="input-group-append">
                <div class="input-group-text">
                    <span class="fas fa-lock"></span>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-8">
                <div class="icheck-primary">
                    <input type="checkbox" id="remember" name="save" <?= (!empty($cookie) ? "checked" : ''); ?>>
                    <label for="remember">Lembre de mim</label>
                </div>
            </div>
            <!-- /.col -->
            <div class="col-4">
                <button type="submit" class="btn btn-primary btn-block">Entrar</button>
            </div>
            <!-- /.col -->
        </div>
    </form>
</div>
<!-- /.card-body -->