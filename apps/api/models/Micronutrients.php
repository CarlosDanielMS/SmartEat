<?php

class Micronutrients extends Model
{
    public function add($cholestreol, $calcium, $magnesium, $phosphorus, $iron, $sodium, $potassium, $type_id, $id)
    {
        $sql = "INSERT INTO micronutrients 
        (cholestreol, calcium, magnesium, phosphorus, iron, sodium, potassium, type_id, reference_id) 
        VALUES 
        (:cholestreol, :calcium, :magnesium, :phosphorus, :iron, :sodium, :potassium, :type_id, :reference_id)";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(":cholestreol", $cholestreol);
        $sql->bindValue(":calcium", $calcium);
        $sql->bindValue(":magnesium", $magnesium);
        $sql->bindValue(":phosphorus", $phosphorus);
        $sql->bindValue(":iron", $iron);
        $sql->bindValue(":sodium", $sodium);
        $sql->bindValue(":potassium", $potassium);
        $sql->bindValue(":type_id", $type_id);
        $sql->bindValue(":reference_id", $id);
        $sql->execute();

        if ($sql->rowCount() > 0) {
            return true;
        } else {
            return false;
        }
    }

    public function update($cholestreol, $calcium, $magnesium, $phosphorus, $iron, $sodium, $potassium, $id)
    {

        $sql = "UPDATE micronutrients 
        SET 
        cholestreol = :cholestreol, 
        calcium = :calcium, 
        magnesium = :magnesium,
        phosphorus = :phosphorus,
        iron = :iron, 
        sodium = :sodium, 
        potassium = :potassium
             
        WHERE reference_id = :reference_id";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(":cholestreol", $cholestreol);
        $sql->bindValue(":calcium", $calcium);
        $sql->bindValue(":magnesium", $magnesium);
        $sql->bindValue(":phosphorus", $phosphorus);
        $sql->bindValue(":iron", $iron);
        $sql->bindValue(":sodium", $sodium);
        $sql->bindValue(":potassium", $potassium);
        $sql->bindValue(':reference_id', $id);
        $sql->execute();

        if ($sql->rowCount() > 0) {

            return true;
        } else {
            return false;
        }
    }
}
