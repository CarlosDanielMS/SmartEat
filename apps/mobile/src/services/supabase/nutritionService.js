import { supabase } from '../lib/supabase';


export const nutritionService = {
  // ==================== METAS ====================
  async getNutritionGoals(userId) {
    const { data, error } = await supabase
      .from('nutrition_goals')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // ==================== REFEIÇÕES ====================
  async getMealsByDate(userId, date) {
    const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('meals')
      .select(`
        *,
        meal_foods (*)
      `)
      .eq('user_id', userId)
      .eq('meal_date', dateStr)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async upsertMeal(mealData) {
    const { data, error } = await supabase
      .from('meals')
      .upsert(mealData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // ==================== MACROS DO DIA (apenas refeições concluídas) ====================
  async getDailyMacros(userId, date) {
    try {
      const { data: meals, error } = await supabase
        .from('meals')
        .select('calories, protein, carbs, fats, consumed')
        .eq('user_id', userId)
        .eq('meal_date', date)
        .eq('consumed', true);

      if (error) throw error;

      const totals = meals.reduce((acc, meal) => ({
        calorias: acc.calorias + (parseFloat(meal.calories) || 0),
        proteinas: acc.proteinas + (parseFloat(meal.protein) || 0),
        carboidratos: acc.carboidratos + (parseFloat(meal.carbs) || 0),
        gorduras: acc.gorduras + (parseFloat(meal.fats) || 0),
      }), { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 });

      console.log(`📊 Macros do dia ${date}:`, totals);
      return totals;
    } catch (error) {
      console.error('Erro ao buscar macros diários:', error);
      return { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 };
    }
  },

   // ==================== ✅ MICRONUTRIENTES DO DIA (calculados da TACO) ====================
  async getDailyMicronutrients(userId, date) {
    try {
      console.log(`🔬 Calculando micronutrientes do dia ${date}...`);

      const { data: meals, error: mealsError } = await supabase
        .from('meals')
        .select('id, ingredients, consumed, meal_date')
        .eq('user_id', userId)
        .eq('meal_date', date)
        .eq('consumed', true);

      console.log('🔍 meals brutas para micronutrientes:', JSON.stringify(meals, null, 2));


      if (mealsError) throw mealsError;

      if (!meals || meals.length === 0) {
        console.log('⚠️ Nenhuma refeição consumida');
        return {
          vitamina_c: 0,
          ferro: 0,
          calcio: 0,
          vitamina_d: 0,
        };
      }

      console.log(`📋 ${meals.length} refeições consumidas`);

      let totalVitaminaC = 0;
      let totalFerro = 0;
      let totalCalcio = 0;
      let totalVitaminaD = 0;

      for (const meal of meals) {
        if (!meal.ingredients) continue;

        const ingredients = Array.isArray(meal.ingredients)
          ? meal.ingredients
          : typeof meal.ingredients === 'string'
          ? JSON.parse(meal.ingredients)
          : [];

        for (const ingredient of ingredients) {
          if (ingredient.nutrients) {
            totalVitaminaC += parseFloat(ingredient.nutrients.vitamin_c) || 0;
            totalFerro     += parseFloat(ingredient.nutrients.iron) || 0;
            totalCalcio    += parseFloat(ingredient.nutrients.calcium) || 0;
            totalVitaminaD += parseFloat(ingredient.nutrients.vitamin_d) || 0;
          }
        }
      }

      const totals = {
        vitamina_c: totalVitaminaC,
        ferro: totalFerro,
        calcio: totalCalcio,
        vitamina_d: totalVitaminaD,
      };

      console.log('🔬 Micronutrientes calculados:', totals);
      return totals;
    } catch (error) {
      console.error('Erro ao buscar micronutrientes:', error);
      return {
        vitamina_c: 0,
        ferro: 0,
        calcio: 0,
        vitamina_d: 0,
      };
    }
  },


  async updateDailyMicronutrients(userId, date) {
    // Esta função não é mais necessária pois calculamos em tempo real
    // Mas mantendo para compatibilidade
    return this.getDailyMicronutrients(userId, date);
  },

  // ==================== ATUALIZAR TOTAIS DA REFEIÇÃO ====================
  async updateMealTotals(mealId) {
    const { data: foods, error: foodsError } = await supabase
      .from('meal_foods')
      .select('calorias, proteinas, carboidratos, gorduras')
      .eq('meal_id', mealId);

    if (foodsError) throw foodsError;

    const totals = (foods || []).reduce(
      (acc, food) => ({
        calorias: acc.calorias + (parseFloat(food.calorias) || 0),
        proteinas: acc.proteinas + (parseFloat(food.proteinas) || 0),
        carboidratos: acc.carboidratos + (parseFloat(food.carboidratos) || 0),
        gorduras: acc.gorduras + (parseFloat(food.gorduras) || 0),
      }),
      { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 }
    );

    const { error: updateError } = await supabase
      .from('meals')
      .update(totals)
      .eq('id', mealId);

    if (updateError) throw updateError;
  },

  // ==================== ADICIONAR ALIMENTO ====================
  async addFoodToMeal(mealId, foodData) {
    const { data, error } = await supabase
      .from('meal_foods')
      .insert({
        meal_id: mealId,
        ...foodData,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // ==================== MARCAR REFEIÇÃO COMO CONCLUÍDA ====================
  async completeMealAndUpdateNutrients(mealId) {
    const { error: mealError } = await supabase
      .from('meals')
      .select('user_id, meal_date')
      .eq('id', mealId)
      .single();

    if (mealError) throw mealError;

    const { error } = await supabase
      .from('meals')
      .update({ consumed: true })
      .eq('id', mealId);

    if (error) throw error;

    console.log('✓ Refeição marcada como consumida - micronutrientes serão recalculados automaticamente');

    return { success: true };
  },

  // ==================== DESMARCAR REFEIÇÃO ====================
  async uncompleteMealAndUpdateNutrients(mealId) {
    const { error: mealError } = await supabase
      .from('meals')
      .select('user_id, meal_date')
      .eq('id', mealId)
      .single();

    if (mealError) throw mealError;

    const { error: updateError } = await supabase
      .from('meals')
      .update({ consumed: false })
      .eq('id', mealId);

    if (updateError) throw updateError;

    console.log('✓ Refeição desmarcada - micronutrientes serão recalculados automaticamente');

    return { success: true };
  },

  // ==================== CATÁLOGO ====================
  async searchFoodCatalog(query) {
    if (!query || query.trim().length < 2) return [];

    const { data, error } = await supabase
      .from('food_catalog')
      .select('*')
      .ilike('nome', `%${query.trim()}%`)
      .order('nome')
      .limit(20);

    if (error) throw error;
    return data || [];
  },

  async getFoodFromCatalog(id) {
    const { data, error } = await supabase
      .from('food_catalog')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  computeNutrientsFromCatalog(baseFood, quantidade) {
    const q = parseFloat(quantidade) || 0;
    if (!baseFood || q <= 0) {
      return {
        calorias: 0,
        proteinas: 0,
        carboidratos: 0,
        gorduras: 0,
        vitamina_c: 0,
        ferro: 0,
        calcio: 0,
        vitamina_d: 0,
      };
    }

    const porcaoBase = parseFloat(baseFood.porcao_base) || 100;
    const fator = q / porcaoBase;

    return {
      calorias:     (parseFloat(baseFood.calorias)     || 0) * fator,
      proteinas:    (parseFloat(baseFood.proteinas)    || 0) * fator,
      carboidratos: (parseFloat(baseFood.carboidratos) || 0) * fator,
      gorduras:     (parseFloat(baseFood.gorduras)     || 0) * fator,
      vitamina_c:   (parseFloat(baseFood.vitamina_c)   || 0) * fator,
      ferro:        (parseFloat(baseFood.ferro)        || 0) * fator,
      calcio:       (parseFloat(baseFood.calcio)       || 0) * fator,
      vitamina_d:   (parseFloat(baseFood.vitamina_d)   || 0) * fator,
    };
  },

  // ==================== ✅ NOVA FUNÇÃO: REFEIÇÕES DA SEMANA AGRUPADAS POR DIA ====================
  async getWeeklyMeals(userId, startDate, endDate) {
    const startStr = typeof startDate === 'string' ? startDate : startDate.toISOString().split('T')[0];
    const endStr   = typeof endDate   === 'string' ? endDate   : endDate.toISOString().split('T')[0];

    console.log(`📡 [nutritionService] Buscando refeições de ${startStr} até ${endStr}`);

    const { data: meals, error } = await supabase
      .from('meals')
      .select('id, meal_type, name, meal_date, calories, protein, carbs, fats, consumed')
      .eq('user_id', userId)
      .gte('meal_date', startStr)
      .lte('meal_date', endStr)
      .order('meal_date', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      console.error('❌ Erro ao buscar refeições da semana:', error);
      throw error;
    }

    console.log(`📊 [nutritionService] Total de refeições: ${meals?.length || 0}`);

    // ✅ AGRUPAR POR DATA
    const dataByDate = {};

    (meals || []).forEach(meal => {
      const date = meal.meal_date;

      if (!dataByDate[date]) {
        dataByDate[date] = {
          calorias: 0,
          meals: []
        };
      }

      // Adicionar refeição
      dataByDate[date].meals.push(meal);

      // Calcular calorias (apenas consumidas)
      if (meal.consumed) {
        dataByDate[date].calorias += parseFloat(meal.calories || 0);
      }
    });

    // LOG
    Object.keys(dataByDate).sort().forEach(date => {
      console.log(`  📅 ${date}: ${dataByDate[date].meals.length} refeições`);
    });

    return dataByDate;
  },

  // ==================== DADOS SEMANAIS (apenas calorias agregadas) ====================
  async getWeeklyData(userId, startDate, endDate) {
    const startStr = typeof startDate === 'string' ? startDate : startDate.toISOString().split('T')[0];
    const endStr   = typeof endDate   === 'string' ? endDate   : endDate.toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('meals')
      .select('meal_date, calories, protein, carbs, fats')
      .eq('user_id', userId)
      .gte('meal_date', startStr)
      .lte('meal_date', endStr)
      .eq('consumed', true);

    if (error) throw error;

    const grouped = (data || []).reduce((acc, meal) => {
      const d = meal.meal_date;
      if (!acc[d]) {
        acc[d] = { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 };
      }
      acc[d].calorias     += parseFloat(meal.calories) || 0;
      acc[d].proteinas    += parseFloat(meal.protein) || 0;
      acc[d].carboidratos += parseFloat(meal.carbs) || 0;
      acc[d].gorduras     += parseFloat(meal.fats) || 0;
      return acc;
    }, {});

    return grouped;
  },

  // ==================== DADOS MENSAIS ====================
  async getMonthlyData(userId, year, month) {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate   = `${year}-${String(month).padStart(2, '0')}-31`;
    return this.getWeeklyData(userId, startDate, endDate);
  },
};
