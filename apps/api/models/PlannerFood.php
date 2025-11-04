<?php


class PlannerFood extends Model
{
    /**
     * PlannerFood constructor.
     */
    public function __construct()
    {
        parent::__construct("planner_foods", ["id"], ["name", "portion_food", "type", "food_id", "meal_id", "user_id"]);
    }

    /**
     * @param integer $mealId
     * @param integer $userId
     * @return array|null
     */
    public function getAllToMeal($meal_id, $user_id)
    {

        $data = array();

        $sql = "SELECT planner_foods.*, foods.name, foods.photo,
         ((foods.calories/ foods.portion_food) * planner_foods.portion_food) AS total_calories_per_item
        FROM planner_foods 
        INNER JOIN foods ON planner_foods.food_id = foods.id
        WHERE meal_id=:meal_id AND user_id=:user_id";

        $sql = $this->db->prepare($sql);


        $sql->bindValue(":meal_id", $meal_id);
        $sql->bindValue(":user_id", $user_id);


        $sql->execute();

        if ($sql->rowCount() > 0) {
            $data = $sql->fetchAll(PDO::FETCH_ASSOC);
        }
        return $data;
    }

    public function getTotalCaloriesForMeal($meal_id, $user_id)
    {
        $sql = "SELECT SUM((foods.calories / foods.portion_food) * planner_foods.portion_food) AS total_calories
            FROM planner_foods 
            INNER JOIN foods ON planner_foods.food_id = foods.id
            WHERE meal_id = :meal_id AND user_id = :user_id";

        $sql = $this->db->prepare($sql);

        $sql->bindValue(":meal_id", $meal_id);
        $sql->bindValue(":user_id", $user_id);

        $sql->execute();
        return $sql->fetchColumn() ?: 0;
    }

    public function add($portion_food, $type, $food_id, $meal_id, $user_id)
    {
        $sql = "INSERT INTO planner_foods (portion_food, type, food_id, meal_id, user_id) VALUES (:portion_food, :type, :food_id, :meal_id, :user_id)";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(":portion_food", $portion_food);
        $sql->bindValue(":type", $type);
        $sql->bindValue(":food_id", $food_id);
        $sql->bindValue(":meal_id", $meal_id);
        $sql->bindValue(":user_id", $user_id);

        $sql->execute();

        if ($sql->rowCount() > 0) {
            $id_new_planner_food = $this->db->lastInsertId();
            return $id_new_planner_food;
        }
    }

    public function get($meal_id, $user_id)
    {
        $data = array();
        $sql = "SELECT * FROM planner_foods WHERE meal_id = :meal_id AND user_id=:user_id";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(":meal_id", $meal_id);
        $sql->bindValue(":user_id", $user_id);
        $sql->execute();

        if ($sql->rowCount() > 0) {
            $data = $sql->fetch(PDO::FETCH_ASSOC);
        }
        return $data;
    }

    public function getForFoodCheck($food_id)
    {

        $data = array();

        $sql = "SELECT *
        FROM planner_foods 
        WHERE food_id=:food_id";

        $sql = $this->db->prepare($sql);


        $sql->bindValue(":food_id", $food_id);



        $sql->execute();

        if ($sql->rowCount() > 0) {
            $data = $sql->fetch(PDO::FETCH_ASSOC);
        }
        return $data;
    }

    public function getAllToFoodId($food_id)
    {

        $data = array();

        $sql = "SELECT *
        FROM planner_foods 
        WHERE food_id=:food_id";

        $sql = $this->db->prepare($sql);


        $sql->bindValue(":food_id", $food_id);


        $sql->execute();

        if ($sql->rowCount() > 0) {
            $data = $sql->fetchAll(PDO::FETCH_ASSOC);
        }
        return $data;
    }

    public function delete($meals_id, $user_id)
    {
        $sql = "DELETE FROM planner_foods WHERE meals_id = :meals_id AND user_id=:user_id";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(":meals_id", $meals_id);
        $sql->bindValue(":user_id", $user_id);
        $sql->execute();

        if ($sql->rowCount() > 0) {
            return true;
        }
    }

    public function update($id, $planner_food_portion_food, $selected_food_id)
    {

        $sql = "UPDATE planner_foods SET portion_food=:portion_food, food_id=:food_id WHERE id = :id";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(':id', $id);
        $sql->bindValue(':portion_food', $planner_food_portion_food);
        $sql->bindValue(':food_id', $selected_food_id);
        $sql->execute();

        if ($sql->rowCount() > 0) {

            return true;
        }
    }

    public function getForSingleRefresh($id)
    {
        $data = array();
        $sql = "SELECT * FROM planner_foods WHERE id = :id";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(":id", $id);
        $sql->execute();

        if ($sql->rowCount() > 0) {
            $data = $sql->fetch(PDO::FETCH_ASSOC);
        }
        return $data;
    }

    public function updateCheckedFood($checked, $id)
    {
        $sql = "UPDATE planner_foods SET checked = :checked WHERE id = :id";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(':checked', $checked);
        $sql->bindValue(':id', $id);
        $sql->execute();
        if ($sql->rowCount() > 0) {
            return true;
        } else {
            return false;
        }
    }
}
