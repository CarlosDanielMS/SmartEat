<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>SmartEat</title>
    <link rel="shortcut icon" href="<?= BASE_URL; ?>assets/images/favicon.ico" type="image/x-icon" />
    <link rel="shortcut icon" type="image/x-icon" href="<?= BASE_URL; ?>assets/images/favicon.ico" />
    <!-- Google Font: Source Sans Pro -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="<?= BASE_URL; ?>assets/plugins/fontawesome/css/all.min.css">
    <!-- icheck bootstrap -->
    <link rel="stylesheet" href="<?= BASE_URL; ?>assets/plugins/icheck-bootstrap/icheck-bootstrap.min.css">
    <!-- Theme style -->
    <link rel="stylesheet" href="<?= BASE_URL; ?>assets/dist/css/adminlte.min.css">
    <link rel="stylesheet" href="<?= BASE_URL; ?>assets/css/errors.css">
    <link rel="stylesheet" type="text/css" href="<?= BASE_URL; ?>assets/css/load.css'); ?>" />
    <link rel="stylesheet" type="text/css" href="<?= BASE_URL; ?>assets/css/boot.css'); ?>" />
    <link rel="stylesheet" type="text/css" href="<?= BASE_URL; ?>assets/css/styles.css'); ?>" />
    <link rel="stylesheet" type="text/css" href="<?= BASE_URL; ?>assets/css/login.css'); ?>" />
    <link rel="shortcut icon" href="<?= BASE_URL; ?>assets/images/favicon.ico" type="image/x-icon" />
    <link rel="shortcut icon" type="image/x-icon" href="<?= BASE_URL; ?>assets/images/favicon.ico" />
    <script src="<?= BASE_URL; ?>assets/js/jquery.min.js"></script>

    <script>
        var BASE_URL = '<?= BASE_URL; ?>';
    </script>

</head>

<body class="hold-transition login-page">
    <div class="login-box">
        <!-- /.login-logo -->
        <div class="card card-outline card-primary">
            <div class="card-header text-center">
                <a href="#" class="h1"><b>Smart</b>Eat</a>
            </div>
            <?php $this->loadViewInTemplate($viewName, $viewData); ?>
            <!-- aqui chamamos nossa view -->
        </div>
        <!-- /.card -->
    </div>
    <!-- /.login-box -->

    <!-- jQuery -->

    <!-- Bootstrap 4 -->
    <script src="<?= BASE_URL; ?>assets/js/bootstrap.bundle.min.js"></script>
    <!-- AdminLTE App -->
    <script src="<?= BASE_URL; ?>assets/dist/js/adminlte.min.js"></script>
    <!-- <script src="<?= BASE_URL; ?>assets/js/login.js"></script> -->
</body>

</html>