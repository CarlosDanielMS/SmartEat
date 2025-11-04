<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class Mail extends Model
{

    public function receiveMessage($subject, $message)//recebendo e-mail (Ex: Página Contato)
    {
        $mail = new PHPMailer(true);
        try {
            //Configurações do servidor
            $mail->isSMTP();
            $mail->Host       = $this->config['hostmail']; //Servidor SMTP
            $mail->SMTPAuth   = true; //SMTP autenticação
            $mail->Username   = $this->config['usermail'];//email de quem está enviando
            $mail->Password   = $this->config['password']; //senha do email
            $mail->SMTPSecure = 'ssl';
            $mail->Port       = $this->config['port']; //Caso o SMTPSecure seja 'PHPMailer::ENCRYPTION_STARTTLS' use 587

            //Destinatário
            $mail->setFrom($this->config['usermail'], $this->config['username']); //Quem está enviando
            $mail->addAddress($this->config['usermail'], $this->config['username']); //Quem recebe
            
            //Conteudo do email
            $mail->isHTML(true); //Se o email será em formato html
            $mail->Subject = $subject;
            $mail->Body    = $message; //A mensagem do body pode ser feita com tags html <b>in bold!</b>
            // $mail->AltBody = 'A mensagem não possui estilização em html, mas as chances do email não se tornar um spam são maiores';
            $mail->CharSet = 'UTF-8';

            $mail->send();
            return true;
        } catch (Exception $e) {
            echo "Entre em contato com o suporte ou tente novamente. (ERROR: SEND MAIL) <br>";
	        echo "<a href='" . BASE_URL . "'>Início</a>";
            error_log("Error " . $e->getMessage(), 3, "error_mail.log");
            return false;
        }
    }

    public function sendMessage($email, $name, $subject, $message)
    {
        $mail = new PHPMailer(true);
        try {
            //Configurações do servidor
            $mail->isSMTP();
            $mail->Host       = $this->config['hostmail']; //Servidor SMTP
            $mail->SMTPAuth   = true; //SMTP autenticação
            $mail->Username   = $this->config['usermail'];//email de quem está enviando
            $mail->Password   = $this->config['password']; //senha do email
            $mail->SMTPSecure = 'ssl';
            $mail->Port       = $this->config['port']; //Caso o SMTPSecure seja 'PHPMailer::ENCRYPTION_STARTTLS' use 587

            //Destinatário
            $mail->setFrom($this->config['usermail'], $this->config['username']); //Quem está enviando
            $mail->addAddress($email, $name); //Quem recebe
            
            //Conteudo do email
            $mail->isHTML(true); //Se o email será em formato html
            $mail->Subject = $subject;
            $mail->Body    = $message; //A mensagem do body pode ser feita com tags html <b>in bold!</b>
            // $mail->AltBody = 'A mensagem não possui estilização em html, mas as chances do email não se tornar um spam são maiores';
            $mail->CharSet = 'UTF-8';

            $mail->send();
            return true;
        } catch (Exception $e) {
            echo "Entre em contato com o suporte ou tente novamente. (ERROR: SEND MAIL)<br>";
	        echo "<a href='" . BASE_URL . "'>Início</a>";
            error_log("Error " . $e->getMessage(), 3, "error_mail.log");
            return false;
        }
    }


    public function sendMessageAttachment($email, $name, $subject, $message, $attachments)
    {
        $mail = new PHPMailer(true);

        try {
            //Configurações do servidor
            $mail->isSMTP();
            $mail->Host       = $this->config['hostmail']; //Servidor SMTP
            $mail->SMTPAuth   = true; //SMTP autenticação
            $mail->Username   = $this->config['usermail']; //SMTP user_name
            $mail->Password   = $this->config['password']; //SMTP Senha
            $mail->SMTPSecure = 'ssl';
            $mail->Port       = $this->config['port']; //Caso o SMTPSecure seja 'PHPMailer::ENCRYPTION_STARTTLS' use 587

            //Destinatário
            $mail->setFrom($this->config['usermail'], $this->config['username']); //Quem está enviando
            $mail->addAddress($email, $name); //Quem recebe

            //Conteudo do email
            $mail->isHTML(true); //Se o email será em formato html
            $mail->Subject = $subject;
            $mail->Body    = $message; //A mensagem do body pode ser feita com tags html <b>in bold!</b>
            // $mail->AltBody = 'A mensagem não possui estilização em html, mas as chances do email não se tornar um spam são maiores';
            $mail->CharSet = 'UTF-8';

            //Especificações de funções
            foreach ($attachments as $key => $value) {
                $mail->addAttachment($value['tmp_name'], $value['name']);
            }
            $mail->send();

            return true;
        } catch (Exception $e) {
            echo "Entre em contato com o suporte ou tente novamente. (ERROR: SEND MAIL)<br>";
	        echo "<a href='" . BASE_URL . "'>Início</a>";
            error_log("Error " . $e->getMessage(), 3, "error_mail.log");
            return false;
        }
    }

   


}
