<?php

class Helper extends Model
{
    /**
     * ####################
     * ###   VALIDATE   ###
     * ####################
     */

    /**
     * @param string $email
     * @return bool
     */
    function is_email(string $email): bool
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL);
    }

    /**
     * @param string $password
     * @return bool
     */
    function is_passwd(string $password): bool
    {
        if (password_get_info($password)['algo'] || (mb_strlen($password) >= CONF_PASSWD_MIN_LEN && mb_strlen($password) <= CONF_PASSWD_MAX_LEN)) {
            return true;
        }

        return false;
    }

    /**
     * ##################
     * ###   STRING   ###
     * ##################
     */

    /**
     * @param string $string
     * @return string
     */
    function str_slug(string $string): string
    {
        $string = filter_var(mb_strtolower($string), FILTER_SANITIZE_STRIPPED);
        $formats = 'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜüÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûýýþÿRr"!@#$%&*()_-+={[}]/?;:.,\\\'<>°ºª';
        $replace = 'aaaaaaaceeeeiiiidnoooooouuuuuybsaaaaaaaceeeeiiiidnoooooouuuyybyRr                                 ';

        $slug = str_replace(
            ["-----", "----", "---", "--"],
            "-",
            str_replace(
                " ",
                "-",
                trim(strtr(utf8_decode($string), utf8_decode($formats), $replace))
            )
        );
        return $slug;
    }

    /**
     * @param string $string
     * @return string
     */
    function str_studly_case(string $string): string
    {
        $string = str_slug($string);
        $studlyCase = str_replace(
            " ",
            "",
            mb_convert_case(str_replace("-", " ", $string), MB_CASE_TITLE)
        );

        return $studlyCase;
    }

    /**
     * @param string $string
     * @return string
     */
    function str_camel_case(string $string): string
    {
        return lcfirst(str_studly_case($string));
    }

    /**
     * @param string $string
     * @return string
     */
    function str_title(string $string): string
    {
        return mb_convert_case(filter_var($string, FILTER_SANITIZE_SPECIAL_CHARS), MB_CASE_TITLE);
    }

    /**
     * @param string $text
     * @return string
     */
    function str_textarea(string $text): string
    {
        $text = filter_var($text, FILTER_SANITIZE_STRIPPED);
        $arrayReplace = ["&#10;", "&#10;&#10;", "&#10;&#10;&#10;", "&#10;&#10;&#10;&#10;", "&#10;&#10;&#10;&#10;&#10;"];
        return "<p>" . str_replace($arrayReplace, "</p><p>", $text) . "</p>";
    }

    /**
     * @param string $string
     * @param int $limit
     * @param string $pointer
     * @return string
     */
    function str_limit_words(string $string, int $limit, string $pointer = "..."): string
    {
        $string = trim(filter_var($string, FILTER_SANITIZE_SPECIAL_CHARS));
        $arrWords = explode(" ", $string);
        $numWords = count($arrWords);

        if ($numWords < $limit) {
            return $string;
        }

        $words = implode(" ", array_slice($arrWords, 0, $limit));
        return "{$words}{$pointer}";
    }

    /**
     * @param string $string
     * @param int $limit
     * @param string $pointer
     * @return string
     */
    function str_limit_chars(string $string, int $limit, string $pointer = "..."): string
    {
        $string = trim(filter_var($string, FILTER_SANITIZE_SPECIAL_CHARS));
        if (mb_strlen($string) <= $limit) {
            return $string;
        }

        $chars = mb_substr($string, 0, mb_strrpos(mb_substr($string, 0, $limit), " "));
        return "{$chars}{$pointer}";
    }

    /**
     * @param string $price
     * @return string
     */
    function str_price(?string $price): string
    {
        return number_format((!empty($price) ? $price : 0), 2, ",", ".");
    }

    /**
     * @param string|null $search
     * @return string
     */
    function str_search(?string $search): string
    {
        if (!$search) {
            return "all";
        }

        $search = preg_replace("/[^a-z0-9A-Z\@\ ]/", "", $search);
        return (!empty($search) ? $search : "all");
    }

    /**
     * @param string $data
     * @return string
     */
    function clean_mask(string $data): string
    {
        return preg_replace("/[^0-9]/", "", $data);
    }

    /**
     * ###############
     * ###   URL   ###
     * ###############
     */

    /**
     * @param string $path
     * @return string
     */
    function url(string $path = null): string
    {
        if ($_SERVER['HTTP_HOST'] == "localhost" || $_SERVER['HTTP_HOST'] == CONF_IP_HOST) {
            if ($path) {
                return CONF_URL_TEST . "/" . ($path[0] == "/" ? mb_substr($path, 1) : $path);
            }
            return CONF_URL_TEST;
        }

        if ($path) {
            return CONF_URL_BASE . "/" . ($path[0] == "/" ? mb_substr($path, 1) : $path);
        }

        return CONF_URL_BASE;
    }

    /**
     * @return string
     */
    function url_back(): string
    {
        return ($_SERVER['HTTP_REFERER'] ?? url());
    }

    /**
     * @param string $url
     */
    function redirect(string $url): void
    {
        header("HTTP/1.1 302 Redirect");
        if (filter_var($url, FILTER_VALIDATE_URL)) {
            header("Location: {$url}");
            exit;
        }

        if (filter_input(INPUT_GET, "route", FILTER_DEFAULT) != $url) {
            $location = url($url);
            header("Location: {$location}");
            exit;
        }
    }

    /**
     * ##################
     * ###   ASSETS   ###
     * ##################
     */

    /**
     * @return \Source\Models\User|null
     */
    function user(): ?\Source\Models\User
    {
        return \Source\Models\Auth::user();
    }

    /**
     * @return Session
     */
    function session(): Session
    {
        return new Session();
    }

    /**
     * @param string|null $path
     * @param string $theme
     * @return string
     */
    function theme(string $path = null, string $theme = CONF_VIEW_THEME): string
    {
        if ($_SERVER['HTTP_HOST'] == "localhost" || $_SERVER['HTTP_HOST'] == CONF_IP_HOST) {
            if ($path) {
                return CONF_URL_TEST . "/themes/{$theme}/" . ($path[0] == "/" ? mb_substr($path, 1) : $path);
            }

            return CONF_URL_TEST . "/themes/{$theme}";
        }

        if ($path) {
            return CONF_URL_BASE . "/themes/{$theme}/" . ($path[0] == "/" ? mb_substr($path, 1) : $path);
        }

        return CONF_URL_BASE . "/themes/{$theme}";
    }

    /**
     * @param string $image
     * @param int $width
     * @param int|null $height
     * @return string
     */
    function image(?string $image, int $width, int $height = null): ?string
    {
        if ($image) {
            return url() . "/" . (new \Source\Support\Thumb())->make($image, $width, $height);
        }

        return null;
    }

    /**
     * ################
     * ###   DATE   ###
     * ################
     */

    /**
     * @param string $dateEnd
     * @param string $dateStart
     * @return integer
     */
    function date_diff_system(string $dateEnd, string $dateStart = "now"): int
    {
        $date1 = new DateTime($dateStart);
        $date2 = new DateTime($dateEnd);
        $interval = $date1->diff($date2);
        $result = $interval->days;
        $flag = $interval->invert; // 1 se data passada, 0 se data futura
        if ($flag === 0) {
            //data futura
            return $result;
        } else {
            //data passada
            return -abs($result);
        }
    }

    /**
     * @param string $date
     * @param string $format
     * @return string
     * @throws Exception
     */

    function date_fmt(?string $date, string $format = "d/m/Y H\hi"): string
    {
        $date = (empty($date) ? "now" : $date);
        return (new DateTime($date))->format($format);
    }

    /**
     * @param string $date
     * @return string
     * @throws Exception
     */
    function date_fmt_br(?string $date): string
    {
        $date = (empty($date) ? "now" : $date);
        return (new DateTime($date))->format(CONF_DATE_BR);
    }

    /**
     * @param string $date
     * @return string
     * @throws Exception
     */
    function date_fmt_app(?string $date): string
    {
        $date = (empty($date) ? "now" : $date);
        return (new DateTime($date))->format(CONF_DATE_APP);
    }

    /**
     * @param string|null $date
     * @return string|null
     */
    function date_fmt_back(?string $date): ?string
    {
        if (!$date) {
            return null;
        }

        if (strpos($date, " ")) {
            $date = explode(" ", $date);
            return implode("-", array_reverse(explode("/", $date[0]))) . " " . $date[1];
        }

        return implode("-", array_reverse(explode("/", $date)));
    }

    /**
     * ####################
     * ###   PASSWORD   ###
     * ####################
     */

    /**
     * @param string $password
     * @return string
     */
    function passwd(string $password): string
    {
        if (!empty(password_get_info($password)['algo'])) {
            return $password;
        }

        return password_hash($password, CONF_PASSWD_ALGO, CONF_PASSWD_OPTION);
    }

    /**
     * @param string $password
     * @param string $hash
     * @return bool
     */
    function passwd_verify(string $password, string $hash): bool
    {
        return password_verify($password, $hash);
    }

    /**
     * @param string $hash
     * @return bool
     */
    function passwd_rehash(string $hash): bool
    {
        return password_needs_rehash($hash, CONF_PASSWD_ALGO, CONF_PASSWD_OPTION);
    }

    /**
     * ###################
     * ###   REQUEST   ###
     * ###################
     */

    /**
     * @return string
     */
    function csrf_input()
    {
        $_SESSION['csrf_token'] = md5(uniqid(rand(), true));
        return "<input type='hidden' name='csrf' value='" . $_SESSION['csrf_token'] . "'/>";
    }

    /**
     * @param $request
     * @return bool
     */
    function csrf_verify($request)
    {

        if (empty($_SESSION['csrf_token']) || empty($request) || $request != $_SESSION['csrf_token']) {
            return false;
        }
        return true;
    }

    /**
     * @return null|string
     */
    function flash(): ?string
    {
        $session = new Session();
        if ($flash = $session->flash()) {
            return $flash;
        }
        return null;
    }

    /**
     * @param string $key
     * @param int $limit
     * @param int $seconds
     * @return bool
     */
    function request_limit(string $key, int $limit = 5, int $seconds = 60): bool
    {
        $session = new Session();
        if ($session->has($key) && $session->$key->time >= time() && $session->$key->requests < $limit) {
            $session->set($key, [
                "time" => time() + $seconds,
                "requests" => $session->$key->requests + 1
            ]);
            return false;
        }

        if ($session->has($key) && $session->$key->time >= time() && $session->$key->requests >= $limit) {
            return true;
        }

        $session->set($key, [
            "time" => time() + $seconds,
            "requests" => 1
        ]);

        return false;
    }

    /**
     * @param string $field
     * @param string $value
     * @return bool
     */
    function request_repeat(string $field, string $value): bool
    {
        $session = new Session();
        if ($session->has($field) && $session->$field == $value) {
            return true;
        }

        $session->set($field, $value);
        return false;
    }

    /**
     * #################
     * ###   EMAIL   ###
     * #################
     */

    /**
     * @param string $templateName
     * @param array $data
     * @param string $subject
     * @param string $body
     * @param string $recipient
     * @param string $recipientName
     * @return boolean
     */
    function send_email(string $templateName, array $data, string $subject, string $recipient, string $recipientName): bool
    {
        $view = new View(__DIR__ . "/../../shared/views/email");
        $message = $view->render($templateName, $data);

        $email = new \Source\Support\Email();

        $email->bootstrap(
            $subject,
            $message,
            $recipient,
            $recipientName
        );

        if (!$email->send()) {
            return false;
        }

        return true;
    }

    /**
     * ###############
     * ### PROFILE ###
     * ###############
     */
    /**
     * @param int $level
     * @return string
     */
    function accessProfile(int $level)
    {
        $profile = null;
        switch ($level) {
            case 5:
                $profile = 'Administrador';
                break;
            case 2:
                $profile = 'Usuário';
                break;
            default:
                $profile = 'Não encontrado';
                break;
        }
        return $profile;
    }

    /**
     * ################
     * ### OMNIDIET ###
     * ################
     */
    /**
     * Amount Calories Per Day
     *
     * @param integer $sex
     * @param float $weight
     * @param integer $height
     * @param integer $age
     * @param float $physicalActivityLevel
     * @return float
     */
    function amountCalories($sex, $weight, $height, $age, $physicalActivityLevel)
    {

        $bmr = 0.00;
        if ($sex == 1) {
            $bmr = 10 * $weight + 6.25 * $height - 5 * $age + 5;
        } else {
            $bmr = 10 * $weight + 6.25 * $height - 5 * $age - 161;
        }
        return $bmr * $physicalActivityLevel;
    }
    /**
     * Model Diet
     *
     * @param integer $model
     * @param integer $calories
     * @param integer $numberMeals
     * @param array $foods
     * @return array
     */

    function modelDiet(int $model, float $calories, int $number_meals, array $foods)
    {
        $food_p = []; //proteina
        $food_c = []; //carboidrato
        $food_f = []; //gordura

        // divisão de alimentos por macronutriente principal
        if (count($foods) != 0) {
            for ($i = 0; $i < count($foods); $i++) {
                if ($foods[$i]['division_id'] == 1) {
                    $food_p[] = [
                        "id" => $foods[$i]['id'],
                        "name" => $foods[$i]['name'],
                        "photo" => $foods[$i]['photo'],
                        "proteins" => $foods[$i]['proteins'],
                        "portion_food" => $foods[$i]['portion_food'],
                        "type" => "P"
                    ];
                } elseif ($foods[$i]['division_id'] == 2) {
                    $food_c[] = [
                        "id" => $foods[$i]['id'],
                        "name" => $foods[$i]['name'],
                        "photo" => $foods[$i]['photo'],
                        "carbohydrates" => $foods[$i]['carbohydrates'],
                        "portion_food" => $foods[$i]['portion_food'],
                        "type" => "C"
                    ];
                } else {
                    $food_f[] = [
                        "id" => $foods[$i]['id'],
                        "name" => $foods[$i]['name'],
                        "photo" => $foods[$i]['photo'],
                        "fats" => $foods[$i]['fats'],
                        "portion_food" => $foods[$i]['portion_food'],
                        "type" => "F"
                    ];
                }
            }
        } else {
            return false;
        }

        // calorias distribuidas por refeição
        switch ($number_meals) {
            case 1: // Uma refeição
                $number_meals_arr = [1];
                break;
            case 2: // Duas refeições
                $number_meals_arr = [0.6, 0.4];
                break;
            case 3: // Três Refeições
                $number_meals_arr = [0.4, 0.35, 0.25];
                break;
            case 4: // Quatro Refeições
                $number_meals_arr = [0.25, 0.3, 0.3, 0.15];
                break;
            case 5: // Cinco Refeições
                $number_meals_arr = [0.25, 0.1, 0.15, 0.2, 0.3];
                break;
            default:
                return false;
        }

        // Tipo de Dieta e seus macronutrientes
        switch ($model) {
            case 1: // Dieta Low Carb
                $p_percentage = 0.4;
                $c_percentage = 0.2;
                $f_percentage = 0.4;
                break;
            case 2: // Dieta Equilibrada
                $p_percentage = 0.25;
                $c_percentage = 0.45;
                $f_percentage = 0.3;
                break;
            case 3: // Dieta Rica em Proteínas
                $p_percentage = 0.4;
                $c_percentage = 0.3;
                $f_percentage = 0.3;
                break;
            default:
                return false;
        }
        // Refeições
        $meals = [];

        for ($j = 0; $j < count($number_meals_arr); $j++) {
            // Valor aleatório para cada alimento principal.
            $p_rand = rand(0, count($food_p) - 1);
            $c_rand = rand(0, count($food_c) - 1);
            $f_rand = rand(0, count($food_f) - 1);
            
            $meals[$j]["foods"] = [];
            
            // Calorias da refeição atual
            $cals_per_meal = $calories * $number_meals_arr[$j];
            // Quantidade da Proteina na refeição
            $p = number_format($cals_per_meal * $p_percentage / 4, 2, ".",
                ""
            );
            // Quantidade da Carboidrato na refeição
            $c = number_format($cals_per_meal * $c_percentage / 4, 2, ".",
                ""
            );
            // Quantidade da Gordura na refeição
            $f = number_format($cals_per_meal * $f_percentage / 9, 2, ".",
                ""
            );

            if (count($food_p) > 0 && $food_p[$p_rand]["proteins"] > 0) {

                //calcula as gramas que o alimento deve ter
                $food_p[$p_rand]["portion"] = number_format(floatval($p) / floatval($food_p[$p_rand]["proteins"]) * floatval($food_p[$p_rand]["portion_food"]), 2, ".", "");
                //acrescenta a refeição o alimento
                $meals[$j]["foods"][] = $food_p[$p_rand];
            }

            if (count($food_c) > 0 && $food_c[$c_rand]["carbohydrates"] > 0
            ) {
                //calcula as gramas que o alimento deve ter
                $food_c[$c_rand]["portion"] = number_format(floatval($c) / floatval($food_c[$c_rand]["carbohydrates"]) * floatval($food_c[$c_rand]["portion_food"]), 2, ".", "");
                //acrescenta a refeição o alimento
                $meals[$j]["foods"][] = $food_c[$c_rand];
            }

            if (count($food_f) > 0 && $food_f[$f_rand]["fats"] > 0) {
                //calcula as gramas que o alimento deve ter
                $food_f[$f_rand]["portion"] = number_format(floatval($f) / floatval($food_f[$f_rand]["fats"]) * floatval($food_f[$f_rand]["portion_food"]), 2, ".", "");
                //acrescenta a refeição o alimento
                $meals[$j]["foods"][] = $food_f[$f_rand];
            }
        }

        return $meals;
    }

    /**
     * @param integer $weekDay
     * @return string|null
     */
    function getWeekDay(int $weekDay): ?string
    {
        $response = null;
        switch ($weekDay) {
            case 1:
                $response = 'Segunda-feira';
                break;
            case 2:
                $response = 'Terça-feira';
                break;
            case 3:
                $response = 'Quarta-feira';
                break;
            case 4:
                $response = 'Quinta-feira';
                break;
            case 5:
                $response = 'Sexta-feira';
                break;
            case 6:
                $response = 'Sábado';
                break;
            case 7:
                $response = 'Domingo';
                break;
        }
        return $response;
    }
}
