// src/data/adminMockData.js
// Simula os dados do banco para os CRUDs do Admin

export const MOCK_ALLERGENS = [
  { id: '1', name: 'Glúten' },
  { id: '2', name: 'Crustáceos' },
  { id: '3', name: 'Ovos' },
  { id: '4', name: 'Peixes' },
  { id: '5', name: 'Amendoim' },
];

export const MOCK_CLASSIFICATIONS = [
  { id: '1', name: 'Vegetariano' },
  { id: '2', name: 'Vegano' },
  { id: '3', name: 'Sem Glúten' },
  { id: '4', name: 'Low Carb' },
];

// (Tradução do seu list.php de Alimentos - dados de exemplo)
export const MOCK_FOODS = [
  {
    id: 'f1',
    name: 'Maçã',
    photo: 'https://placehold.co/100x100/f0e0e0/333?text=Maçã',
    classification_id: '2',
    allergen_id: null,
    calories: '52',
    protein: '0.3',
    carbohydrate: '14',
    fat: '0.2',
    sugar_level: 'medium',
    fat_level: 'low',
    sodium_level: 'low',
    fiber: '2.4',
    vitamin_c: '4.6',
    potassium: '107',
  },
  {
    id: 'f2',
    name: 'Peito de Frango Grelhado',
    photo: 'https://placehold.co/100x100/e0f0e0/333?text=Frango',
    classification_id: '4',
    allergen_id: null,
    calories: '165',
    protein: '31',
    carbohydrate: '0',
    fat: '3.6',
    sugar_level: 'low',
    fat_level: 'low',
    sodium_level: 'low',
    fiber: '0',
    vitamin_c: '0',
    potassium: '256',
  }
];

// (Tradução do seu array $level no list.php)
export const USER_LEVELS = {
  1: 'Usuário App', // Assumindo
  5: 'Admin',
};

// (Tradução do $list_users no list.php)
export const MOCK_USERS = [
  {
    id: 'u1',
    first_name: 'Admin',
    last_name: 'Principal',
    email: 'admin@teste.com',
    level: 5,
    phone: '99 99999-9999',
    genre: 'male',
    photo: 'https://placehold.co/100x100/F5F5F5/333?text=Admin',
    datebirth: '1990-01-01',
    document: '123.456.789-00',
  },
  {
    id: 'u2',
    first_name: 'Usuário',
    last_name: 'Comum',
    email: 'usuario@teste.com',
    level: 1,
    phone: '88 88888-8888',
    genre: 'female',
    photo: 'https://placehold.co/100x100/F5F5F5/333?text=User',
    datebirth: '1995-05-10',
    document: '987.654.321-00',
  },
];