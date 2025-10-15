<?php

class Classification extends Model
{
    /*
    * Altere o nome da classe
    * Altere o nome da tabela
    * Altere os campos de acordo com o seu BD
    * Remova esse comentário ao concluir 
    */
    public function add($name)
    {
        $sql = "INSERT INTO classifications (name) VALUES (:name)";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(":name", $name);
        
        $sql->execute();

        if ($sql->rowCount() > 0) {
            return true;
        }
    }

    public function update($id, $name)
    {

        $sql = "UPDATE classifications SET name = :name WHERE id = :id";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(':name', $name);
        $sql->bindValue(':id', $id);
        $sql->execute();

        if ($sql->rowCount() > 0) {
            return true;
        }
    }

    public function get($id)
    {
        $data = array();
        $sql = "SELECT * FROM classifications WHERE id = :id";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(":id", $id);
        $sql->execute();

        if ($sql->rowCount() > 0) {
            $data = $sql->fetch(PDO::FETCH_ASSOC);
        }
        return $data;
    }
    public function getAll()
    {

        $data = array();

        $sql = "SELECT * FROM classifications";

        $sql = $this->db->prepare($sql);

        $sql->execute();

        if ($sql->rowCount() > 0) {
            $data = $sql->fetchAll(PDO::FETCH_ASSOC);
        }
        return $data;
    }
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
