<?php

class FatSecret extends Model
{
    /*
    * Altere o nome da classe
    * Altere o nome da tabela
    * Altere os campos de acordo com o seu BD
    * Remova esse comentário ao concluir 
    */
    public function request()
    {

        $client_id = 'ff8d4f30a5744a51b5307f756bbf24f2';
        $client_secret = '2fb8897ae43a44ddae876bc21dec7125';
        $url = 'https://oauth.fatsecret.com/connect/token';

        $data = [
            'grant_type' => 'client_credentials',
            'scope' => 'basic'
        ];

        $headers = [
            'Authorization: Basic ' . base64_encode("$client_id:$client_secret"),
            'Content-Type: application/x-www-form-urlencoded'
        ];

        $ch = curl_init($url);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));

        $response = curl_exec($ch);

        if (curl_errno($ch)) {
            echo 'Error:' . curl_error($ch);
        } else {
            $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            if ($http_code == 200) {
                $response_data = json_decode($response, true);
                $access_token = $response_data['access_token'];
                return $access_token;
            } else {
                return "HTTP Status Code: " . $http_code . "\n" . $response;
            }
        }

        curl_close($ch);
    }

    public function getFood($access_token, $food_id) {
        $url = 'https://platform.fatsecret.com/rest/server.api';
    
        $data = [
            'method' => 'food.get.v4',
            'food_id' => $food_id,
            'format' => 'json'
        ];
    
        $headers = [
            'Authorization: Bearer ' . $access_token,
            'Content-Type: application/x-www-form-urlencoded'
        ];
    
        $ch = curl_init($url);
    
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    
        $response = curl_exec($ch);
    
        if (curl_errno($ch)) {
            echo 'Error:' . curl_error($ch);
        } else {
            $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            if ($http_code == 200) {
                $response_data = json_decode($response, true);
                return $response_data;
            } else {
                return "HTTP Status Code: " . $http_code . "\n" . $response;
            }
        }
    
        curl_close($ch);
    }

    public function getAll($access_token, $query) {
        $url = 'https://platform.fatsecret.com/rest/server.api';

        $data = [
            'method' => 'foods.search',
            'search_expression' => $query,
            'format' => 'json'
        ];
    
        $headers = [
            'Authorization: Bearer ' . $access_token,
            'Content-Type: application/x-www-form-urlencoded'
        ];
    
        $ch = curl_init($url);
    
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    
        $response = curl_exec($ch);
    
        if (curl_errno($ch)) {
            echo 'Error:' . curl_error($ch);
        } else {
            $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            if ($http_code == 200) {
                $response_data = json_decode($response, true);
                return $response_data;
            } else {
                return "HTTP Status Code: " . $http_code . "\n" . $response;
            }
        }
    
        curl_close($ch);
    }
    
   
    

    
    
}
