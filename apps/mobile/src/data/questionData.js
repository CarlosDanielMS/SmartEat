// src/data/questionData.js
// ATUALIZAÇÃO: Mudamos o tipo de 'altura' e 'peso'

export const questions = [
  {
    id: 1,
    progress: 90, 
    question: 'Qual é o seu sexo?',
    type: 'single-choice', // Avança sozinho
    options: [
      { text: 'Masculino', value: 'male' },
      { text: 'Feminino', value: 'female' },
    ],
  },
  {
    id: 2,
    progress: 92,
    question: 'Qual é o seu principal objetivo?',
    type: 'single-choice', // Avança sozinho
    options: [
      { text: 'Perder peso', value: 'lose_weight' },
      { text: 'Manter peso', value: 'maintain_weight' },
      { text: 'Ganhar massa muscular', value: 'gain_muscle' },
    ],
  },
  {
    id: 3,
    progress: 95,
    question: 'Qual é a sua altura?',
    // --- ATUALIZADO ---
    type: 'picker-input', // Um novo tipo que criamos
    unit: 'cm',
    min: 140, // Valor mínimo para gerar o Picker
    max: 220, // Valor máximo
  },
  {
    id: 4,
    progress: 98,
    question: 'Qual é o seu peso atual?',
    // --- ATUALIZADO ---
    type: 'picker-input',
    unit: 'kg',
    min: 40,
    max: 200,
  },
  {
    id: 5,
    progress: 100,
    question: 'Qual é o seu peso desejado?',
    // --- ATUALIZADO ---
    type: 'picker-input',
    unit: 'kg',
    min: 40,
    max: 200,
  },
];