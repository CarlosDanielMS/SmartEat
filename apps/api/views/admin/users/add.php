    <!-- Content Header (Page header) -->
    <section class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1>Usuários</h1>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="<?=BASE_URL?>admin">Dashboard</a></li>
                        <li class="breadcrumb-item"><a href="<?=BASE_URL?>admin/users">Usuários</a></li>
                        <li class="breadcrumb-item active">Criar Usuário</li>
                    </ol>
                </div>
            </div>
        </div><!-- /.container-fluid -->
    </section>
    <div class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-12">
                    <div class="card card-primary">
                        <div class="card-header">
                            <h3 class="card-title">Usuários</h3>
                        </div>
                        <div class="card-body">
                            <form action="<?=BASE_URL?>admin/users/store" method="post" enctype="multipart/form-data">
                                <input type="hidden" name="action" value="create">
                                <div class="row">
                                    <div class="form-group col-md-6">
                                        <label>Nome</label>
                                        <input type="text" class="form-control" name="first_name" placeholder="Digite seu nome">
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label>Sobrenome</label>
                                        <input type="text" class="form-control" name="last_name" placeholder="Digite seu sobrenome">
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label>*Telefone/WhatsApp</label>
                                        <input type="tel" class="form-control mask-phone" name="phone" placeholder="Digite o telefone">
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label>Gênero</label>
                                        <select name="genre" class="form-control">
                                            <option value="">Selecione o gênero</option>
                                            <option value="male" class="">Masculino</option>
                                            <option value="female" class="">Feminino</option>
                                            <option value="other" class="">Outros</option>
                                        </select>
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label>Foto</label>
                                        <input type="file" class="form-control" name="photo">
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label>Nascimento</label>
                                        <input type="text" class="form-control mask-date" name="datebirth" placeholder="Digite sua data de nascimento">
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label>CPF</label>
                                        <input type="text" class="form-control mask-doc" name="document" placeholder="Digite seu CPF">
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label>Perfil de Acesso</label>
                                        <select name="level" class="form-control">
                                            <option value="">Selecione o perfil</option>
                                            <option value="5" class="">Admin</option>
                                        </select>
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label>E-mail</label>
                                        <input type="email" class="form-control" name="email" placeholder="Digite seu e-mail">
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label>Senha</label>
                                        <input type="password" class="form-control" name="password" placeholder="Digite sua senha">
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-primary ">Criar</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
