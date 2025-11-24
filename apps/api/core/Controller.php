<?php
class Controller {

	protected $db;
	protected $lang;

	public function __construct() {
		global $config;

	
	}
	
	public function loadView($viewName, $viewData = array()) {
		extract($viewData);
		include 'views/'.$viewName.'.php';
	}

	public function loadTemplate($templateName, $viewName, $data = array()) {
    echo "Tentando carregar a view/template: $templateName | $viewName <br>";
    // resto do método
}


	public function loadViewInTemplate($viewName, $viewData) {
		extract($viewData);
		include 'views/'.$viewName.'.php';
	}

}