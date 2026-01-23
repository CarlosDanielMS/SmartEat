// apps/mobile/src/services/tacoService.js
import { supabase } from '../../lib/supabase';

export const tacoService = {
  /**
   * Buscar alimentos da TACO por nome
   */
  async searchFoods(query) {
    try {
      if (!query || query.trim().length < 2) return [];

      const { data, error } = await supabase
        .from('taco_foods')
        .select('*')
        .ilike('nome', `%${query.trim()}%`)
        .order('nome')
        .limit(20);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar alimentos TACO:', error);
      return [];
    }
  },

  /**
   * Buscar por categoria
   */
  async getFoodsByCategory(category) {
    try {
      const { data, error } = await supabase
        .from('taco_foods')
        .select('*')
        .eq('categoria', category)
        .order('nome');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar por categoria:', error);
      return [];
    }
  },

  /**
   * Buscar todas as categorias
   */
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('taco_foods')
        .select('categoria')
        .not('categoria', 'is', null);

      if (error) throw error;
      
      const uniqueCategories = [...new Set(data.map(item => item.categoria))];
      return uniqueCategories;
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      return [];
    }
  },

  /**
   * Calcular macros e micros baseado na quantidade
   */
  calculateNutrients(tacoFood, quantityInGrams) {
    const qty = parseFloat(quantityInGrams) || 0;
    if (!tacoFood || qty <= 0) {
      return {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        fiber: 0,
        calcium: 0,
        iron: 0,
        sodium: 0,
        vitamin_c: 0,
        vitamin_d: 0,
      };
    }

    // Fator de conversão (TACO é por 100g)
    const factor = qty / 100;

    return {
      calories: (parseFloat(tacoFood.energia_kcal) || 0) * factor,
      protein: (parseFloat(tacoFood.proteina_g) || 0) * factor,
      carbs: (parseFloat(tacoFood.carboidrato_g) || 0) * factor,
      fats: (parseFloat(tacoFood.lipideos_g) || 0) * factor,
      fiber: (parseFloat(tacoFood.fibra_g) || 0) * factor,
      calcium: (parseFloat(tacoFood.calcio_mg) || 0) * factor,
      iron: (parseFloat(tacoFood.ferro_mg) || 0) * factor,
      sodium: (parseFloat(tacoFood.sodio_mg) || 0) * factor,
      vitamin_c: (parseFloat(tacoFood.vitamina_c_mg) || 0) * factor,
      vitamin_d: (parseFloat(tacoFood.vitamina_d_mcg) || 0) * factor,
    };
  },

  /**
   * Buscar alimento por ID
   */
  async getFoodById(id) {
    try {
      const { data, error } = await supabase
        .from('taco_foods')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar alimento por ID:', error);
      return null;
    }
  },

  /**
   * Buscar alimentos aleatórios de uma categoria
   */
  async getRandomFoodsByCategory(category, limit = 5) {
    try {
      const { data, error } = await supabase
        .from('taco_foods')
        .select('*')
        .eq('categoria', category)
        .limit(limit * 3); // Busca mais para randomizar

      if (error) throw error;
      
      // Embaralhar e pegar apenas o limite
      const shuffled = (data || []).sort(() => 0.5 - Math.random());
      return shuffled.slice(0, limit);
    } catch (error) {
      console.error('Erro ao buscar alimentos aleatórios:', error);
      return [];
    }
  },
};
