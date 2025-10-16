<?php

class Food extends Model
{
    /*
    * Altere o nome da classe
    * Altere o nome da tabela
    * Altere os campos de acordo com o seu BD
    * Remova esse comentário ao concluir 
    */
    public function add($file, $name, $classification_id, $allergen_id, $division_id, $portion, $calories)
    {

        $sql = "INSERT INTO foods (photo, name, classification_id, division_id, portion_food, calories) VALUES (:photo, :name, :classification_id, :division_id, :portion_food, :calories)";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(":photo", $file);
        $sql->bindValue(":name", $name);
        $sql->bindValue(":classification_id", $classification_id);
        $sql->bindValue(":division_id", $division_id);
        $sql->bindValue(":portion_food", $portion);
        $sql->bindValue(":calories", $calories);
        $sql->bindValue(":classification_id", $classification_id);
        $sql->execute();

        if ($sql->rowCount() > 0) {

            $food_id = $this->db->lastInsertId();
            foreach ($allergen_id as $alg_id) {
                $this->addFoodAllergen($food_id, $alg_id);
            }
            return $food_id;
        }
    }


    public function addFoodAllergen($food_id, $alg_id)
    {
        $sql = "INSERT INTO food_allergen (food_id, allergen_id) VALUES (:food_id, :allergen_id)";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(":food_id", $food_id);
        $sql->bindValue(":allergen_id", $alg_id);
        $sql->execute();
    }


    public function getAllergensByFood($id)
    {

        $data = array();
        $sql = "SELECT * FROM food_allergen
        WHERE food_id=:id";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(":id", $id);
        $sql->execute();

        if ($sql->rowCount() > 0) {
            $data = $sql->fetchAll(PDO::FETCH_ASSOC);
        }
        return $data;
    }

    public function update($file, $name, $classification_id, $allergen_id, $division_id, $portion, $calories, $id)
    {

        $sql = "UPDATE foods  SET photo = :photo, name = :name, classification_id = :classification_id, division_id = :division_id, portion_food = :portion_food, calories = :calories WHERE id = :id";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(':photo', $file);
        $sql->bindValue(':name', $name);
        $sql->bindValue(':classification_id', $classification_id);
        $sql->bindValue(':division_id', $division_id);
        $sql->bindValue(':portion_food', $portion);
        $sql->bindValue(':calories', $calories);
        $sql->bindValue(':id', $id);
        $sql->execute();

        if ($sql->rowCount() > 0) {
            $this->deleteAllergenByFood($id);
            foreach ($allergen_id as $alg_id) {
                $this->addFoodAllergen($id, $alg_id);
            }
            return true;
        }
    }

    public function get($user_id)
    {
        $data = array();
        $sql = "SELECT f.*, ma.*, mi.* 
        FROM foods AS f
        LEFT JOIN macronutrients AS ma ON (f.id = ma.reference_id)
        LEFT JOIN micronutrients AS mi ON (f.id = mi.reference_id)
        WHERE f.id = :id";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(":id", $user_id);
        $sql->execute();

        if ($sql->rowCount() > 0) {
            $data = $sql->fetch(PDO::FETCH_ASSOC);
        }
        return $data;
    }

    public function getAll($filters)
    {
        $data = array();
        $where = array(
            '1=1'
        );

        // if (!empty($filters['division_id'])) {
        //     $where[] = "foods.division_id = :division_id";
        // }


        if (!empty($filters['division_id'])) { // Filtro para múltiplas categorias (checkbox)
            $placeholders = array();
            foreach ($filters['division_id'] as $index => $division_id) {
                $placeholder = ":division_id" . $index;
                $placeholders[] = $placeholder;
                $params[$placeholder] = $division_id;  // Armazena cada valor de categoria
            }
            $where[] = "division_id IN (" . implode(', ', $placeholders) . ")";
        }

        if (!empty($filters['allergens'])) { // Filtro para múltiplas categorias (checkbox)
            $placeholders = array();
            foreach ($filters['allergens'] as $index => $allergens) {
                $placeholder = ":allergens" . $index;
                $placeholders[] = $placeholder;
                $params[$placeholder] = $allergens;  // Armazena cada valor de categoria
            }
            $where[] = "foods.id NOT IN (
                SELECT food_id
                FROM food_allergen
                WHERE allergen_id IN (" . implode(', ', $placeholders) . ")
            )";
        }

        $sql = "SELECT 
        foods.*,macronutrients.*, micronutrients.*,
        classifications.name AS classf_name,
        GROUP_CONCAT(DISTINCT allergens.name ORDER BY allergens.name SEPARATOR ', ') AS allerg_names
    FROM 
        foods
        LEFT JOIN macronutrients ON foods.id = macronutrients.reference_id
        LEFT JOIN micronutrients ON foods.id = micronutrients.reference_id
    LEFT JOIN 
        classifications
    ON 
        foods.classification_id = classifications.id
    LEFT JOIN 
        food_allergen
    ON 
        foods.id = food_allergen.food_id
    LEFT JOIN 
        allergens
    ON 
        food_allergen.allergen_id = allergens.id
    WHERE " . implode(' AND ', $where) . "
    GROUP BY 
        foods.id, classifications.name, macronutrients.id, micronutrients.id;";
        $sql = $this->db->prepare($sql);

        if (!empty($filters['division_id'])) { // Vincula valores de categorias múltiplas (checkbox)
            foreach ($params as $placeholder => $value) {
                $sql->bindValue($placeholder, $value);
            }
        }

        if (!empty($filters['allergens'])) { // Vincula valores de categorias múltiplas (checkbox)
            foreach ($params as $placeholder => $value) {
                $sql->bindValue($placeholder, $value);
            }
        }

        $sql->execute();

        if ($sql->rowCount() > 0) {
            $data = $sql->fetchAll(PDO::FETCH_ASSOC);
        }
        return $data;
    }

    public function getAllByDivisionId($division_id)
    {
        $data = array();
        $sql = "SELECT foods.*, macronutrients.*, micronutrients.*  FROM foods 
               LEFT JOIN macronutrients ON foods.id = macronutrients.reference_id
        LEFT JOIN micronutrients ON foods.id = micronutrients.reference_id
        WHERE division_id = :division_id";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(":division_id", $division_id);
        $sql->execute();

        if ($sql->rowCount() > 0) {
            $data = $sql->fetchAll(PDO::FETCH_ASSOC);
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
        FROM foods
        WHERE " . implode(' AND ', $where) . "";

        $sql = $this->db->prepare($sql);


        $sql->execute();
        $data = $sql->fetch();
        return $data['total'];
    }

    public function deleteAllergenByFood($id)
    {
        $sql = "DELETE FROM food_allergen WHERE food_id = :id";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(":id", $id);
        $sql->execute();

        if ($sql->rowCount() > 0) {
            return true;
        }
    }
}
