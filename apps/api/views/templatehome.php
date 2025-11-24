<!doctype html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>SmartEat</title>
    <link rel="shortcut icon" href="<?= BASE_URL; ?>assets/images/favicon.ico" type="image/x-icon" />
    <link rel="shortcut icon" type="image/x-icon" href="<?= BASE_URL; ?>assets/shared/images/favicon.ico" />
    <link rel="stylesheet" href="<?= BASE_URL; ?>assets/css/styles.css" />
    <link rel="stylesheet" href="<?= BASE_URL; ?>assets/css/errors.css">
    <link rel="stylesheet" href="<?= BASE_URL; ?>assets/css/question-9.css">

    <script>
        var BASE_URL = '<?= BASE_URL; ?>';
    </script>
</head>

<body>
    <main>
        <?php $this->loadViewInTemplate($viewName, $viewData); ?>
    </main>
    <script src="<?= BASE_URL; ?>assets/js/scripts.js"></script>
    <script>
        $('.select2bs4').select2({
            theme: 'bootstrap4'
        })
    </script>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <script src="<?= BASE_URL; ?>assets/js/jquery.min.js"></script>
    <script src="<?= BASE_URL; ?>assets/js/jquery.validate.min.js"></script>
    <script src="<?= BASE_URL; ?>assets/js/pages/question-9.js"></script>
</body>

</html>