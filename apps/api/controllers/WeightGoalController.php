<?php


class WeightGoalController extends Controller
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

    public function home()
    {
        $data = array();
        $user_id = $_SESSION['authUser'];

        $data["info_user"] = $this->info_account;
        $data["full_name"] = $data["info_user"]["first_name"] . " " . $data["info_user"]["last_name"];

        $MainData = new MainData();
        $data['main_data'] = $MainData->get($user_id);

        $this->loadTemplate("user", "users/weight-goal", $data);
    }

    public function updateWeight()
    {
        $MainData = new MainData();
        $Helper = new Helper();
        $user_id = $_SESSION['authUser'];

        $info_main_data = $MainData->get($user_id);

        if (isset($_POST['weight']) && !empty($_POST['weight'])) {

            $weight = filter_input(INPUT_POST, 'weight');

            $amount_calories = $Helper->amountCalories($info_main_data['sex'], $weight, $info_main_data['height'], $info_main_data['age'], $info_main_data['physical_activity_level']);
            $amount_calories_deficit = $amount_calories - $amount_calories * 0.10;

            if ($MainData->updateWeight($user_id, $weight, $amount_calories_deficit)) {

                $_SESSION['success'] = "Peso atualizado com sucesso";
                header("Location: " . BASE_URL . "weight-goal");
                exit;
            } else {
                $_SESSION['failed'] = "Ocorreu um erro e o peso não pode ser atualizado";
                header("Location: " . BASE_URL . "weight-goal");
                exit;
            }
        }
    }

    public function updateTargetWeight()
    {
        $MainData = new MainData();
        $user_id = $_SESSION['authUser'];

        if (isset($_POST['target_weight']) && !empty($_POST['target_weight'])) {

            $target_weight = filter_input(INPUT_POST, 'target_weight');

            if ($MainData->updateTargetWeight($user_id, $target_weight)) {
                $_SESSION['success'] = "Seu objetivo atualizado com sucesso";
                header("Location: " . BASE_URL . "weight-goal");
                exit;
            } else {
                $_SESSION['failed'] = "Ocorreu um erro e o seu objetivo não pode ser atualizado";
                header("Location: " . BASE_URL . "weight-goal");
                exit;
            }
        }
    }

    // public function ajaxUpdate()
    // {
    //     $MainData = new MainData();

    //     $data = json_decode(file_get_contents("php://input"));

    //     $user_id = $_SESSION['authUser'];

    //     if ($data || $_FILES["photo"]) {
    //         if ($data->weight) {
    //             if (!$MainData->updateWeight($user_id,$data->weight)) {

    //                 return;
    //             }

    //             // $this->message->success("Dados atualizado com sucesso...")->flash();
    //             echo json_encode(["reload" => true]);
    //             return;
    //         }

    //         if ($data->target_weight) {

    //             if (!$MainData->updateTargetWeight($user_id,$data->target_weight)) {

    //                 return;
    //             }

    //             echo json_encode(["reload" => true]);
    //             return;
    //         }

    //         // if ($_FILES["photo"]) {
    //         //     $mainData = (new MainData())->findByUserId(user()->id);
    //         //     if ($mainData->photo && file_exists(__DIR__ . "/../../../" . CONF_UPLOAD_DIR . "/{$mainData->photo}")) {
    //         //         unlink(__DIR__ . "/../../../" . CONF_UPLOAD_DIR . "/{$mainData->photo}");
    //         //         (new Thumb())->flush($mainData->photo);
    //         //     }

    //         //     $files = $_FILES["photo"];
    //         //     $upload = new Upload();
    //         //     $image = $upload->image($files, user()->fullName(), 600);
    //         //     $mainData->photo = $image;

    //         //     if (!$mainData->save()) {
    //         //         $json["message"] = $mainData->message()->render();
    //         //         echo json_encode($json);
    //         //         return;
    //         //     }

    //         //     $this->message->success("Dados atualizado com sucesso...")->flash();
    //         //     echo json_encode(["reload" => true]);
    //         //     return;
    //         // }
    //     }
    // }
}
