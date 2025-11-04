$(document).ready(function () {
    $("#register").validate({
        rules: {
            first_name: {
                required: true,
                minlength: 3
            },
            last_name: {
                required: true,
                minlength: 3
            },
            email: {
                required: true,
                email: true,
                remote: {
                    url: BASE_URL + "Ajax/checkEmail/",
                    type: "post"
                }
            },
            password: {
                required: true,
                minlength: 8

            },
            c_password: {
                required: true,
                minlength: 8,
                equalTo: "#password"
            }

        },
        messages: {
            first_name: {
                required: "Campo obrigatório",
                minlength: "Necessário um mínimo de 3 caracteres"
            },
            last_name: {
                required: "Campo obrigatório",
                minlength: "Necessário um mínimo de 3 caracteres"
            },
            email: {
                required: "Campo obrigatório",
                email: "Email inválido",
                remote: 'Este email já está em uso.'
            },
            password: {
                required: "Campo obrigatório",
                minlength: "Necessário um mínimo de 8 caracteres"
            },
            c_password: {
                required: "Campo obrigatório",
                minlength: "Necessário um mínimo de 8 caracteres",
                equalTo: "As senhas não estão iguais"
            }
        }
    });
});