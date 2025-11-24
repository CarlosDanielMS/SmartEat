<?php


class PlannerDay extends Model
{
    /**
     * PlannerDay constructor.
     */
    public function __construct()
    {
        parent::__construct();
    }

    // /**
    //  * @param integer $userId
    //  * @return PlannerDay|null
    //  */
    public function weekDay($day, $user_id)
    {
        $data = array();
        $sql = "SELECT * FROM planner_days WHERE day=:day AND user_id = :user_id";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(":day", $day);
        $sql->bindValue(":user_id", $user_id);
        $sql->execute();

        if ($sql->rowCount() > 0) {
            $data = $sql->fetch(PDO::FETCH_ASSOC);
        }
        return $data;
    }

    // /**
    //  * @param integer $dayId
    //  * @param integer $userId
    //  * @return boolean|null
    //  */
    // public function deleteMealsAndFoods(int $dayId, int $userId): ?bool
    // {
    //     $meals = (new PlannerMeal())->meals($dayId, $userId);
    //     for ($i = 0; $i < count($meals); $i++) {
    //         $mealsFoods = (new PlannerFood())->mealFoods($meals[$i]->id, $userId);
    //         for ($j = 0; $j < count($mealsFoods); $j++) {
    //             $mealsFoods[$j]->destroy();
    //         }
    //         $meals[$i]->destroy();
    //     }

    //     return true;
    // }


    public function add($day, $user_id, $meals)
    {
        $sql = "INSERT INTO planner_days (day, user_id) VALUES (:day, :user_id)";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(":day", $day);
        $sql->bindValue(":user_id", $user_id);
        $sql->execute();

        if ($sql->rowCount() > 0) {
            $day_id = $this->db->lastInsertId();

            for ($j = 0; $j < count($meals); $j++) {

                $meal = $j + 1;
                $PlannerMeal = new PlannerMeal();
                $meal_id = $PlannerMeal->add($meal, $day_id, $user_id);
                for ($k = 0; $k < count($meals[$j]["foods"]); $k++) {                
                    $portion_food = $meals[$j]["foods"][$k]["portion"];
                    $type = $meals[$j]["foods"][$k]["type"];
                    $food_id = intval($meals[$j]["foods"][$k]["id"]);

                    $PlannerFood = new PlannerFood();
                    $PlannerFood->add($portion_food, $type, $food_id, $meal_id, $user_id);
                }
            }

            return true;
        }
    }

    public function getAll($user_id)
    {
        $data = array();
        $sql = "SELECT * FROM planner_days WHERE user_id = :user_id";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(":user_id", $user_id);
        $sql->execute();

        if ($sql->rowCount() > 0) {
            $data = $sql->fetchAll(PDO::FETCH_ASSOC);
        }
        return $data;
    }

    public function delete($planner_day_id, $user_id)
    {


        // $PlannerMeal = new PlannerMeal();
        // $meals = $PlannerMeal->getAll($planner_day_id, $user_id);
        // for ($i = 0; $i < count($meals); $i++) {
        //     $PlannerFood = new PlannerFood();
        //     $meals_foods = $PlannerFood->getAllToMeal($meals[$i]['id'], $user_id);
        //     for ($j = 0; $j < count($meals_foods); $j++) {
        //         $meals_foods[$j]->delete($meals[$i]['id'], $user_id);
        //     }
        //     $meals[$i]->delete($planner_day_id, $user_id);
        // }

        // return true;
    }
}
