<?php
	class Model {
		
		protected $db;
		protected $config;

		public function __construct() {
			global $db;
			global $config;
			$this->db = $db;
			$this->config = $config;
		}

	}
?>

