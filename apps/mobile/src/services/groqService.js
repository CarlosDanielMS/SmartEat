// apps/mobile/src/services/groqService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tacoService } from './tacoService';

const GROQ_API_KEY = 'CHAVE-API';
const GROQ_API_URL = 'URL-DA-API-GROQ';

const CACHE_KEY_PREFIX = '@mealplan_cache_';

/**
 * Gera plano alimentar usando Groq + TACO
 */
export async function generateMealPlan(userProfile, period = 'week', preferences = {}) {
  const cacheKey = `${CACHE_KEY_PREFIX}${period}_${JSON.stringify(userProfile)}`;

  try {
    // Verificar cache
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      console.log('✓ Usando plano em cache');
      return JSON.parse(cached);
    }

    console.log('🚀 Iniciando geração de plano alimentar com Groq...');

    // Buscar alimentos da TACO para usar no prompt
    const [cereais, carnes, vegetais, frutas, leguminosas] = await Promise.all([
      tacoService.getRandomFoodsByCategory('Cereais', 8),
      tacoService.getRandomFoodsByCategory('Carnes', 8),
      tacoService.getRandomFoodsByCategory('Vegetais', 10),
      tacoService.getRandomFoodsByCategory('Frutas', 6),
      tacoService.getRandomFoodsByCategory('Leguminosas', 4),
    ]);

    const tacoFoods = {
      cereais: cereais.map(f => f.nome),
      carnes: carnes.map(f => f.nome),
      vegetais: vegetais.map(f => f.nome),
      frutas: frutas.map(f => f.nome),
      leguminosas: leguminosas.map(f => f.nome),
    };

    const { dailyCalories, protein, carbs, fats } = calculateNutritionGoals(userProfile);
    const numDays = period === 'week' ? 7 : 30;
    const startDate = new Date();

    const prompt = buildPrompt(userProfile, dailyCalories, protein, carbs, fats, numDays, tacoFoods);

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Você é um nutricionista especializado em criar planos alimentares brasileiros usando alimentos da Tabela TACO. Sempre responda em JSON válido.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 8000,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('Resposta vazia da Groq API');
    }

    let parsedPlan;
    try {
      parsedPlan = JSON.parse(content);
    } catch (parseError) {
      console.error('Erro ao parsear JSON:', content);
      throw new Error('Formato de resposta inválido');
    }

    // Processar e calcular nutrientes reais usando TACO
    const processedPlan = await processPlanWithTACO(parsedPlan, startDate, dailyCalories);

    // Salvar no cache
    await AsyncStorage.setItem(cacheKey, JSON.stringify(processedPlan));

    return processedPlan;
  } catch (error) {
    console.error('Erro ao gerar plano alimentar:', error);
    throw error;
  }
}

/**
 * Calcula metas nutricionais baseado no perfil
 */
function calculateNutritionGoals(profile) {
  const { gender, age, weight, height, goal, activityLevel } = profile;

  // Cálculo de TMB (Taxa Metabólica Basal) - Fórmula de Harris-Benedict
  let bmr;
  if (gender === 'masculino') {
    bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
  } else {
    bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age;
  }

  // Fator de atividade
  const activityFactors = {
    sedentario: 1.2,
    leve: 1.375,
    moderado: 1.55,
    intenso: 1.725,
    muito_intenso: 1.9,
  };
  const activityFactor = activityFactors[activityLevel] || 1.55;

  let dailyCalories = bmr * activityFactor;

  // Ajustar calorias baseado no objetivo
  if (goal === 'perder peso') {
    dailyCalories *= 0.85; // Déficit de 15%
  } else if (goal === 'ganhar peso') {
    dailyCalories *= 1.15; // Superávit de 15%
  }

  // Distribuição de macronutrientes
  const protein = (dailyCalories * 0.30) / 4; // 30% das calorias, 4 kcal/g
  const carbs = (dailyCalories * 0.40) / 4; // 40% das calorias, 4 kcal/g
  const fats = (dailyCalories * 0.30) / 9; // 30% das calorias, 9 kcal/g

  return {
    dailyCalories: Math.round(dailyCalories),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fats: Math.round(fats),
  };
}

/**
 * Constrói o prompt para a IA
 */
function buildPrompt(userProfile, dailyCalories, protein, carbs, fats, numDays, tacoFoods) {
  return `
Crie um plano alimentar de ${numDays} dias para:

**PERFIL DO USUÁRIO:**
- Gênero: ${userProfile.gender}
- Idade: ${userProfile.age} anos
- Peso: ${userProfile.weight} kg
- Altura: ${userProfile.height} cm
- Objetivo: ${userProfile.goal}
- Nível de atividade: ${userProfile.activityLevel}
- Restrições: ${userProfile.restrictions || 'nenhuma'}

**METAS NUTRICIONAIS DIÁRIAS:**
- Calorias: ${dailyCalories} kcal
- Proteínas: ${protein}g
- Carboidratos: ${carbs}g
- Gorduras: ${fats}g

**ALIMENTOS DISPONÍVEIS DA TABELA TACO:**
- Cereais: ${tacoFoods.cereais.join(', ')}
- Carnes e Ovos: ${tacoFoods.carnes.join(', ')}
- Vegetais: ${tacoFoods.vegetais.join(', ')}
- Frutas: ${tacoFoods.frutas.join(', ')}
- Leguminosas: ${tacoFoods.leguminosas.join(', ')}

**INSTRUÇÕES:**
1. Crie EXATAMENTE 6 refeições por dia:
   - breakfast (Café da Manhã) - 07:30
   - morning_snack (Lanche da Manhã) - 10:00
   - lunch (Almoço) - 12:30
   - afternoon_snack (Lanche da Tarde) - 16:00
   - dinner (Jantar) - 19:30
   - supper (Ceia) - 21:30

2. Use APENAS alimentos da lista acima (Tabela TACO)
3. Varie os alimentos ao longo dos dias
4. Cada ingrediente deve ter nome e quantidade em gramas
5. Distribua as calorias: Café(20%), Lanche Manhã(10%), Almoço(30%), Lanche Tarde(10%), Jantar(25%), Ceia(5%)

**FORMATO DE RESPOSTA (JSON):**
{
  "days": [
    {
      "day": 1,
      "meals": [
        {
          "type": "breakfast",
          "name": "Nome da Refeição",
          "ingredients": [
            {"name": "Nome exato da TACO", "quantity": 100}
          ]
        }
      ]
    }
  ]
}

IMPORTANTE: Use os nomes EXATOS dos alimentos listados acima. Retorne apenas o JSON, sem texto adicional.
`;
}

/**
 * Processa o plano e calcula nutrientes usando TACO
 */
async function processPlanWithTACO(aiPlan, startDate, targetCalories) {
  try {
    console.log('🔄 Processando plano com dados da TACO...');

    const processedDays = [];

    for (let i = 0; i < aiPlan.days.length; i++) {
      const dayData = aiPlan.days[i];
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];

      const processedMeals = [];

      for (const meal of dayData.meals) {
        const processedIngredients = [];
        let mealCalories = 0;
        let mealProtein = 0;
        let mealCarbs = 0;
        let mealFats = 0;

        // Processar cada ingrediente
        for (const ingredient of meal.ingredients || []) {
          // Buscar alimento na TACO
          const tacoResults = await tacoService.searchFoods(ingredient.name);
          
          if (tacoResults.length > 0) {
            const tacoFood = tacoResults[0]; // Primeiro resultado
            const nutrients = tacoService.calculateNutrients(tacoFood, ingredient.quantity);

            processedIngredients.push({
              name: tacoFood.nome,
              quantity: `${ingredient.quantity}g`,
              taco_id: tacoFood.id,
              nutrients: nutrients,
            });

            // Acumular macros
            mealCalories += nutrients.calories;
            mealProtein += nutrients.protein;
            mealCarbs += nutrients.carbs;
            mealFats += nutrients.fats;
          } else {
            console.warn(`⚠️ Alimento não encontrado na TACO: ${ingredient.name}`);
            // Adicionar mesmo assim, mas sem nutrientes precisos
            processedIngredients.push({
              name: ingredient.name,
              quantity: `${ingredient.quantity}g`,
              taco_id: null,
              nutrients: null,
            });
          }
        }

        processedMeals.push({
          type: meal.type,
          name: meal.name,
          ingredients: processedIngredients,
          calories: Math.round(mealCalories),
          macros: {
            protein: Math.round(mealProtein),
            carbs: Math.round(mealCarbs),
            fats: Math.round(mealFats),
          },
          instructions: meal.instructions || '',
        });
      }

      processedDays.push({
        day: i + 1,
        date: dateStr,
        meals: processedMeals,
      });
    }

    const finalPlan = {
      totalDays: aiPlan.days.length,
      dailyCalorieTarget: targetCalories,
      days: processedDays,
      createdAt: new Date().toISOString(),
    };

    console.log('✓ Plano processado com sucesso usando TACO');
    return finalPlan;
  } catch (error) {
    console.error('❌ Erro ao processar plano com TACO:', error);
    throw error;
  }
}

/**
 * Limpar cache
 */
export async function clearMealPlanCache() {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter((key) => key.startsWith(CACHE_KEY_PREFIX));
    await AsyncStorage.multiRemove(cacheKeys);
    console.log(`✓ ${cacheKeys.length} caches removidos`);
  } catch (error) {
    console.error('Erro ao limpar cache:', error);
    throw error;
  }
}
