<?php

class ClassificationController extends Controller
{
  public function __construct()
  {
    parent::__construct();
    if (!isset($_SESSION['authAdmin'])) {
      $_SESSION["failed"] = "Email ou senha incorretos, Tente Novamente";
      header("Location: " . BASE_URL . "admin/login" );
      exit;
  }
  }

  /* Será a lista de dados*/
  public function index()
  { //action

    $data  = array();
    $Classification = new Classification();

    $data['list_classifications'] = $Classification->getAll();

    //nome do template, nome da view, data
    $this->loadTemplate("admin","admin/classifications/list", $data);
  }

  public function create()
  { //action

    //nome do template, nome da view, data
    $this->loadTemplate("admin","admin/classifications/add");
  }

  //Processa o formulário do adicionar
  public function store()
  { //action

    $Classification = new Classification();

    //INPUT_POST e apenas uma das regras de filter_input, pode e deve ser ajustada
    if (!empty($_POST['name'])) {
      $name = filter_input(INPUT_POST, 'name');

      if ($Classification->add($name)) {
       $_SESSION['success']='Classificação atualizada';
      }else{
        $_SESSION['success']='A classificação não foi atualizada';
      }
      header("location: " . BASE_URL . "admin/classifications");
    }
  

  }

  public function edit($id)
  { //action

    $data  = array();
    $Classification=new Classification;
    $data['info_classification']=$Classification->get($id);

    //nome do template, nome da view, data
    $this->loadTemplate("admin","admin/classifications/edit", $data);
  }

  //Processa o formulário do editar
  public function update($id)
  { //action
    $Classification = new Classification();

    //INPUT_POST e apenas uma das regras de filter_input, pode e deve ser ajustada
    if (!empty($_POST['name'])) {
      $name = filter_input(INPUT_POST, 'name');

      if ($Classification->update($id, $name)) {
        $_SESSION['success']='Classificação atualizada';
      }else{
        $_SESSION['failed']='A classificação não foi atualizada. Tente novamente mais tarde';
      }
      header("location: " . BASE_URL . "admin/classifications");
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
    $this->loadTemplate("home","example/show", $data);
  }

  public function destroy($id)
  { //action

    $data  = array();
    $filters = array();
    $Example = new Example();
    if ($Example->delete($id)) {
      header("location: " . BASE_URL . "ExampleTable");
      exit;
    }
  

  }



  

  



 

}
