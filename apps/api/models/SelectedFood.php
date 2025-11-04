<?php

class SelectedFood extends Model
{
    /*
    * Altere o nome da classe
    * Altere o nome da tabela
    * Altere os campos de acordo com o seu BD
    * Remova esse comentário ao concluir 
    */
    public function add($user_id, $food_id)
    {
        $sql = "INSERT INTO selected_foods (user_id, food_id) VALUES (:user_id, :food_id)";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(":user_id", $user_id);
        $sql->bindValue(":food_id", $food_id);
        
        $sql->execute();

        if ($sql->rowCount() > 0) {
            return true;
        }
    }

    public function update($campo1, $campo2, $campo3, $id)
    {

        $sql = "UPDATE name_table SET campo1 = :campo1, campo2 = :campo2, campo3 = :campo3 WHERE id = :id";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(':campo1', $campo1);
        $sql->bindValue(':campo2', $campo2);
        $sql->bindValue(':campo3', $campo3);
        $sql->bindValue(':id', $id);
        $sql->execute();

        if ($sql->rowCount() > 0) {

            return true;
        } else {
            return false;
        }
    }

    public function getAllForUser($user_id)
    {
        $data = array();
        $sql = "SELECT * FROM selected_foods WHERE user_id = :user_id";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(":user_id", $user_id);
        $sql->execute();

        if ($sql->rowCount() > 0) {
            $data = $sql->fetchAll(PDO::FETCH_ASSOC);
        }
        return $data;
    }
    
    public function getAll($limit, $offset, $filters)
    {

        $data = array();
        $where = array(
            '1=1'
        );


        if (!empty($filters['category'])) {
            $where[] = "category_id = :category_id";
        }

        if (!empty($filters['order'])) {
            $order = $filters['order'];
        } else {
            $order = "name_table.id";
        }

        $sql = "SELECT *
        FROM name_table 
        WHERE " . implode(' AND ', $where) . "
        ORDER BY " . $order . "
        LIMIT " . $offset . "," . $limit;

        $sql = $this->db->prepare($sql);

        if (!empty($filters['category'])) {
            $sql->bindValue(":category_id", $filters['category']);
        }

        $sql->execute();

        $price = array();
        if ($sql->rowCount() > 0) {
            $data = $sql->fetchAll(PDO::FETCH_ASSOC);
        }
        return $data;
    }
    public function getTotal($filters)
    {
        $array = array();

        $where = array(
            '1=1'
        );


        if (!empty($filters['category'])) { //repito esse processo para todos os filtros
            $where[] = "category_id = :category_id";
        }      

        $sql = "SELECT 
        COUNT(*) as total 
        FROM name_table
        WHERE " . implode(' AND ', $where) . "";

        $sql = $this->db->prepare($sql);

        if (!empty($filters['category'])) {
            $sql->bindValue(":category_id", $filters['category']);
        }     


        $sql->execute();
        $array = $sql->fetch();
        return $array['total'];
    }   

    public function delete($id)
    {
        $sql = "DELETE FROM name_table WHERE id = :id";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(":id", $id);
        $sql->execute();

        if ($sql->rowCount() > 0) {
            return true;
        } else {
            return false;
        }
        //fim apagando anúncio
    }

    
}
