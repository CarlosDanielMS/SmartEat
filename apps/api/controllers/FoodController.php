<?php

class FoodController extends Controller
{
  public function __construct()
  {
    parent::__construct();
    if (!isset($_SESSION['authAdmin'])) {
      $_SESSION["failed"] = "Email ou senha incorretos, Tente Novamente";
      header("Location: " . BASE_URL . "admin/login");
      exit;
    }
  }

  /* Será a lista de dados*/
  public function index()
  { //action

    $data  = array();
    $Food = new Food();
    $filters = array();
    $data['list_foods'] = $Food->getAll($filters);

    $data['division'] = [
      1 => 'Proteína',
      2 => 'Carboidrato',
      3 => 'Gordura'
    ];

    //nome do template, nome da view, data
    $this->loadTemplate("admin", "admin/foods/list", $data);
  }

  public function create()
  { //action

    $data  = array();
    $Allergen = new Allergen();
    $Classification = new Classification();
    $data['allergen_list'] = $Allergen->getAll();
    $data['classification_list'] = $Classification->getAll();

    //nome do template, nome da view, data
    $this->loadTemplate("admin", "admin/foods/add", $data);
  }

  //Processa o formulário do adicionar
  public function store()
  { //action

    $Food = new Food();
    $Resources = new Resources();
    $Macronutrients = new Macronutrients();
    $Micronutrients = new Micronutrients();

    //INPUT_POST e apenas uma das regras de filter_input, pode e deve ser ajustada
    if (!empty($_POST['name'])) {
      //foods
      $name = filter_input(INPUT_POST, 'name');
      $classification_id = filter_input(INPUT_POST, 'classification_id');
      $allergen_id = $_POST['allergen_id'];
      $division_id = filter_input(INPUT_POST, 'division_id');
      $portion = filter_input(INPUT_POST, 'portion');
      $calories = filter_input(INPUT_POST, 'calories');
      //macronutrients
      $proteins = filter_input(INPUT_POST, 'proteins');
      $fats = filter_input(INPUT_POST, 'fats');
      $carbohydrates = filter_input(INPUT_POST, 'carbohydrates');
      $fibers = filter_input(INPUT_POST, 'fibers');
      $sugar_level = filter_input(INPUT_POST, 'sugar_level');

      //Verifica se os inputs estão vazios pois tipo de dados decimal não aceita campo vazio
      function verificationInput($input_name)
      {
        $value = filter_input(INPUT_POST, $input_name);
        return $value !== '' ? $value : 0;
      }
      // Micronutrientes
      $cholestreol = verificationInput('cholestreol');
      $calcium = verificationInput('calcium');
      $magnesium = verificationInput('magnesium');
      $phosphorus = verificationInput('phosphorus');
      $iron = verificationInput('iron');
      $sodium = verificationInput('sodium');
      $potassium = verificationInput('potassium');

      if ($_FILES['photo']['size'] == 0) {
        //se não existir a imagem coloa uma padrão
        $file = "assets/admin/images/no-photo.jpg";
      } else {

        $file = $Resources->uploadFile('assets/admin/images/', $_FILES['photo']);
        if ($file == "error") {
          header("Location: " . BASE_URL . "admin/foods");
          exit;
        }
      }

      $type_id = 1; // 1 = food;

      if ($reference_id = $Food->add($file, $name, $classification_id, $allergen_id, $division_id, $portion, $calories)) {

        if ($Macronutrients->add($proteins, $fats, $carbohydrates, $fibers, $sugar_level, $type_id, $reference_id)) {

          if ($Micronutrients->add($cholestreol, $calcium, $magnesium, $phosphorus, $iron, $sodium, $potassium, $type_id, $reference_id)) {
            $_SESSION['success'] = 'Alimento adicionado com sucesso';
            header("location: " . BASE_URL . "admin/foods");
            exit;
          }
        }
      } else {
        $_SESSION['failed'] = 'O alimento não foi adicionado. Tente novamente mais tarde';
        header("location: " . BASE_URL . "admin/foods");
        exit;
      }
    }
  }

  public function edit($id)
  { //action

    $data  = array();
    $Food = new Food();
    $Classification = new Classification();
    $Allergen = new Allergen();
    $data['classification_list'] = $Classification->getAll();
    $data['allergen_list'] = $Allergen->getAll();


    $data['info_food'] = $Food->get($id);
    $data['selected_allergens_by_food'] = $Food->getAllergensByFood($id);

    foreach ($data['selected_allergens_by_food'] as $allergen) {
      $data['selected_allergen'][] = $allergen['allergen_id'];
    }
    //nome do template, nome da view, data
    $this->loadTemplate("admin", "admin/foods/edit", $data);
  }

  //Processa o formulário do editar
  public function update($id)
  { //action

    $Food = new food();
    $Resources = new Resources();
    $Macronutrients = new Macronutrients();
    $Micronutrients = new Micronutrients();

    $data['info_food'] = $Food->get($id);

    //INPUT_POST e apenas uma das regras de filter_input, pode e deve ser ajustada
    if (!empty($_POST['name']) || !empty($_POST['calories']) || isset($_POST['vitamin_a'])) {
      $name = filter_input(INPUT_POST, 'name');
      $classification_id = filter_input(INPUT_POST, 'classification_id');
      $allergen_id = $_POST['allergen_id'];
      $division_id = filter_input(INPUT_POST, 'division_id');
      $portion = filter_input(INPUT_POST, 'portion_food');
      $calories = filter_input(INPUT_POST, 'calories');

      //macronutrients
      $proteins = filter_input(INPUT_POST, 'proteins');
      $fats = filter_input(INPUT_POST, 'fats');
      $carbohydrates = filter_input(INPUT_POST, 'carbohydrates');
      $fibers = filter_input(INPUT_POST, 'fibers');
      $sugar_level = filter_input(INPUT_POST, 'sugar_level');

      //Verifica se os inputs estão vazios pois tipo de dados decimal não aceita campo vazio
      function verificationInput($input_name)
      {
        $value = filter_input(INPUT_POST, $input_name);
        return $value !== '' ? $value : 0;
      }
      // Micronutrientes

      $cholestreol = verificationInput('cholestreol');
      $calcium = verificationInput('calcium');
      $magnesium = verificationInput('magnesium');
      $phosphorus = verificationInput('phosphorus');
      $iron = verificationInput('iron');
      $sodium = verificationInput('sodium');
      $potassium = verificationInput('potassium');

      $upload_dir = 'assets/admin/images/' . $data['info_food']['name'] . '/';

      $file = $_FILES['photo']['error'];


      if ($file == 4) {
        $file = $data['info_food']['photo'];
      } else {
        $Resources->deleteFile($data['info_food']['photo']);
        $file = $Resources->uploadFile($upload_dir, $_FILES['photo'], 'picture');
      }

      if (
        ($Food->update($file, $name, $classification_id, $allergen_id, $division_id, $portion, $calories, $id))
        |
        ($Macronutrients->update($proteins, $fats, $carbohydrates, $fibers, $sugar_level, $id))
        |
        ($Micronutrients->update($cholestreol, $calcium, $magnesium, $phosphorus, $iron, $sodium, $potassium, $id))
      ) {
        $_SESSION['success'] = 'Alimento atualizado com sucesso';
        header("location: " . BASE_URL . "admin/foods");
        exit;
      } else {
        $_SESSION['failed'] = 'O alimento não foi atualizado. Tente novamente mais tarde';
        header("location: " . BASE_URL . "admin/foods");
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

    $data  = array();
    $filters = array();
    $Example = new Example();
    if ($Example->delete($id)) {
      header("location: " . BASE_URL . "ExampleTable");
      exit;
    }
  }
}
