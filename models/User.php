<?php

class User extends Model
{
    public function add($first_name, $last_name, $user_email, $password, $user_level, $selected_foods, $selected_allergens, $sex, $height, $initial_weight, $weight, $age, $physical_activity_level, $target_weight, $model_diet, $number_meals, $whatsapp, $main_data_email, $amount_calories_deficit)
    {

        $sql = "INSERT INTO users (first_name, last_name, email, password, level) VALUES (:first_name, :last_name, :email, :password, :level)";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(":first_name", $first_name);
        $sql->bindValue(":last_name", $last_name);
        $sql->bindValue(":email", $user_email);
        $sql->bindValue(":password", $password);
        $sql->bindValue(":level", $user_level);
        $sql->execute();

        if ($sql->rowCount() > 0) {
            $user_id = $this->db->lastInsertId(); //pega a última ID inserida e vamos armazenar em outra tabela como chave estrangeira
            $MainData = new MainData();
            $SelectedFood = new SelectedFood();
            $SelectedAllergen = new SelectedAllergen();

            $MainData->add($user_id, $sex, $height, $initial_weight, $weight, $age, $physical_activity_level, $target_weight, $model_diet, $number_meals, $whatsapp, $main_data_email, $amount_calories_deficit);

            foreach ($selected_foods as $food_id) {
                $SelectedFood->add($user_id, $food_id);
            }

            foreach ($selected_allergens as $allergen_id) {
                $SelectedAllergen->add($user_id, $allergen_id);
            }
            return true;
        }
    }

    public function checkLogin($email, $password)
    {

        $sql = "SELECT password, id FROM users WHERE email = :email"; //remova os campos não usados como login
        $sql = $this->db->prepare($sql);
        $sql->bindValue(":email", $email);
        $sql->execute();

        if ($sql->rowCount() > 0) {
            $data = $sql->fetch(PDO::FETCH_ASSOC);

            if (password_verify($password, $data['password'])) {
                $_SESSION['authUser'] = $data['id'];
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public function checkLoginAdmin($email, $password)
    {

        $sql = "SELECT password, id FROM users WHERE email = :email AND level = 5"; //remova os campos não usados como login
        $sql = $this->db->prepare($sql);
        $sql->bindValue(":email", $email);
        $sql->execute();

        if ($sql->rowCount() > 0) {
            $data = $sql->fetch(PDO::FETCH_ASSOC);

            if (password_verify($password, $data['password'])) {
                $_SESSION['authAdmin'] = $data['id'];
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public function get($id)
    {
        $data = array();
        $sql = "SELECT * FROM users WHERE id = :id";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(":id", $id);
        $sql->execute();

        if ($sql->rowCount() > 0) {
            $data = $sql->fetch(PDO::FETCH_ASSOC);
        }
        return $data;
    }

    public function getTotal($filters)
    {
        $data = array();
        $where = array(
            '1=1'
        );


        $sql = "SELECT 
        COUNT(*) as total 
        FROM users
        WHERE " . implode(' AND ', $where) . "";

        $sql = $this->db->prepare($sql);


        $sql->execute();
        $data = $sql->fetch();
        return $data['total'];
    }


    public function getAll($filters)
    {

        $data = array();
        $where = array(
            '1=1'
        );

        $sql = "SELECT users.*
        FROM users
        WHERE " . implode(' AND ', $where) . "";
        $sql = $this->db->prepare($sql);


        $sql->execute();

        if ($sql->rowCount() > 0) {
            $data = $sql->fetchAll(PDO::FETCH_ASSOC);
        }
        return $data;
    }

    public function delete($id)
    {
        $sql = "DELETE FROM users WHERE id = :id";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(":id", $id);
        $sql->execute();

        if ($sql->rowCount() > 0) {
            return true;
        }
    }

    public function checkEmail($email)
    {
        $sql = "SELECT email FROM users WHERE email = :email";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(":email", $email);
        $sql->execute();

        if ($sql->rowCount() > 0) {
            // Código está em uso
            return true;
        } else {
            // Código não está em uso
            return false;
        }
    }
}
