<?php 
	global  $routes;

	$routes = array();

	//Exemplo
	/*
	* 1º parte: o que o usuário vai digitar no navegador
	*2º parte: pelo que será substituído no controller 
	*/
	$routes['/contact_view/{slug}'] = "/controller/action/:paramentro";
	
	$routes['/']="/Home"; /* questão 1 */
	$routes['/quiz/start']="/Quiz/start"; /* questão 1 */
	$routes['/quiz/step']="/Quiz/step";/* direciona para question ou info */
	$routes['/quiz/questions']="/Quiz/questions";/* Perguntas */
	$routes['/quiz/info']="/Quiz/info";/* Informaçõs */
	$routes['/quiz/response']="/Quiz/response"; /* salva dados */

	$routes['/register']="/Authenticator/register";
	$routes['/login']="/Authenticator/login";
	$routes['/checklogin']="/Authenticator/checkLogin";
	$routes['/logout']="/Authenticator/logout";

	$routes['/dash']="/Dash/home";

	$routes['/weight-goal']="/WeightGoal/home";
	$routes['/weight-goal/ajax-update']="/WeightGoal/ajaxUpdate";


	$routes['/planner/today']="/Planner/today";
	$routes['/planner/week']="/Planner/week";
	$routes['/planner/refresh-food']="/Planner/foodRefresh";
	$routes['/planner/single-refresh-food']="/Planner/singleFoodRefresh";
	$routes['/planner/single-refresh-food-ajax']="/Planner/singleFoodRefreshAjax";

	$routes['/admin']="/Admin";
	$routes['/admin/logoff']="/Authenticator/logout";
	$routes['/admin/users']="/User";
	$routes['/admin/users/create']="/User/create";
	$routes['/admin/users/store']="/User/store";
	$routes['/admin/users/edit/{id}']="/User/edit/:id";
	$routes['/admin/users/update/{id}']="/User/update/:id";
	$routes['/admin/users/delete/{id}']="/User/destroy/:id";
	$routes['/admin/allergens']="/Allergen";
	$routes['/admin/allergens/create']="/Allergen/create";
	$routes['/admin/allergens/store']="/Allergen/store";
	$routes['/admin/allergens/edit/{id}']="/Allergen/edit/:id";
	$routes['/admin/allergens/update/{id}']="/Allergen/update/:id";
	$routes['/admin/classifications']="/Classification";
	$routes['/admin/classifications/create']="/Classification/create";
	$routes['/admin/classifications/store']="/Classification/store";
	$routes['/admin/classifications/edit/{id}']="/Classification/edit/:id";
	$routes['/admin/classifications/update/{id}']="/Classification/update/:id";
	$routes['/admin/foods']="/Food";
	$routes['/admin/foods/create']="/Food/create";
	$routes['/admin/foods/store']="/Food/store";
	$routes['/admin/foods/edit/{id}']="/Food/edit/:id";
	$routes['/admin/foods/update/{id}']="/Food/update/:id";






	






	