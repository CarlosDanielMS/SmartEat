<?php


class PlannerMeal extends Model
{
    /**
     * PlannerMeal constructor.
     */
    public function __construct()
    {
        parent::__construct();
    }


    public function getAll($day_id, $user_id)
    {

        $data = array();

        $sql = "SELECT *
        FROM planner_meals 
        WHERE day_id=:day_id AND user_id=:user_id ";

        $sql = $this->db->prepare($sql);

        $sql->bindValue(":day_id", $day_id);
        $sql->bindValue(":user_id", $user_id);

        $sql->execute();

        if ($sql->rowCount() > 0) {
            $data = $sql->fetchAll(PDO::FETCH_ASSOC);
        }
        return $data;
    }

    public function getMeal($id)
    {
        $data = array();
        $sql = "SELECT * FROM planner_meals WHERE id = :id";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(":id", $id);
        $sql->execute();

        if ($sql->rowCount() > 0) {
            $data = $sql->fetch(PDO::FETCH_ASSOC);
        }
        return $data;
    }

    public function add($meal, $day_id, $user_id)
    {
        $sql = "INSERT INTO planner_meals (meal, day_id, user_id) VALUES (:meal, :day_id, :user_id)";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(":meal", $meal);
        $sql->bindValue(":day_id", $day_id);
        $sql->bindValue(":user_id", $user_id);
        $sql->execute();

        if ($sql->rowCount() > 0) {
            $meal_id = $this->db->lastInsertId();
            return $meal_id;
        }
    }

    public function addToFoodRefresh($planner_day_id, $meals, $user_id)
    {
        $PlannerFood = new PlannerFood();
        for ($j = 0; $j < count($meals); $j++) {
            $meal = $j + 1;

            $sql = "INSERT INTO planner_meals (meal, day_id, user_id) VALUES (:meal, :day_id, :user_id)";
            $sql = $this->db->prepare($sql);
            $sql->bindValue(":meal", $meal);
            $sql->bindValue(":day_id", $planner_day_id);
            $sql->bindValue(":user_id", $user_id);

            $sql->execute();

            if ($sql->rowCount() > 0) {

                $meal_id = $this->db->lastInsertId();

                for ($k = 0; $k < count($meals[$j]["foods"]); $k++) {

                    $portion_food = $meals[$j]["foods"][$k]["portion"];
                    $type = $meals[$j]["foods"][$k]["type"];
                    $food_id = intval($meals[$j]["foods"][$k]["id"]);

                    $PlannerFood->add($portion_food, $type, $food_id, $meal_id, $user_id);
                }
            }
        }
        return true;
    }

    public function delete($planner_day_id, $user_id)
    {
        $sql = "DELETE FROM planner_meals WHERE day_id = :day_id AND user_id = :user_id";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(":day_id", $planner_day_id);
        $sql->bindValue(":user_id", $user_id);
        $sql->execute();

        if ($sql->rowCount() > 0) {
            return true;
        } else {
            return false;
        }
    }

    public function updatePlannerMeal($name, $id)
    {
        $sql = "UPDATE planner_meals SET name = :name WHERE id = :id AND user_id = :user";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(':name', $name);
        $sql->bindValue(':user', $_SESSION['authUser']);
        $sql->bindValue(':id', $id);
        $sql->execute();

        if ($sql->rowCount() > 0) {

            return true;
        } else {
            return false;
        }
    }
}
