$(document).ready(function() {
    $.validator.setDefaults({
        errorPlacement: function (error, element) {
            if (element.parent('.input-group').length || element.prop('type') === 'checkbox' || element.prop('type') === 'radio') {
                error.insertAfter(element.parent());
            } else {
                error.insertAfter(element);
            }
        }
    });

    $('#register').validate();

    // Aplicar a mesma regra para todos os campos exceto 'complment e note'
    $('#register').find('input, select').each(function() {
        $(this).rules('add', {
            required: true
        });
    });

    // Defina a mesma mensagem de erro para todos os campos
    var mensagens = {};
    $('#register').find('input, select').each(function() {
        var campo = $(this).attr('name');
        mensagens[campo] = {
            required: "Campo obrigatório"
        };
    });
    $.extend($('#register').validate().settings.messages, mensagens);
});
