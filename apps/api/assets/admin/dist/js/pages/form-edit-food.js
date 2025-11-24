$('#form_edit_food').validate({
  rules: {
    name: {
      required: true,
    },
    classification_id: {
      required: true,
    },
    division_id: {
      required: true,
    },
    portion: {
      required: true,
      min: 0,
    },
    calories: {
      required: true,
      min: 0,
    },
    proteins: {
      required: true,
      min: 0,
    },
    fats: {
      required: true,
      min: 0,
    },
    carbohydrates: {
      required: true,
      min: 0,
    },
    fibers: {
      required: true,
      min: 0,
    },
    sugar_level: {
      required: true,
      min: 0,
    },
  },
  messages: {
    name: {
      required: 'Campo obrigatório! Por favor insira um nome.',
    },
    classification_id: {
      required: 'Campo obrigatório! Por favor selecione uma classificação.',
    },
    division_id: {
      required: 'Campo obrigatório! Por favor selecione uma divisão.',
    },
    portion: {
      required: 'Campo obrigatório! Por favor insira uma porção.',
      min: 'Insira um valor igual ou maior que 0',
    },
    calories: {
      required: 'Campo obrigatório! Por favor insira a quantidade de calorias.',
      min: 'Insira um valor igual ou maior que 0',
    },
    proteins: {
      required: 'Campo obrigatório! Por favor insira a quantidade de proteínas.',
      min: 'Insira um valor igual ou maior que 0',
    },
    fats: {
      required: 'Campo obrigatório! Por favor insira a quantidade de gorduras.',
      min: 'Insira um valor igual ou maior que 0',
    },
    carbohydrates: {
      required: 'Campo obrigatório! Por favor insira a quantidade de carboidratos.',
      min: 'Insira um valor igual ou maior que 0',
    },
    fibers: {
      required: 'Campo obrigatório! Por favor insira a quantidade de fibras.',
      min: 'Insira um valor igual ou maior que 0',
    },
    sugar_level: {
      required: 'Campo obrigatório! Por favor insira o nível de açúcar.',
      min: 'Insira um valor igual ou maior que 0',
    },
  }
});
