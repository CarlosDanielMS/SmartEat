<?php

class Resources extends Model
{
    public function uploadFile($dir, $file, $type = "picture")
    {

        if (!file_exists($dir)) {
            mkdir($dir, 0777, true);
        }
        // Tamanho máximo do arquivo (em Bytes)
        $upload['size'] = 1024 * 1024 * 2; // 2Mb

        if ($type == "picture") {
            $upload['extension'] = array('jpg', 'png', 'gif', 'jpeg', 'webp', 'tiff', 'svg');
        } else {
            $upload['extension'] = array('pdf', 'drawio', 'png', 'svg', 'html', 'xml', 'doc', 'docx', 'jpg', 'xlsx');
        }
        // Array com as extensões permitidas

        // Renomeia o arquivo? (Se true, o arquivo será salvo como .jpg e um nome único)
        $upload['rename'] = false;

        // Array com os tipos de erros de upload do PHP
        $upload['errors'][0] = 'Não houve erro';
        $upload['errors'][1] = 'O arquivo no upload é maior do que o limite do PHP';
        $upload['errors'][2] = 'O arquivo ultrapassa o limite de tamanho especifiado no HTML';
        $upload['errors'][3] = 'O upload do arquivo foi feito parcialmente';
        $upload['errors'][4] = 'Não foi feito o upload do arquivo';

        // Verifica se houve algum erro com o upload. Se sim, exibe a mensagem do erro
        if ($file['error'] != 0) {
            setcookie("error", "Não foi possível fazer o upload, erro:<br />" . $upload['errors'][$file['error']], 3600);
            return "error";
        }

        // Caso script chegue a esse ponto, não houve erro com o upload e o PHP pode continuar

        // Faz a verificação da extensão do arquivo

        $tmp = explode('.', $file['name']); //captura a extesão do arquivo
        $extension = strtolower(end($tmp)); //coloca em minusculo
        if (array_search($extension, $upload['extension']) === false) {
            setcookie("error", "Por favor, envie arquivos com as seguintes extensões: 'jpg', 'png', 'gif', 'jpeg', 'webp', 'tiff'", 3600);
            return "error";
        }

        // Faz a verificação do tamanho do arquivo
        else if ($upload['size'] < $file['size']) {
            setcookie("error", "O arquivo enviado é muito grande, envie arquivos de até 2Mb.", 3600);
            return "error";
        }

        // O arquivo passou em todas as verificações, hora de tentar movê-lo para a pasta
        else {
            // Primeiro verifica se deve trocar o nome do arquivo
            if ($upload['rename'] == true) {
                // Cria um nome baseado no UNIX TIMESTAMP atual e com extensão .jpg
                $final_name = md5(time()) . "." . $extension;
            } else {
                // Mantém o nome original do arquivo
                $final_name = $file['name'];
            }

            // Depois verifica se é possível mover o arquivo para a pasta escolhida
            if (move_uploaded_file($file['tmp_name'], $dir . $final_name)) {
                return $dir . $final_name; //o caminho que a imagem foi salva
            } else {
                // Não foi possível fazer o upload, provavelmente a pasta está incorreta
                setcookie("error", "Não foi possível enviar o arquivo, tente novamente", 3600);
                return "error";
            }
        }
    }

    public function deleteDirectory($dir)
    {
        if (!file_exists($dir)) {
            return;
        }

        $files = glob($dir . '/*');

        foreach ($files as $file) {
            if (is_file($file)) {
                unlink($file);
            } elseif (is_dir($file)) {
                rmdir($file);
            }
        }

        rmdir($dir);
    }

    public function deleteFile($file)
    {
        if (file_exists($file)) {
            unlink($file);
            return "Arquivo $file removido com sucesso.";
        } else {
            return "Arquivo $file não existe.";
        }
    }

    public static function elapsedTime($time)
    { //tempo corrido

        $now = strtotime(date('m/d/Y H:i:s'));
        $time = strtotime($time);
        $diff = $now - $time;

        $seconds = $diff;
        $minutes = round($diff / 60);
        $hours = round($diff / 3600);
        $days = round($diff / 86400);
        $weeks = round($diff / 604800);
        $months = round($diff / 2419200);
        $years = round($diff / 29030400);

        if ($seconds <= 60) return "1 min atrás";
        else if ($minutes <= 60) return $minutes == 1 ? '1 min atrás' : $minutes . ' min atrás';
        else if ($hours <= 24) return $hours == 1 ? '1 hrs atrás' : $hours . ' hrs atrás';
        else if ($days <= 7) return $days == 1 ? '1 dia atras' : $days . ' dias atrás';
        else if ($weeks <= 4) return $weeks == 1 ? '1 semana atrás' : $weeks . ' semanas atrás';
        else if ($months <= 12) return $months == 1 ? '1 mês atrás' : $months . ' meses atrás';
        else return $years == 1 ? 'um ano atrás' : $years . ' anos atrás';
    }

    public function slugGenerator($string)
    { //gerador de slug(nickname)
        $string = preg_replace("/[áàâãä]/", "a", $string);
        $string = preg_replace("/[ÁÀÂÃÄ]/", "A", $string);
        $string = preg_replace("/[éèê]/", "e", $string);
        $string = preg_replace("/[ÉÈÊ]/", "E", $string);
        $string = preg_replace("/[íì]/", "i", $string);
        $string = preg_replace("/[ÍÌ]/", "I", $string);
        $string = preg_replace("/[óòôõö]/", "o", $string);
        $string = preg_replace("/[ÓÒÔÕÖ]/", "O", $string);
        $string = preg_replace("/[úùü]/", "u", $string);
        $string = preg_replace("/[ÚÙÜ]/", "U", $string);
        $string = preg_replace("/[çõ]/", "co", $string);
        $string = preg_replace("/ç/", "c", $string);
        $string = preg_replace("/Ç/", "C", $string);
        $string = preg_replace("/[][><}{)(:;,!?*%~^`@]/", "", $string);
        $string = preg_replace("/ /", "_", $string);
        $string = strtolower($string);
        return $string;
    }
}
