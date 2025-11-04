<?php

class HomeController extends Controller
{
  public function __construct()
  {
    parent::__construct();
    
  }

  public function index()
  { //action

    $data  = array();
    $filters = array();
    $session = new Session();
        if ($session->has("quiz")) {
            $session->unset('quiz');
            $session->unset('screen1');
            $session->unset('screen2');
            $session->unset('screen3');
            $session->unset('screen4');
            $session->unset('screen5');
            $session->unset('screen6');
            $session->unset('screen7');
            $session->unset('screen8');
            $session->unset('screen9');
            $session->unset('screen10');
        }
        $session->set("quiz", true);
  

    //nome do template, nome da view, data
    $this->loadTemplate("home","home", $data);
  }

  public function login()
  { //action

    $data  = array();
    $filters = array();
  

    //nome da view, data
    $this->loadView("login", $data);//view e data
  }

  



 

}
