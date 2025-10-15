<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Google Font: Source Sans Pro -->
    <title>SmartEat | Planejador</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">

    <link rel="shortcut icon" href="<?= BASE_URL; ?>assets/images/favicon.ico" type="image/x-icon" />
    <link rel="shortcut icon" type="image/x-icon" href="<?= BASE_URL; ?>assets/images/favicon.ico" />

    <link rel="stylesheet" href="<?= BASE_URL; ?>assets/admin/styles.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/apexcharts@3.30.0/dist/apexcharts.css" />
    <link rel="stylesheet" href="<?= BASE_URL; ?>assets/plugins/fontawesome/css/all.min.css" />
    <link rel="stylesheet" href="<?= BASE_URL; ?>assets/css/today.css">

    <link rel="stylesheet" href="<?= BASE_URL; ?>assets/css/bootstrap.min.css" />



    <script>
        BASE_URL = '<?= BASE_URL; ?>';
    </script>

    <script src="<?= BASE_URL; ?>assets/js/jquery.min.js"></script>
    <script src="<?= BASE_URL; ?>assets/js/bootstrap.bundle.min.js"></script>
    <script src="<?= BASE_URL; ?>assets/js/bootstrap.min.js"></script>

</head>

<body class="hold-transition sidebar-mini">
    <div class="ajax_response" style="margin-top: 50px;"></div>
    <!-- Site wrapper -->
    <div class="wrapper">
        <!-- Navbar -->
        <nav class="main-header navbar navbar-expand navbar-white navbar-light">
            <!-- Left navbar links -->
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
                </li>
            </ul>
        </nav>
        <!-- /.navbar -->

        <!-- Main Sidebar Container -->
        <aside class="main-sidebar sidebar-dark-primary elevation-4">
            <!-- Brand Logo -->
            <a href="<?= BASE_URL; ?>planner/today" class="brand-link">
                <img src="<?= BASE_URL; ?>assets/images/logo.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style="opacity: .8">
                <span class="brand-text font-weight-light">SmartEat</span>
            </a>

            <!-- Sidebar -->
            <div class="sidebar-menu">
                <!-- Sidebar user (optional) -->
                <div class="user-panel mt-3 pb-3 mb-3 d-flex">
                    <div class="image">
                        <img src="<?= BASE_URL; ?>assets/images/avatar.jpg" class="img-circle elevation-2" alt="User Image">
                    </div>
                    <div class="info">
                        <a href="#" class="d-block"><?= $viewData['info_user']['first_name']; ?></a>
                    </div>
                </div>

                <!-- SidebarSearch Form -->
                <div class="form-inline">
                    <div class="input-group" data-widget="sidebar-search">
                        <input class="form-control form-control-sidebar" type="search" placeholder="Buscar" aria-label="Search">
                        <div class="input-group-append">
                            <button class="btn btn-sidebar">
                                <i class="fas fa-search fa-fw"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Sidebar Menu -->
                <nav class="mt-2">
                    <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">

                        <li class="nav-item">
                            <a href="<?= BASE_URL; ?>planner/today" class="nav-link">
                                <i class="nav-icon fas fa-calendar-check"></i>
                                <p>Planejador</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="<?= BASE_URL; ?>weight-goal" class="nav-link" class=" nav-link">
                                <i class="nav-icon fas fa-bullseye"></i>
                                <p>Peso e Objetivo</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="<?= BASE_URL; ?>logout" class="nav-link">
                                <i class="nav-icon fas fa-power-off"></i>
                                <p>Sair</p>
                            </a>
                        </li>
                    </ul>
                </nav>
                <!-- /.sidebar-menu -->
            </div>
            <!-- /.sidebar -->
        </aside>

        <div class="content-wrapper">
            <?php $this->loadViewInTemplate($viewName, $viewData); ?>
            <!-- aqui chamamos nossa view -->
        </div>
        <footer class="main-footer">
            <div class="float-right d-none d-sm-block">
                <b>Version</b> 3.2.0
            </div>
            <strong>Copyright &copy; 2024 <a href="#">SmartEat</a>.</strong> All rights reserved.
        </footer>

        <!-- Control Sidebar -->
        <aside class="control-sidebar control-sidebar-dark">
            <!-- Control sidebar content goes here -->
        </aside>
        <!-- /.control-sidebar -->
    </div>
    <!-- ./wrapper -->

    <script src="<?= BASE_URL ?>assets/admin/scripts.js"></script>
    <script src="<?= BASE_URL; ?>assets/js/pages/today.js"></script>
    <script>
        (function() {
            $("#example1").DataTable({
                "responsive": true,
                "lengthChange": false,
                "autoWidth": false,
                "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"],
                "language": {
                    "sEmptyTable": "Nenhum dado disponível na tabela",
                    "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
                    "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
                    "sInfoFiltered": "(Filtrados de _MAX_ registros)",
                    "sInfoPostFix": "",
                    "sInfoThousands": ".",
                    "sLengthMenu": "_MENU_ resultados por página",
                    "sLoadingRecords": "Carregando...",
                    "sProcessing": "Processando...",
                    "sZeroRecords": "Nenhum registro encontrado",
                    "sSearch": "Pesquisar",
                    "oPaginate": {
                        "sNext": "Próximo",
                        "sPrevious": "Anterior",
                        "sFirst": "Primeiro",
                        "sLast": "Último"
                    },
                    "oAria": {
                        "sSortAscending": ": Ordenar colunas de forma ascendente",
                        "sSortDescending": ": Ordenar colunas de forma descendente"
                    },
                    "buttons": {
                        "copy": "Copiar",
                        "csv": "CSV",
                        "excel": "Excel",
                        "pdf": "PDF",
                        "print": "Imprimir",
                        "colvis": "Visibilidade da Coluna"
                    }
                }
            }).buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');
            //Initialize Select2 Elements
            $('.select2').select2()

            //Initialize Select2 Elements
            $('.select2bs4').select2({
                theme: 'bootstrap4'
            })
        });
    </script>
    <script src="<?= BASE_URL; ?>assets/js/apexcharts.min.js"></script>
    <script src="<?= BASE_URL; ?>assets/js/custom/graphic-today.js"></script>
    <script src="<?= BASE_URL; ?>assets/js/custom/planner-check-foods.js"></script>

    <script src="<?= BASE_URL; ?>assets/js/custom/buttons-food.js"></script>
    <script>
        $('.select2bs4').select2({
            theme: 'bootstrap4'
        })
    </script>

    <script src="<?= BASE_URL; ?>assets\js\pages\sidebar.js"></script>    
</body>

</html>