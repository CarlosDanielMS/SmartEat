<?php

class AdminController extends Controller
{
  public function __construct()
  {
    parent::__construct();
    if (!isset($_SESSION['authAdmin'])) {
      $_SESSION["failed"] = "Email ou senha incorretos, Tente Novamente";
      header("Location: " . BASE_URL . "login" );
      exit;
  }
  }  

  public function index()
  { //action

    $data  = array();
    $filters = array();
    $User=new User();
    $Food=new Food();

    $data['total_users']=$User->getTotal($filters);
    $data['total_foods']=$Food->getTotal($filters);
  

    //nome da view, data
    $this->loadTemplate("admin","admin/home", $data);//view e data
  }

  public function create()
  { //action

    $data  = array();
    $filters = array();
  

    //nome do template, nome da view, data
    $this->loadTemplate("admin","admin/users/add", $data);
  }

  



 

}
