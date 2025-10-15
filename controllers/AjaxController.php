<?php
class AjaxController extends Controller
{

  public function __construct()
  {
    parent::__construct();
  }

  public function checkLoginExist()
  {
    $data = array();
    //ação desejada, no final precisamos ter um return para ser processada via javascript
  }


  public function userDelete()
  {
    $User = new User();
    $id = $_POST['id'];
    $data['info_user'] = $User->get($id);
    $photo = $data['info_user']['photo'];
    // $Message = new Message();

    if ($User->delete($id) && file_exists(BASE_URL . "assets/upload/images/users/" . $photo)) {
      unlink(BASE_URL . "assets/upload/images/users/" . $photo);
    }

    $User->delete($id);
  }

  public function allergenDelete()
  {
    $Allergen = new Allergen();
    $id = $_POST['id'];

    $Allergen->delete($id);
  }

  public function classificationDelete()
  {
    $Allergen = new Allergen();
    $id = $_POST['id'];

    $Allergen->delete($id);
  }

  public function checkEmail($email)
  {
    $User = new User();

    $email = filter_input(INPUT_POST, 'email');

    if ($User->checkEmail($email)) {
      echo 'false';
    } else {
      echo 'true';
    }
  }

  public function refresh_meals()
  {
    $MainData = new MainData();
    $SelectedFood = new SelectedFood();
    $Food = new Food();
    $Helper = new Helper();
    $PlannerMeal = new PlannerMeal();

    $user_id = $_SESSION['authUser'];
    $day_id = filter_input(INPUT_POST, 'day');

    //Pega os alimentos positivos
    $select_food = $SelectedFood->getAllForUser($user_id);
    //Pega as informações do usuário
    $info_user = $MainData->get($user_id);

    //Array com os alimentos utilizáveis
    $foods = [];

    for ($i = 0; $i < count($select_food); $i++) {
      $foods[] = $Food->get($select_food[$i]['food_id']);
    }

    if (isset($foods) && !empty($foods)) {

      if ($meals = $Helper->modelDiet($info_user['model_diet'], $info_user['amount_calories_deficit'], $info_user['number_meals'], $foods)) {
        $PlannerMeal->delete($day_id, $user_id);
        $PlannerMeal->addToFoodRefresh($day_id, $meals, $user_id);
        // header('Content-Type: application/json');
        // echo json_encode($meals);
        // exit; // Encerra a execução para evitar saída adicional
      }
    }
  }

  // public function refresh_single_food()
  // {
  //   $MainData = new MainData();
  //   $SelectedFood = new SelectedFood();
  //   $Food = new Food();
  //   $Helper = new Helper();
  //   $PlannerMeal = new PlannerMeal();
  // } 

  public function getAllFood()
  {
    $data  = array();
    $filters = array();
    $Food = new Food();

    $filters['division_id'] = filter_input(INPUT_POST, 'division_id', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY);
    $filters['allergens'] = filter_input(INPUT_POST, 'allergens', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY);

    $data['all_foods'] = $Food->getAll($filters);

    // Retorna a resposta em JSON para a requisição AJAX
    header('Content-Type: application/json');
    echo json_encode($data['all_foods']);
  }

  public function AddItemPlannerFood()
  {
    $PlannerFood = new PlannerFood();

    //INPUT_POST e apenas uma das regras de filter_input, pode e deve ser ajustada
    if (!empty($_POST['portion_food'])) {
      $portion_food = filter_input(INPUT_POST, 'portion_food');
      $type = filter_input(INPUT_POST, 'type');
      $food_id = filter_input(INPUT_POST, 'food_id');
      $meal_id = filter_input(INPUT_POST, 'meal_id');

      if ($type == 1) {
        $type = 'P';
      } elseif ($type == 2) {
        $type = 'C';
      } else {
        $type = 'F';
      }

      $user_id = $_SESSION['authUser'];

      if ($id_new_planner_food = ($PlannerFood->add($portion_food, $type, $food_id, $meal_id, $user_id))) {   
          

        $new_planner_food = $PlannerFood->getForSingleRefresh($id_new_planner_food,$user_id);

        header('Content-Type: application/json');
        echo json_encode($new_planner_food);
        exit;
      }
    }
  }
}
