// src/data/plannerData.js

// Simulação dos dados para a tela "Hoje"
export const mockTodayData = {
  calories: {
    target: 2500,
    eaten: 0, // Será calculado na tela
  },
  macros: {
    protein: 150, 
    carbs: 300, 
    fat: 80, 
  },
  // As 6 refeições solicitadas
  meals: [
    {
      id: '1',
      name: 'Café da Manhã',
      foods: [
        {
          id: 'f1',
          name: 'Pão Integral',
          portion: '2 fatias',
          calories: 130,
          image: 'https://placehold.co/100x100/F5F5F5/333?text=Pao',
        },
        {
          id: 'f2',
          name: 'Ovos Mexidos',
          portion: '2 unidades',
          calories: 180,
          image: 'https://placehold.co/100x100/F5F5F5/333?text=Ovos',
        }
      ],
    },
    {
      id: '2',
      name: 'Lanche da Manhã',
      foods: [
        {
          id: 'f3',
          name: 'Maçã',
          portion: '1 unidade',
          calories: 52,
          image: 'https://placehold.co/100x100/F5F5F5/333?text=Maca',
        }
      ],
    },
    {
      id: '3',
      name: 'Almoço',
      foods: [
        {
          id: 'f4',
          name: 'Arroz Branco',
          portion: '100g',
          calories: 130,
          image: 'https://placehold.co/100x100/F5F5F5/333?text=Arroz',
        },
        {
          id: 'f5',
          name: 'Feijão Carioca',
          portion: '1 concha',
          calories: 76,
          image: 'https://placehold.co/100x100/F5F5F5/333?text=Feijao',
        },
        {
          id: 'f6',
          name: 'Peito de Frango',
          portion: '150g',
          calories: 240,
          image: 'https://placehold.co/100x100/F5F5F5/333?text=Frango',
        }
      ],
    },
    {
      id: '4',
      name: 'Lanche da Tarde',
      foods: [], // Vazio para teste
    },
    {
      id: '5',
      name: 'Jantar',
      foods: [],
    },
    {
      id: '6',
      name: 'Ceia',
      foods: [],
    },
  ],
};

// Simulação dos dados para a tela "Semana"
export const mockWeekData = [
  { day: 'Seg', name: 'Segunda', calories: 2500, meals: 3 },
  { day: 'Ter', name: 'Terça', calories: 2450, meals: 3 },
  { day: 'Qua', name: 'Quarta', calories: 2510, meals: 4 },
  { day: 'Qui', name: 'Quinta', calories: 2500, meals: 3 },
  { day: 'Sex', name: 'Sexta', calories: 2600, meals: 3 },
  { day: 'Sáb', name: 'Sábado', calories: 2800, meals: 2 },
  { day: 'Dom', name: 'Domingo', calories: 2750, meals: 3 },
];