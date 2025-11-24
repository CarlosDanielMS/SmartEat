$(document).ready(function () {
    // Armazenando o botão "Avançar"
    const $btnNext = $(".btn-next");

    // Validação do formulário
    $("#form_question_9").validate({
        rules: {
            email: {
                required: true,
                email: true,
                remote: {
                    url: BASE_URL + "Ajax/checkEmail/",
                    type: "post",
                }
            },
        },
        messages: {
            email: {
                required: "Campo obrigatório",
                email: "Email inválido",
                remote: 'Este email já está em uso.'
            },
        },
        // adicionar a classe "disabled" quando o campo é inválido
        highlight: function (element) {
            if ($(element).attr("name") === "email") {
                // adiciona a classe "disabled" no botão se o email não for válido.
                $btnNext.addClass("disabled-btn");
            }
        },
        // Remove a classe "disabled" quando o campo é válido
        unhighlight: function (element) {
            if ($(element).attr("name") === "email") {
                // Remove a classe "disabled" se o email for válido
                $btnNext.removeClass("disabled-btn");
            }
        }
    });
});