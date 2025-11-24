<?php

class DashController extends Controller
{
    /**
     * DashController constructor.
     */
    public function __construct()
    {
        parent::__construct();
        if (!isset($_SESSION['authAdmin'])) {
            header("Location: " . BASE_URL . "admin/login" );
            exit;
        }
    }

    // public function home()
    // {

    //     $data = array();
    //     $User = New User();
    //     // $id=$_SESSION['authUser'];
    //     $id = $_SESSION['authUser'];

    //     $data['info_user'] = $User->get($id);
    //     $data['full_name'] = $data['info_user']['first_name'] . " " . $data['info_user']['last_name'];
    //     $data['photo'] = $data['info_user']['photo'];
      
        
    //     // $head = $this->seo->render(
    //     //     CONF_SITE_NAME . " | Dashboard",
    //     //     CONF_SITE_DESC,
    //     //     url("/app"),
    //     //     theme("/assets/images/image.jpg", CONF_VIEW_ADMIN),
    //     //     false
    //     // );

    //     $this->loadTemplate("user", "users/home", $data);
    // }

    /**
     *
     */
    // public function logoff(): void
    // {
    //     $this->message->success("Você saiu com sucesso {$this->user->first_name}.")->flash();

    //     Auth::logout();
    //     redirect("/app/login");
    // }
}