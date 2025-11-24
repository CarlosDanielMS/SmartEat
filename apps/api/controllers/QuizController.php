<?php

use PharIo\Manifest\Url;

class QuizController extends Controller
{
    public function __construct()
    {
        parent::__construct();
    }

    /* Será a lista de dados*/
    public function index()
    {
        // { //action

        //   $data  = array();
        //   $filters = array();
        //   $Example = new Example();

        //   $limit = 18; //limite de items por página
        //   $data['currentPage'] = "1"; //atual pagina

        //   if (!empty($_GET['p'])) { //caso na url tenha o p, a página atual passa a ter o valor de p
        //     $data['currentPage'] = $_GET['p'];
        //   }

        //   $offset = ($data['currentPage'] * $limit) - $limit; //determina de onde a lista começa

        //   $data['totalItens'] = $Example->getTotal($filters);
        //   $data['numberOfPages'] = ceil($data['totalItens'] / $limit); //determina o numero de páginas
        //   $data['list_example'] = $Example->getAll($limit, $offset, $filters);

        //   if (isset($_GET) && !empty($_GET)) {
        //     unset($_GET['p']);
        //     $data['gets_active'] = http_build_query($_GET);
        //   }

        //   //nome do template, nome da view, data
        //   $this->loadTemplate("home","example/list", $data);
    }

    public function start() //action para a primeira pergunta por ser a única verificação feita sobre uma seção 'quiz'
    { //action


        $session = new Session();
        if (!$session->has("quiz")) {
            header("Location: " . BASE_URL);
        }
        // $head = $this->seo->render(
        //     CONF_SITE_NAME . " - " . CONF_SITE_TITLE,
        //     CONF_SITE_DESC,
        //     url(),
        //     theme("")
        // );

        //nome do template, nome da view, data
        $this->loadTemplate("home", "quiz/question-1");
    }

    public function step() // action para direcionar para action question ou info
    {

        if ($_GET['step'] == 'question') { // a view informa que é question

            $question_number = intval($_GET['val']); //informa qual a question

            $info_before_questions = [ //array que informa question e info que vem depois da respectiva question
                1 => 'info-1',
                2 => 'info-2',
                5 => 'info-3',
                6 => 'info-4',
                7 => 'info-5'
            ];

            if (array_key_exists($question_number, $info_before_questions)) { // verifica se a question tem 'info' em seguida

                foreach ($info_before_questions as $questions => $view) {
                    if ($question_number == $questions) { // se tem info em seguida chama a action info() que vai direcionar para a respectiva view
                        $this->infos($view);
                    }
                }
            } else { // se não tem info em seguida segue para a próxima question

                $question_number += 1;

                $this->questions('question-' . $question_number, $question_number);
            }
        } elseif ($_GET['step'] == 'info') { // a view informa que é info

            $info_number = intval($_GET['val']); //informa qual a info

            $questions_after_infos = [ //array que informa info e question que vem depois da respectiva info
                1 => 'question-2',
                2 => 'question-3',
                3 => 'question-6',
                4 => 'question-7',
                11 => 'question-8',
            ];

            if (array_key_exists($info_number, $questions_after_infos)) {

                foreach ($questions_after_infos as $infos => $view) { // se tem question em seguida chama a action question() que vai direcionar para a respectiva view
                    if ($info_number == $infos) {

                        $question_key_value = explode('-', $view); //pega o valor da questão ex: question-2 pega 2
                        $question_number = $question_key_value[1]; //pega o valor da questão ex: question-2 pega 2

                        $this->questions($view, $question_number);
                    }
                }
            } else {

                $info_number += 1; // se não tem question em seguida segue para a próxima info

                $this->infos('info-' . $info_number);
            }
        }
    }

    public function questions($view, $question_number)
    {

        $data = array();
        if ($question_number !== 1) { // caso seja a primeira questão não verifica uma questão anterior
            $Session = new Session();
            if (!$Session->has("screen" . intval($question_number) - 1)) { //verifica se a questão anterior foi respondida

                header("Location: " . BASE_URL); // se a questão anterior não foi respondida volta pra tela inicial
                exit;
            }
        }

        $Food = new Food();
        $Allergen = new Allergen();
        $filters  = array();
        $data['foods'] = $Food->getAll($filters);
        $data['allergens'] = $Allergen->getAll();

        $this->loadTemplate("home", "quiz/" . $view, $data);
    }

    public function infos($view)
    {
        $data = array();

        if ($view == 'info-11') { // se estiver na view info-11 é preciso variáveis para cáulo do gráfico da view
            $Session = new Session();
            $data['weight'] = $Session->screen7->weight;
            $data['targetWeight'] = $Session->screen7->target_weight;
        }

        $this->loadTemplate("home", "info_quiz/" . $view, $data);
    }

    //Processa o formulário do adicionar
    public function response()
    {

        $data = json_decode(file_get_contents("php://input"), true);

        if ($data) {
            $session = new Session();
            $data = filter_var_array($data, FILTER_SANITIZE_FULL_SPECIAL_CHARS);

            if (isset($data['screen']) && $data['screen'] <= 8) {

                for ($i = 1; $i <= 8; $i++) {
                    if ($data["screen"] == $i) {

                        if ($session->has("screen" . $i)) {
                            $session->set("screen" . $i, $data["response"]);
                        } else {
                            $session->set("screen" . $i, $data["response"]);
                        }

                        echo json_encode(["redirect" => BASE_URL . "quiz/step?step=question&val=" . $data['screen']]);
                        break;
                    }
                }
            } else { // se estiver na última pergunda redireciona para o registro

                if ($session->has("screen9")) {
                    $session->set("screen9", $data["response"]);
                } else {
                    $session->set("screen9", $data["response"]);
                }

                echo json_encode(["redirect" => BASE_URL . "register"]);
            }

            /* else {

                echo json_encode(["redirect" => BASE_URL . "quiz/questions?info=" . $data['screen']]);
            } */

            // switch ($data["screen"]) {
            //   case "1":
            //     if ($session->has("screen1")) {
            //       $session->set("screen1", $data["response"]);
            //     } else {
            //       $session->set("screen1", $data["response"]);
            //     }
            //     echo json_encode(["redirect" => BASE_URL . "quiz/question2"]);
            //     break;
            //   case "2":
            //     if ($session->has("screen2")) {
            //       $session->set("screen2", $data["response"]);
            //     } else {
            //       $session->set("screen2", $data["response"]);
            //     }
            //     echo json_encode(["redirect" => url("/info-2")]);
            //     break;
            //   case "3":
            //     if ($session->has("screen3")) {
            //       $session->set("screen3", $data["response"]);
            //     } else {
            //       $session->set("screen3", $data["response"]);
            //     }
            //     echo json_encode(["redirect" => url("/tela-4")]);
            //     break;
            //   case "4":
            //     if ($session->has("screen4")) {
            //       $session->set("screen4", $data["response"]);
            //     } else {
            //       $session->set("screen4", $data["response"]);
            //     }
            //     echo json_encode(["redirect" => url("/tela-5")]);
            //     break;
            //   case "5":
            //     if ($session->has("screen5")) {
            //       $session->set("screen5", $data["response"]);
            //     } else {
            //       $session->set("screen5", $data["response"]);
            //     }
            //     echo json_encode(["redirect" => url("/info-3")]);
            //     break;
            //   case "6":
            //     if ($session->has("screen6")) {
            //       $session->set("screen6", $data["response"]);
            //     } else {
            //       $session->set("screen6", $data["response"]);
            //     }
            //     echo json_encode(["redirect" => url("/info-4")]);
            //     break;
            //   case "7":
            //     if ($session->has("screen7")) {
            //       $session->set("screen7", $data["response"]);
            //     } else {
            //       $session->set("screen7", $data["response"]);
            //     }
            //     echo json_encode(["redirect" => url("/info-5")]);
            //     break;
            //   case "8":
            //     if ($session->has("screen8")) {
            //       $session->set("screen8", $data["response"]);
            //     } else {
            //       $session->set("screen8", $data["response"]);
            //     }
            //     echo json_encode(["redirect" => url("/tela-9")]);
            //     break;
            //   case "9":
            //     if ($session->has("screen9")) {
            //       $session->set("screen9", $data["response"]);
            //     } else {
            //       $session->set("screen9", $data["response"]);
            //     }
            //     echo json_encode(["redirect" => url("/app/register")]);
            //     break;
            // }
        }
    }
}
