<?php

class MainData extends Model
{
    /*
    * Altere o nome da classe
    * Altere o nome da tabela
    * Altere os campos de acordo com o seu BD
    * Remova esse comentário ao concluir 
    */
    public function add($user_id, $sex, $height, $initial_weight, $weight, $age, $physical_activity_level, $target_weight, $model_diet, $number_meals, $whatsapp, $main_data_email, $amount_calories_deficit)
    {
        $sql = "INSERT INTO main_data(user_id, sex, height, initial_weight, weight, age, physical_activity_level, target_weight, model_diet, number_meals, whatsapp, email, amount_calories_deficit) VALUES (:user_id, :sex, :height, :initial_weight, :weight, :age, :physical_activity_level, :target_weight, :model_diet, :number_meals, :whatsapp, :email, :amount_calories_deficit)";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(":user_id", $user_id);
        $sql->bindValue(":sex", $sex);
        $sql->bindValue(":height", $height);
        $sql->bindValue(":initial_weight", $initial_weight);
        $sql->bindValue(":weight", $weight);
        $sql->bindValue(":age", $age);
        $sql->bindValue(":physical_activity_level", $physical_activity_level);
        $sql->bindValue(":target_weight", $target_weight);
        $sql->bindValue(":model_diet", $model_diet);
        $sql->bindValue(":number_meals", $number_meals);
        $sql->bindValue(":whatsapp", $whatsapp);
        $sql->bindValue(":email", $main_data_email);
        $sql->bindValue(":amount_calories_deficit", $amount_calories_deficit);

        $sql->execute();

        if ($sql->rowCount() > 0) {
            return true;
        }
    }

    public function updateWeight($user_id, $weight, $amount_calories_deficit)
    {

        $sql = "UPDATE main_data SET weight = :weight, amount_calories_deficit = :amount_calories_deficit WHERE user_id = :user_id";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(':weight', $weight);
        $sql->bindValue(':amount_calories_deficit', $amount_calories_deficit);
        $sql->bindValue(':user_id', $user_id);

        $sql->execute();
        if ($sql->rowCount() > 0) {

            return true;
        } else {
            return false;
        }
    }

    public function updateTargetWeight($user_id, $target_weight)
    {

        $sql = "UPDATE main_data SET target_weight = :target_weight WHERE user_id = :user_id";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(':target_weight', $target_weight);
        $sql->bindValue(':user_id', $user_id);

        $sql->execute();

        if ($sql->rowCount() > 0) {
            return true;
        } else {
            return false;
        }
    }

    public function get($user_id)
    {
        $data = array();
        $sql = "SELECT * FROM main_data WHERE user_id = :user_id";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(":user_id", $user_id);
        $sql->execute();

        if ($sql->rowCount() > 0) {
            $data = $sql->fetch(PDO::FETCH_ASSOC);
        }
        return $data;
    }

    // public function getAll($limit, $offset, $filters)
    // {

    //     $data = array();
    //     $where = array(
    //         '1=1'
    //     );


    //     if (!empty($filters['category'])) {
    //         $where[] = "category_id = :category_id";
    //     }

    //     if (!empty($filters['order'])) {
    //         $order = $filters['order'];
    //     } else {
    //         $order = "name_table.id";
    //     }

    //     $sql = "SELECT *
    //     FROM name_table 
    //     WHERE " . implode(' AND ', $where) . "
    //     ORDER BY " . $order . "
    //     LIMIT " . $offset . "," . $limit;

    //     $sql = $this->db->prepare($sql);

    //     if (!empty($filters['category'])) {
    //         $sql->bindValue(":category_id", $filters['category']);
    //     }

    //     $sql->execute();

    //     $price = array();
    //     if ($sql->rowCount() > 0) {
    //         $data = $sql->fetchAll(PDO::FETCH_ASSOC);
    //     }
    //     return $data;
    // }

    // public function getTotal($filters)
    // {
    //     $array = array();

    //     $where = array(
    //         '1=1'
    //     );


    //     if (!empty($filters['category'])) { //repito esse processo para todos os filtros
    //         $where[] = "category_id = :category_id";
    //     }

    //     $sql = "SELECT 
    //     COUNT(*) as total 
    //     FROM name_table
    //     WHERE " . implode(' AND ', $where) . "";

    //     $sql = $this->db->prepare($sql);

    //     if (!empty($filters['category'])) {
    //         $sql->bindValue(":category_id", $filters['category']);
    //     }


    //     $sql->execute();
    //     $array = $sql->fetch();
    //     return $array['total'];
    // }

    // public function delete($id)
    // {
    //     $sql = "DELETE FROM name_table WHERE id = :id";
    //     $sql = $this->db->prepare($sql);
    //     $sql->bindValue(":id", $id);
    //     $sql->execute();

    //     if ($sql->rowCount() > 0) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    //     //fim apagando anúncio
    // }
}
