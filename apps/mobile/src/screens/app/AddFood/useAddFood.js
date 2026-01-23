import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../../../lib/supabase';
import { nutritionService } from '../../../services/supabase/nutritionService';

export function useAddFood(route, navigation) {
  const { mealId, mealType } = route.params;

  const [foodName, setFoodName] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [catalogResults, setCatalogResults] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('g');
  const [calories, setCalories] = useState('');
  const [proteins, setProteins] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [loading, setLoading] = useState(false);
  const [mealFoods, setMealFoods] = useState([]);

  const loadMealFoods = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('meal_foods')
        .select('*')
        .eq('meal_id', mealId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMealFoods(data || []);
    } catch (error) {
      console.error('Erro ao carregar alimentos:', error);
    }
  }, [mealId]);

  useEffect(() => {
    loadMealFoods();
  }, [loadMealFoods]);

  const handleFoodNameChange = (text) => {
    setFoodName(text);
    setSelectedFood(null);

    if (searchTimeout) clearTimeout(searchTimeout);

    const timeout = setTimeout(async () => {
      try {
        const results = await nutritionService.searchFoodCatalog(text);
        setCatalogResults(results);
      } catch (err) {
        console.error('Erro ao buscar catálogo:', err);
      }
    }, 400);

    setSearchTimeout(timeout);
  };

  const handleSelectCatalogItem = (item) => {
    setSelectedFood(item);
    setFoodName(item.nome);
    setCatalogResults([]);

    const baseQty = item.porcao_base || 100;
    setQuantity(String(baseQty));
    setUnit(item.unidade_base || 'g');

    const nutrients = nutritionService.computeNutrientsFromCatalog(item, baseQty);
    setCalories(String(nutrients.calorias.toFixed(0)));
    setProteins(String(nutrients.proteinas.toFixed(1)));
    setCarbs(String(nutrients.carboidratos.toFixed(1)));
    setFats(String(nutrients.gorduras.toFixed(1)));
  };

  const handleQuantityChange = (value) => {
    setQuantity(value);
    if (selectedFood) {
      const nutrients = nutritionService.computeNutrientsFromCatalog(selectedFood, value);
      setCalories(String((nutrients.calorias || 0).toFixed(0)));
      setProteins(String((nutrients.proteinas || 0).toFixed(1)));
      setCarbs(String((nutrients.carboidratos || 0).toFixed(1)));
      setFats(String((nutrients.gorduras || 0).toFixed(1)));
    }
  };

  const handleAddFood = async () => {
    if (!foodName.trim()) {
      Alert.alert('Atenção', 'Digite o nome do alimento');
      return;
    }

    if (!quantity || parseFloat(quantity) <= 0) {
      Alert.alert('Atenção', 'Digite uma quantidade válida');
      return;
    }

    try {
      setLoading(true);

      const foodData = {
        meal_id: mealId,
        name: foodName,
        quantity: parseFloat(quantity),
        unit: unit,
        calories: parseFloat(calories) || 0,
        protein: parseFloat(proteins) || 0,
        carbs: parseFloat(carbs) || 0,
        fats: parseFloat(fats) || 0,
        catalog_id: selectedFood?.id || null
      };

      const { error } = await supabase
        .from('meal_foods')
        .insert(foodData);

      if (error) throw error;

      // Limpar campos
      setFoodName('');
      setQuantity('');
      setCalories('');
      setProteins('');
      setCarbs('');
      setFats('');
      setSelectedFood(null);

      // Recarregar lista
      await loadMealFoods();

    } catch (error) {
      console.error('Erro ao adicionar alimento:', error);
      Alert.alert('Erro', 'Não foi possível salvar o alimento');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFood = async (foodId) => {
    try {
      const { error } = await supabase
        .from('meal_foods')
        .delete()
        .eq('id', foodId);

      if (error) throw error;
      await loadMealFoods();
    } catch (error) {
      console.error('Erro ao remover alimento:', error);
    }
  };

  const handleFinish = () => {
    navigation.goBack();
  };

  return {
    mealType,
    foodName,
    quantity,
    unit,
    calories,
    proteins,
    carbs,
    fats,
    loading,
    mealFoods,
    catalogResults,
    handleFoodNameChange,
    handleSelectCatalogItem,
    handleQuantityChange,
    handleAddFood,
    handleRemoveFood,
    handleFinish,
    setCalories,
    setProteins,
    setCarbs,
    setFats
  };
}
