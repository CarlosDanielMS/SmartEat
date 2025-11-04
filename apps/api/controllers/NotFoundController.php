<?php
class NotFoundController extends Controller
{

    public function __construct()
    {
        parent::__construct();
    }

    public function index()
    { //action/metodo

        $data  = array();
        

        $this->loadTemplate("home", "notFound", $data);
    }
}
