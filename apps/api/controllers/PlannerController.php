<?php


class PlannerController extends Controller
{
    private $User;
    private $info_account;

    public function __construct()
    {
        parent::__construct();
        if (!isset($_SESSION['authUser'])) {
            $_SESSION["failed"] = "Email ou senha incorretos, Tente Novamente";
            header("Location: " . BASE_URL . "login");
            exit;
        }

        $this->User = new User();
        $this->info_account = $this->User->get($_SESSION['authUser']);
    }


    public function storeFood()
    { //action
        $data  = array();
        $filters  = array();
        $Food = new Food();
        $data['all_foods'] = $Food->getAll($filters);

        //nome do template, nome da view, data
        $this->loadView("users/planner/food/add", $data);
    }


    public function today()
    {
        $data = array();
        $filters = array();

        $user_id = $_SESSION['authUser'];

        $data['currentDate'] = date('d/m/Y');

        $Helper = new Helper();
        $MainData = new MainData();
        $SelectedFood = new SelectedFood();
        $PlannerDay = new PlannerDay();
        $PlannerMeal = new PlannerMeal();
        $PlannerFood = new PlannerFood();
        $Food = new Food();

        $data["planner_day_info"] = $PlannerDay->getAll($user_id);
        $data["info_user"] = $this->info_account;
        $data["full_name"] = $data["info_user"]["first_name"] . " " . $data["info_user"]["last_name"];
        $data["food_image"] =

            $MainData = (new MainData)->get($user_id);

        $number_meals = $MainData['number_meals'];
        $UserSelectedFood = $SelectedFood->getAllForUser($user_id);

        $UserFoods = [];


        for ($i = 0; $i < count($UserSelectedFood); $i++) {
            $UserFoods[] = (new Food())->get($UserSelectedFood[$i]['food_id']);
        }


        switch ($MainData['model_diet']) {
            case 1:
                $p_percentage = 0.4;
                $c_percentage = 0.2;
                $f_percentage = 0.4;
                break;
            case 2:
                $p_percentage = 0.25;
                $c_percentage = 0.45;
                $f_percentage = 0.3;
                break;
            case 3:
                $p_percentage = 0.4;
                $c_percentage = 0.3;
                $f_percentage = 0.3;
                break;
        }

        switch ($number_meals) {
            case 1:
                $number_meals_arr = [1];
                break;
            case 2:
                $number_meals_arr = [0.6, 0.4];
                break;
            case 3:
                $number_meals_arr = [0.2, 0.5, 0.3];
                break;
            case 4:
                $number_meals_arr = [0.1, 0.2, 0.3, 0.4];
                break;
            case 5:
                $number_meals_arr = [0.4, 0.2, 0.2, 0.1, 0.1];
                break;
        }


        $weekDays = $PlannerDay->getAll($user_id);


        if (!$weekDays || count($weekDays) < 7) {


            // redirect("/app/planner/generate-meals");
            // return;
            $this->generateMeals();
        }

        $currentDate = strtotime(date("Y-m-d"));
        $day = date("N", $currentDate);
        $planner_day_info = $PlannerDay->weekDay($day, $user_id);

        $planner_meal = $PlannerMeal->getAll($planner_day_info['id'], $user_id);


        $meals = [];
        if ($planner_meal) {
            foreach ($planner_meal as $meal) {
                $meals[] = $meal;
            }
        }


        for ($i = 0; $i < count($meals); $i++) {
            $foodsArr = [];
            $planner_food = $PlannerFood->getAllToMeal($meals[$i]['id'], $user_id);

            foreach ($planner_food as $pl_food) {
                $foodsArr[] = $pl_food;
            }
            $all_meals[$i]['foods'] = $foodsArr;
        }


        // pegando o total de calorias das refeições do dia
        $total_calories_sum = 0;
        for ($i = 0; $i < count($meals); $i++) {
            $calories = $PlannerFood->getTotalCaloriesForMeal($meals[$i]['id'], $user_id);
            $total_calories_sum += $calories;
            $calories_total[$i]['foods'] = [$calories];
        }
        $data['calories_total_meals'] = $total_calories_sum;


        // $head = $this->seo->render(
        //     CONF_SITE_NAME . " | Planejador",
        //     CONF_SITE_DESC,
        //     url("/app"),
        //     theme("/assets/images/image.jpg", CONF_VIEW_ADMIN),
        //     false
        // );
        $data["weekday_info"] = $PlannerDay->weekDay($day, $user_id);



        $data['all_foods'] = $Food->getAll($filters);
        $data['meals'] = $meals;
        $data['meals_info'] = $all_meals;
        $data['amount_calories_deficit'] = $MainData['amount_calories_deficit'];
        $data['number_meals_arr'] = $number_meals_arr;
        $data['p_percentage'] = $p_percentage;
        $data['c_percentage'] = $c_percentage;
        $data['f_percentage'] = $f_percentage;
        $data['day_id'] = $planner_day_info['id'];
        $data['protein_foods'] = $Food->getAllByDivisionId(1);
        $data['carbohydrate_foods'] = $Food->getAllByDivisionId(2);
        $data['fat_foods'] = $Food->getAllByDivisionId(3);




        // $data['protein_foods'] = (new Food())->find("division_id = :division_id", "division_id=1")->fetch(true);
        // $carbohydrateFoods = (new Food())->find("division_id = :division_id", "division_id=2")->fetch(true);
        // $fatFoods = (new Food())->find("division_id = :division_id", "division_id=3")->fetch(true);

        // echo $this->view->render("widgets/planner/today", [
        //     "app" => "planner",
        //     "head" => $head,
        //     "meals" => $meals,
        //     "amountCaloriesDeficit" => $amountCaloriesDeficit,
        //     "numberMealsArr" => $numberMealsArr,
        //     "pPercentage" => $pPercentage,
        //     "cPercentage" => $cPercentage,
        //     "fPercentage" => $fPercentage,
        //     "dayId" => $plannerDay->id,
        //     "allFoods" => $allFoods,
        //     "proteinFoods" => $proteinFoods,
        //     "carbohydrateFoods" => $carbohydrateFoods,
        //     "fatFoods" => $fatFoods
        // ]);

        $this->loadTemplate("user", "users/planner/today", $data);
    }

    public function week()
    {

        $data = array();
        $user_id = $_SESSION['authUser'];

        $data["info_user"] = $this->info_account;
        $data["full_name"] = $data["info_user"]["first_name"] . " " . $data["info_user"]["last_name"];

        $MainData = new MainData();
        $Helper = new Helper();
        $PlannerDay = new PlannerDay();
        $PlannerMeal = new PlannerMeal();
        $PlannerFood = new PlannerFood();

        $MainData = (new MainData)->get($user_id);
        $amount_calories = $Helper->amountCalories($MainData['sex'], $MainData['weight'], $MainData['height'], $MainData['age'], $MainData['physical_activity_level']);
        $data['amount_calories_deficit'] = $amount_calories - $amount_calories * 0.10;
        $number_meals = $MainData['number_meals'];
        $SelectedFood = (new SelectedFood())->getAllForUser($user_id);

        $Foods = [];
        for ($i = 0; $i < count($SelectedFood); $i++) {
            $Foods[] = (new Food())->get($SelectedFood[$i]['food_id']);
        }


        switch ($MainData['model_diet']) {
            case 1:
                $p_percentage = 0.4;
                $c_percentage = 0.2;
                $f_percentage = 0.4;
                break;
            case 2:
                $p_percentage = 0.25;
                $c_percentage = 0.45;
                $f_percentage = 0.3;
                break;
            case 3:
                $p_percentage = 0.4;
                $c_percentage = 0.3;
                $f_percentage = 0.3;
                break;
        }

        switch ($number_meals) {
            case 1:
                $number_meals_arr = [1];
                break;
            case 2:
                $number_meals_arr = [0.6, 0.4];
                break;
            case 3:
                $number_meals_arr = [0.2, 0.5, 0.3];
                break;
            case 4:
                $number_meals_arr = [0.1, 0.2, 0.3, 0.4];
                break;
            case 5:
                $number_meals_arr = [0.4, 0.2, 0.2, 0.1, 0.1];
                break;
        }

        $weekDays = $PlannerDay->getAll($user_id);


        for ($i = 0; $i < count($weekDays); $i++) {
            $meals = [];
            $planner_meal = $PlannerMeal->getAll($weekDays[$i]['id'], $user_id);
            if ($planner_meal) {
                foreach ($planner_meal as $meal) {
                    $meals[] = $meal;
                }
            }
            for ($j = 0; $j < count($meals); $j++) {
                $foodsArr = [];
                $foods = $PlannerFood->getAllToMeal($meals[$j]['id'], $user_id);
                foreach ($foods as $food) {
                    $foodsArr[] = $food;
                }
                $meals[$j]['foods'] = $foodsArr;
            }
            $weekDays[$i]['meals'] = $meals;
        }

        $currentDate = strtotime(date("Y-m-d"));
        $data['day'] = date("N", $currentDate);

        // $head = $this->seo->render(
        //     CONF_SITE_NAME . " | Planejador",
        //     CONF_SITE_DESC,
        //     url("/app"),
        //     theme("/assets/images/image.jpg", CONF_VIEW_ADMIN),
        //     false
        // );

        // echo $this->view->render("widgets/planner/week", [
        //     "app" => "planner",
        //     "head" => $head,
        //     "weekDays" => $weekDays,
        //     "amountCaloriesDeficit" => $amountCaloriesDeficit,
        //     "numberMealsArr" => $numberMealsArr,
        //     "pPercentage" => $pPercentage,
        //     "cPercentage" => $cPercentage,
        //     "fPercentage" => $fPercentage,
        //     "day" => $day
        // ]);

        $data['name_day_week'] = [
            1 => 'Segunda-feira',
            2 => 'Terça-feira',
            3 => 'Quarta-feira',
            4 => 'Quinta-feira',
            5 => 'Sexta-feira',
            6 => 'Sábado',
            7 => 'Domingo'

        ];

        $data['week_days'] = $weekDays;
        $data['number_meals_arr'] = $number_meals_arr;
        $data['p_percentage'] = $p_percentage;
        $data['c_percentage'] = $c_percentage;
        $data['f_percentage'] = $f_percentage;

        $this->loadTemplate("user", "users/planner/week", $data);
    }

    public function generateMeals()
    {

        $user_id = $_SESSION['authUser'];

        $MainData = new MainData();
        $Helper = new Helper();
        $PlannerDay = new PlannerDay;

        $MainData = (new MainData)->get($user_id);
        // $amount_calories = $Helper->amountCalories($MainData['sex'], $MainData['weight'], $MainData['height'], $MainData['age'], $MainData['physical_activity_level']);

        // $amount_calories_deficit = $amount_calories - $amount_calories * 0.10;
        $SelectedFood = (new SelectedFood())->getAllForUser($user_id);

        $Foods = [];

        for ($i = 0; $i < count($SelectedFood); $i++) {
            $Foods[] = (new Food())->get($SelectedFood[$i]['food_id']);
        }

        $weekDays = [1, 2, 3, 4, 5, 6, 7];
        for ($i = 0; $i < count($weekDays); $i++) {
            $PlannerDay = new PlannerDay();
            $day = $weekDays[$i];
            // $user_id = $_SESSION['authUser'];

            $meals = $Helper->modelDiet($MainData['model_diet'], $MainData['amount_calories_deficit'], $MainData['number_meals'], $Foods);
            $PlannerDay->add($day, $user_id, $meals);
        }

        $week_days = $PlannerDay->getAll($user_id);

        if (!$week_days || count($week_days) < 7) {

            $_SESSION["success"] = "Desculpe. Seu plano não foi criado. Tente novamente mais tarde";
            header("Location:" . BASE_URL . "planner/today");
            exit;
        } else {

            $_SESSION["success"] = "Plano criado com sucesso";
            header("Location:" . BASE_URL . "planner/today");
            exit;
        }
    }

    public function foodChecked()
    {
        $data = json_decode(file_get_contents("php://input"));
        $PlannerFood = new PlannerFood();
        if ($data) {
            $planner_food = $PlannerFood->getForFoodCheck($data['food_id']);
            $planner_food['checked'] = $data['checked'];
            // if (!$plannerFood->save()) {
            //     $json["message"] = $plannerFood->message()->render();
            //     echo json_encode($json);
            //     return;
            // }
            // echo json_encode(["status" => true]);
        }
    }

    public function foodRefresh()
    {

        $data_json = json_decode(file_get_contents("php://input"));
        $data = array();

        $MainData = new MainData();
        $Helper = new Helper();
        // $PlannerDay = new PlannerDay();
        $PlannerMeal = new PlannerMeal();
        $SelectedFood = new SelectedFood();
        $Food = new Food();

        if ($data_json) {

            $user_id = $_SESSION['authUser'];
            $MainData = (new MainData)->get($user_id);
            $amount_calories = $Helper->amountCalories($MainData['sex'], $MainData['weight'], $MainData['height'], $MainData['age'], $MainData['physical_activity_level']);
            $data['amount_calories_deficit'] = $amount_calories - $amount_calories * 0.10;
            $sel_food = $SelectedFood->getAllForUser($user_id);


            $foods = [];

            for ($i = 0; $i < count($sel_food); $i++) {
                $foods[] = $Food->get($sel_food[$i]['food_id']);
            }

            $planner_day_id = $data_json->day_id;

            $meals = $Helper->modelDiet($MainData['model_diet'], $data['amount_calories_deficit'], $MainData['number_meals'], $foods);

            $PlannerMeal->delete($planner_day_id, $user_id);

            $PlannerMeal->addToFoodRefresh($planner_day_id, $meals, $user_id);

            echo json_encode(["redirect" => true]);
        }
    }

    public function singleFoodRefreshAjax()
    {

        $data_json = json_decode(file_get_contents("php://input"));
        if ($data_json) {
            $user_id = $_SESSION['authUser'];
            $MainData = (new MainData)->get($user_id);
            switch ($MainData['model_diet']) {
                case 1:
                    $pPercentage = 0.4;
                    $cPercentage = 0.2;
                    $fPercentage = 0.4;
                    break;
                case 2:
                    $pPercentage = 0.25;
                    $cPercentage = 0.45;
                    $fPercentage = 0.3;
                    break;
                case 3:
                    $pPercentage = 0.4;
                    $cPercentage = 0.3;
                    $fPercentage = 0.3;
                    break;
                default:
                    return false;
            }
            switch ($data_json->type) {
                case "P":
                    $percentage = $pPercentage;
                    $divisionId = 1;
                    $gramsCalories = 4;
                    $type = "proteins";
                    break;
                case "C":
                    $percentage = $cPercentage;
                    $divisionId = 2;
                    $gramsCalories = 4;
                    $type = "carbohydrates";
                    break;
                case "F":
                    $percentage = $fPercentage;
                    $divisionId = 3;
                    $gramsCalories = 9;
                    $type = "fats";
                    break;
            }
            $foods = (new Food())->getAllByDivisionId($divisionId);
            $PlannerFood = new PlannerFood();
            $planner_food_info = $PlannerFood->getForSingleRefresh($data_json->food_id);

            $foodsArr = [];
            foreach ($foods as $food) {
                if ($food['id'] != $planner_food_info['food_id']) {
                    $foodsArr[] = $food;
                }
            }


            $randFood = rand(0, count($foodsArr) - 1);
            $problem1 = $data_json->calories * $percentage / $gramsCalories;
            $problem2 = $problem1 / $foodsArr[$randFood][$type] * $foodsArr[$randFood]['portion_food'];

            $planner_food_portion = number_format($problem2, 2);
            $planner_food_food_id = $foodsArr[$randFood]['id'];

            if (!$PlannerFood->update($planner_food_info['id'], $planner_food_portion, $planner_food_food_id)) {
            }

            echo json_encode(["redirect" => true]);
        }
    }

    public function singleFoodRefresh()
    {


        $data_json = json_decode(file_get_contents("php://input"));

        if ($data_json) {
            $data_json = (object) array_map(function ($value) {
                return strip_tags($value);
            }, (array) $data_json);
            $user_id = $_SESSION['authUser'];
            $MainData = (new MainData)->get($user_id);

            switch ($MainData['model_diet']) {
                case 1:
                    $pPercentage = 0.4;
                    $cPercentage = 0.2;
                    $fPercentage = 0.4;
                    break;
                case 2:
                    $pPercentage = 0.25;
                    $cPercentage = 0.45;
                    $fPercentage = 0.3;
                    break;
                case 3:
                    $pPercentage = 0.4;
                    $cPercentage = 0.3;
                    $fPercentage = 0.3;
                    break;
                default:
                    return false;
            }
            switch ($data_json->type) {
                case "P":
                    $percentage = $pPercentage;
                    $gramsCalories = 4;
                    $type = "proteins";
                    break;
                case "C":
                    $percentage = $cPercentage;
                    $gramsCalories = 4;
                    $type = "carbohydrates";
                    break;
                case "F":
                    $percentage = $fPercentage;
                    $gramsCalories = 9;
                    $type = "fats";
                    break;
            }


            $selectedFood = (new Food())->get($data_json->selected_food_id);
            $PlannerFood = new PlannerFood();
            $planner_food_info = $PlannerFood->getForSingleRefresh($data_json->food_id);


            $problem1 = $data_json->calories * $percentage / $gramsCalories;
            $problem2 = $problem1 / $selectedFood[$type] * $selectedFood['portion_food'];

            $planner_food_portion_food = number_format($problem2, 2);

            if (!$PlannerFood->update($planner_food_info['id'], $planner_food_portion_food, $data_json->selected_food_id)) {
                $json["message"] = "Não foi possível atualizar";
                echo json_encode($json);
                return;
            }

            $json["redirect"] = BASE_URL . "planner/today";
        }
    }

    public function updateCheckedFood($id)
    {
        $PlannerFood = new PlannerFood();

        if (isset($_POST['checked'])) {
            $checked = filter_input(INPUT_POST, 'checked');
            $checked = ($checked == 1) ? 0 : 1;

            if ($PlannerFood->updateCheckedFood($checked, $id)) {
            }
        };
        return false;
    }

    public function editPlannerMeal($id)
    {
        $data = array();
        $PlannerMeal = new PlannerMeal();

        $data["info_user"] = $this->info_account;
        $data["full_name"] = $data["info_user"]["first_name"] . " " . $data["info_user"]["last_name"];

        $data['info'] = $PlannerMeal->getMeal($id);

        $this->loadTemplate("user", "users/planner/meals/edit", $data);
    }

    public function updatePlannerMeal($id)
    {
        $PlannerMeal = new PlannerMeal();

        if (!empty($_POST['name'])) {
            $name = trim(filter_input(INPUT_POST, 'name'));

            if ($PlannerMeal->updatePlannerMeal($name, $id,)) {

                unset($_SESSION['ErrorEditPlannerMeal']);

                header("location: " . BASE_URL . "planner/today");
                exit;
            }
        }

        $_SESSION['ErrorEditPlannerMeal'] = 1;

        header("location: " . BASE_URL . "Planner/editPlannerMeal/" . $id);
        exit;
    }
}
