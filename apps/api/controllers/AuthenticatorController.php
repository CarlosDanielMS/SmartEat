<?php

class AuthenticatorController extends Controller
{
  public function __construct()
  {
    parent::__construct();
  }

  public function login()
  { //action
    if (isset($_SESSION['authUser']) && !empty($_SESSION['authUser'])) {
      header("Location: " . BASE_URL . "planner/today");
    }
    $data  = array();

    $Helper = new Helper();
    $data['csrf_input'] = $Helper->csrf_input();

    //nome da view, data
    $this->loadTemplate("login", "users/authenticator/login", $data); //view e data
  }

  public function checkLogin()
  {
    $User = new User();
    $Helper = new Helper();

    if (!empty($_POST['email'])) {
      if (!$Helper->csrf_verify($_POST["csrf"])) {
        $Session['failed'] = "Erro ao enviar, favor use o formulário";
        header("location: " . BASE_URL . "register");
        exit;
      }

      $email = filter_input(INPUT_POST, 'email');
      $password = filter_input(INPUT_POST, 'password');
      $level = filter_input(INPUT_POST, 'level');


     

        if ($level == 2) {
          if ($User->checkLogin($email, $password)) {
            unset($_SESSION["failed"]);
          header("Location: " . BASE_URL . "planner/today");
          exit;
        } else {
          $_SESSION["failed"] = "Email ou senha incorretos, Tente Novamente";
          header("Location: " . BASE_URL . "login");
          exit;
        }} 
        
        
        elseif ($level == 5) {
          if ($User->checkLoginAdmin($email, $password)) {
            unset($_SESSION["failed"]);
          header("Location: " . BASE_URL . "admin");
          exit;
          } else {
            $_SESSION["failed"] = "Email ou senha incorretos, Tente Novamente";
            header("Location: " . BASE_URL . "admin/login");
            exit;
          }
        }

    }
  }


  public function register()
  {

    $data = array();
    $User = new User();
    $Helper = new Helper();
    $Session = new Session();
    $MainData = new MainData();
    $data['flash'] = $Helper->flash();

    $data['best_email'] = $Session->screen9->email; // Salvando o email da página anterior e repassando para o value do email da atual

    if (!isset($_SESSION['csrf_token'])) {

      $data['csrf_input'] = $Helper->csrf_input();
    } else {
      $data['csrf_input'] = "<input type='hidden' name='csrf' value='" . $_SESSION['csrf_token'] . "'/>";
    }


    if (!$Session->has("screen9")) {
      header("location: " . BASE_URL);
      exit;
    }

    if (!empty($_POST["first_name"])) {

      if (!empty($_POST["csrf"])) {

        if (!$Helper->csrf_verify($_POST["csrf"])) {

          $_SESSION['failed'] = "Erro ao enviar, favor use o formulário";
          header("location: " . BASE_URL . "register");
          exit;
        }
      }

      $first_name = filter_input(INPUT_POST, 'first_name');
      $last_name = filter_input(INPUT_POST, 'last_name');
      $user_email = filter_input(INPUT_POST, 'email');
      $options = array('cost' => 11);
      $password = password_hash(addslashes($_POST['password']), PASSWORD_DEFAULT, $options);
      $user_level = 2;

      //SELECIONANDO OS ALIMENTOS DA ROTINA - QUESTÃO 3

      foreach ($Session->screen3 as $key => $value) {
        if (!empty($value)) {
          $selected_foods[$key] = intval($value);
        }
      }

      //SELECIONANDO ALIMENTOS ALERGÊNICOS - QUESTÃO 4

      foreach ($Session->screen4 as $key => $value) {
        if (!empty($value)) {
          $selected_allergens[$key] = intval($value);
        }
      }

      $sex = intval($Session->screen6->sex);
      $height = intval($Session->screen6->height);
      $weight = floatval($Session->screen6->weight);
      $age = intval($Session->screen7->age);
      $physical_activity_level = floatval($Session->screen6->physical_activity_level);
      $target_weight = floatval($Session->screen7->target_weight);
      $model_diet = intval($Session->screen8);
      $number_meals = intval($Session->screen2);
      $whatsapp = $Helper->clean_mask($Session->screen9->whatsapp);
      $main_data_email = $Session->screen9->email;

      $amount_calories = $Helper->amountCalories($sex, $weight, $height, $age, $physical_activity_level);
      $amount_calories_deficit = $amount_calories - $amount_calories * 0.10;

      if ($User->add($first_name, $last_name, $user_email, $password, $user_level, $selected_foods, $selected_allergens, $sex, $height, $weight, $weight, $age, $physical_activity_level, $target_weight, $model_diet, $number_meals, $whatsapp, $main_data_email, $amount_calories_deficit)) {

        // email de confirmação
        $Mail = new Mail();

        $message = "
          <h3>Seja bem vindo(a), $first_name</h3>
          <br>
          <p>Queremos lhe informar que o seu cadastro foi bem sucedido, basta fazer o login na plataforma e usufruir de seus muitos benefícios!</p>
          <p>Ficamos muito felizes de termos você conosco, e queremos lhe parabenizar por tomar essa iniciativa de mudança em sua vida.</p>
          <p>Atenciosamente, Equipe SmartEat</p>
        ";
        $subject = "Cadastro - SmartEat";
        $full_name = $first_name . " " . $last_name;

        if ($Mail->sendMessage($user_email, $full_name, $subject, $message)) {
          $_SESSION['success'] = "Agradecemos o seu cadastro, logo você receberá um email de confirmação";
        }

        header("location: " . BASE_URL . "login");
        exit;
      } else {
        $_SESSION['failed'] = "Erro ao cadastrar usuário, pro favor entre em contato com o suporte técnico";
        header("location: " . BASE_URL . "register");
        exit;
      }
    }

    $this->loadTemplate("login", "users/authenticator/register", $data);
  }

  public function logout()
  {
    unset($_SESSION['authUser']);
    unset($_SESSION['authAdmin']);
    header("Location: " . BASE_URL);
  }


  public function loginAdmin()
  { //action

    $data  = array();
    $Helper = new Helper();
    $data['csrf_input'] = $Helper->csrf_input();

    //nome da view, data
    $this->loadTemplate("login", "admin/authenticator/login", $data); //view e data
  }

  public function fatSecret()
  {
    $data  = array();
    $FatSecret = new FatSecret();

    $data['access_token'] = $FatSecret->request();

    $data['result'] = $FatSecret->getFood($data['access_token'], 5921852);
    $data['result_query'] = $FatSecret->getAll($data['access_token'], "Arroz Branco");

    echo '<pre>';
    print_r($data['result']);
    exit;
  }
}
