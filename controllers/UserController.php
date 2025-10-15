<?php

class UserController extends Controller
{
  public function __construct()
  {
    parent::__construct();
    if (!isset($_SESSION['authAdmin'])) {
      $_SESSION["failed"] = "Email ou senha incorretos, Tente Novamente";
      header("Location: " . BASE_URL . "loadmin/logingin" );
      exit;
  }
  }

  /* Será a lista de dados*/
  public function index()
  { //action

    $data  = array();
    $filters = array();
    $User = new User();

    $data['level'] = [
      2 => 'Usuário',
      5 => 'Administrador'

    ];

    // $limit = 18; //limite de items por página
    // $data['currentPage'] = "1"; //atual pagina

    // if (!empty($_GET['p'])) { //caso na url tenha o p, a página atual passa a ter o valor de p
    // $data['currentPage'] = $_GET['p'];
    // }

    // $offset = ($data['currentPage'] * $limit) - $limit; //determina de onde a lista começa

    // $data['totalUsers'] = $User->getTotal($filters);
    // $data['numberOfPages'] = ceil($data['totalUsers'] / $limit); //determina o numero de páginas
    $data['list_users'] = $User->getAll($filters);

    // if (isset($_GET) && !empty($_GET)) {
    // unset($_GET['p']);
    // $data['gets_active'] = http_build_query($_GET);
    // }

    //nome do template, nome da view, data
    $this->loadTemplate("admin", "admin/users/list", $data);
  }

  public function create()
  { //action

    //nome do template, nome da view, data
    $this->loadTemplate("admin", "admin/users/add");
  }

  //Processa o formulário do adicionar
  // public function store()
  // { //action

  //   // $data  = array();
  //   // $filters = array();
  //   $User = new User();

  //   //INPUT_POST e apenas uma das regras de filter_input, pode e deve ser ajustada
  //   if (!empty($_POST['first_name'])) {
  //     $first_name = filter_input(INPUT_POST, 'first_name');
  //     $last_name = filter_input(INPUT_POST, 'last_name');
  //     $phone = filter_input(INPUT_POST, 'phone');
  //     $genre = filter_input(INPUT_POST, 'genre');
  //     $photo = filter_input(INPUT_POST, 'photo');
  //     $datebirth = filter_input(INPUT_POST, 'datebirth');
  //     $document = filter_input(INPUT_POST, 'document');
  //     $level = filter_input(INPUT_POST, 'level');
  //     $email = filter_input(INPUT_POST, 'email');
  //     $password = filter_input(INPUT_POST, 'password');



  //     if ($User->add($first_name, $last_name, $phone, $genre, $photo, $datebirth, $document, $level, $email, $password)) {
  //       header("location: " . BASE_URL . "ExampleTable");
  //       exit;
  //     }
  //   }
  // }

  public function edit($id)
  { //action

    $data  = array();
    $User = new User();
    // $filters = array();
    $data['info_user'] = $User->get($id);

    //nome do template, nome da view, data
    $this->loadTemplate("admin", "admin/users/edit", $data);
  }

  //Processa o formulário do editar
  public function update($id)
  { //action

    $data  = array();
    $filters = array();
    $Example = new Example();

    //INPUT_POST e apenas uma das regras de filter_input, pode e deve ser ajustada
    if (!empty($_POST['campo_obrigatório'])) {
      $campo1 = filter_input(INPUT_POST, 'campo1');
      $campo2 = filter_input(INPUT_POST, 'campo2');
      $campo3 = filter_input(INPUT_POST, 'campo3');


      if ($Example->update($campo1, $campo2, $campo3, $id)) {
        header("location: " . BASE_URL . "ExampleTable");
        exit;
      }
    }
  }

  //exibe um dado individual
  public function show($id)
  { //action

    $data  = array();
    $filters = array();
    $Example = new Example();

    $data['info'] = $Example->get($id);


    //nome do template, nome da view, data
    $this->loadTemplate("home", "example/show", $data);
  }

  public function destroy($id)
  { //action
   
    $User = new User();
    $data['info_user']=$User->get($id);
    $photo=$data['info_user']['photo'];
    $Message = new Message();
    if (!$User->delete($id)) {
      $this->$Message->error("Você tentnou deletar um usuário que não existe")->flash();
      echo json_encode(["redirect" => BASE_URL . "admin/users"]);
      return;
    }

    if($User->delete($id)&&file_exists(BASE_URL . "assets/upload/images/users/" . $photo)){
      unlink(BASE_URL . "assets/upload/images/users/" . $photo);
    }

    if($User->delete($id)){

            // $this->$Message->success("O usuário foi excluído com sucesso...")->flash();
            header("location: " . BASE_URL . "admin/users");
            exit;
    }
    
  }
}
