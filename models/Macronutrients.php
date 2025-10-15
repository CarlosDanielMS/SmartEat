<?php

class Macronutrients extends Model
{
    public function add($proteins, $fats, $carbohydrates, $fibers, $sugar_level, $type_id, $id)
    {
        $sql = "INSERT INTO macronutrients (proteins, fats, carbohydrates, fibers, sugar_level, type_id, reference_id) VALUES (:proteins, :fats, :carbohydrates, :fibers, :sugar_level, :type_id, :reference_id)";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(":proteins", $proteins);
        $sql->bindValue(":fats", $fats);
        $sql->bindValue(":carbohydrates", $carbohydrates);
        $sql->bindValue(":fibers", $fibers);
        $sql->bindValue(":sugar_level", $sugar_level);
        $sql->bindValue(":type_id", $type_id);
        $sql->bindValue(":reference_id", $id);
        $sql->execute();

        if ($sql->rowCount() > 0) {
            return true;
        } else {
            return false;
        }
    }

    public function update($proteins, $fats, $carbohydrates, $fibers, $sugar_level, $id)
    {

        $sql = "UPDATE macronutrients SET proteins = :proteins, fats = :fats, carbohydrates = :carbohydrates, fibers = :fibers, sugar_level = :sugar_level WHERE reference_id = :reference_id";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(':proteins', $proteins);
        $sql->bindValue(':fats', $fats);
        $sql->bindValue(':carbohydrates', $carbohydrates);
        $sql->bindValue(':carbohydrates', $carbohydrates);
        $sql->bindValue(':fibers', $fibers);
        $sql->bindValue(':sugar_level', $sugar_level);
        $sql->bindValue(':reference_id', $id);
        $sql->execute();

        if ($sql->rowCount() > 0) {

            return true;
        } else {
            return false;
        }
    }
}
