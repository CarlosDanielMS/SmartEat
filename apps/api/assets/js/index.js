$("#form_index").validate({
    rules:{//regras
        login:{
            required: true,
            minlength: 10,
            email: true
        },
        password:{
            required:true,
            minlength: 8
        }
    },
    messages:{//mensagem
        login:{
            required: "Preencha o campo",
            minlength: "Insira no mínimo 10 caracteres",
            email: "Preencha um e-mail válido"
        },
        password:{
            required: "Preencha o campo",
            minlength: "Insira no mínimo 8 caracteres"
        }
    }
 
});



