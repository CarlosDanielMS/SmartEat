<?php

class AllergenController extends Controller
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
    $Allergen = new Allergen();

    $data['list_allergens'] = $Allergen->getAll();

    $this->loadTemplate("admin", "admin/allergens/list", $data);
  }

  public function create()
  { //action

    //nome do template, nome da view, data
    $this->loadTemplate("admin", "admin/allergens/add");
  }

  //Processa o formulário do adicionar
  public function store()
  { //action
    
    $Allergen = new Allergen();

    //INPUT_POST e apenas uma das regras de filter_input, pode e deve ser ajustada
    if (!empty($_POST['name'])) {
      $name = filter_input(INPUT_POST, 'name');

      if ($Allergen->add($name)) {

        $_SESSION['success'] = 'Alérgeno adicionado com sucesso';
      } else {
        $_SESSION['failed'] = 'O alérgeno não foi adicionado. Tente novamente mais tarde.';
      }
    }
    header("location: " . BASE_URL . "admin/allergens");
  }

  public function edit($id)
  { //action

    $data  = array();
    $Allergen=new Allergen();
    $data['info_allergen']=$Allergen->get($id);


    //nome do template, nome da view, data
    $this->loadTemplate("admin", "admin/allergens/edit", $data);
  }

  //Processa o formulário do editar
  public function update($id)
  { //action
    $data  = array();
    $Allergen = new Allergen();

    if (!empty($_POST['name'])) {
      $name = filter_input(INPUT_POST, 'name');
      
      if ($Allergen->update($id, $name)) {
        $_SESSION['success']='Alérgeno atualizado com sucesso';
      }else{
        $_SESSION['failed']='O Alérgeno não foi atualizado. Tente novamente mais tarde.';
      }
    }
    header("location: " . BASE_URL . "admin/allergens");
  }

  // public function show($id)
  // { //action

  //   $data  = array();
  //   $filters = array();
  //   $Example = new Example();

  //   $data['info'] = $Example->get($id);


  //   //nome do template, nome da view, data
  //   $this->loadTemplate("home", "example/show", $data);
  // }

  // public function destroy($id)
  // { //action

  //   $data  = array();
  //   $filters = array();
  //   $Example = new Example();
  //   if ($Example->delete($id)) {
  //     header("location: " . BASE_URL . "ExampleTable");
  //     exit;
  //   }
  // }
}
