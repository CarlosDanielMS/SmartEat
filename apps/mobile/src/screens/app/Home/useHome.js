import { useState, useEffect, useCallback } from 'react';
import { Alert, Dimensions } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabase';
import { nutritionService } from '../../../services/supabase/nutritionService';

const { width } = Dimensions.get('window');

export function useHome(navigation) {
  const { user, userRole } = useAuth();

  const [profile, setProfile] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('dia');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const [nutritionGoals, setNutritionGoals] = useState(null);

  const [dailyMacros, setDailyMacros] = useState({
    calorias: 0,
    proteinas: 0,
    carboidratos: 0,
    gorduras: 0,
  });

  const [dailyMicros, setDailyMicros] = useState({
    vitamina_c: 0,
    ferro: 0,
    calcio: 0,
    vitamina_d: 0,
  });

  const [meals, setMeals] = useState([]);
  const [weeklyData, setWeeklyData] = useState({});
  const [monthlyData, setMonthlyData] = useState({});

  const loadProfile = useCallback(async () => {
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) setProfile(data);
  }, [user]);

  const loadNutritionData = useCallback(async () => {
    if (!user) return;

    setLoading(true);

    try {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      console.log('🔍 ===== DEBUG HOMESCREEN =====');
      console.log('📅 Data:', dateStr);
      console.log('👤 User:', user.id);
      console.log('📑 Tab selecionada:', selectedTab);

      let goals = await nutritionService.getNutritionGoals(user.id);
      if (!goals) {
        const { data: newGoals } = await supabase
          .from('nutrition_goals')
          .insert({ user_id: user.id })
          .select()
          .single();
        goals = newGoals;
      }
      setNutritionGoals(goals);

      if (selectedTab === 'dia') {
        console.log('📅 ===== CARREGANDO ABA DIA =====');
        console.log('📅 Data formatada:', dateStr);
        console.log('👤 User ID:', user.id);

        const macros = await nutritionService.getDailyMacros(user.id, dateStr);
        setDailyMacros(macros);

        const micros = await nutritionService.getDailyMicronutrients(
          user.id,
          dateStr
        );
        setDailyMicros(micros);

        console.log('📡 Buscando refeições APENAS do dia:', dateStr);

        const { data: aiMeals, error: mealsError } = await supabase
          .from('meals')
          .select(
            'id, user_id, meal_type, name, meal_date, calories, protein, carbs, fats, consumed, ingredients, created_at'
          )
          .eq('user_id', user.id)
          .eq('meal_date', dateStr)
          .order('created_at', { ascending: true });

        if (mealsError) {
          console.error('❌ Erro ao buscar refeições:', mealsError);
          setMeals([]);
        } else {
          console.log(
            `📊 RESULTADO: ${aiMeals?.length || 0} refeições encontradas`
          );

          // 🔥 ADAPTA as refeições para o formato do MealCard da Home
          const adaptedMeals = (aiMeals || [])
            .map((m) => {
              console.log(
                '🧪 useHome -> ingredients brutos da refeição',
                m.id,
                m.ingredients
              );

              let mealFoods = [];
              try {
                if (Array.isArray(m.ingredients)) {
                  mealFoods = m.ingredients.map((ing, idx) => ({
                    id: idx,
                    nome: ing.name ?? ing.nome ?? '',
                    quantidade: ing.quantity ?? ing.quantidade ?? '',
                  }));
                } else if (
                  typeof m.ingredients === 'string' &&
                  m.ingredients.trim()
                ) {
                  const parsed = JSON.parse(m.ingredients);
                  if (Array.isArray(parsed)) {
                    mealFoods = parsed.map((ing, idx) => ({
                      id: idx,
                      nome: ing.name ?? ing.nome ?? '',
                      quantidade:
                        ing.quantity ?? ing.quantidade ?? '',
                    }));
                  }
                }
              } catch (e) {
                console.warn(
                  'useHome: erro ao parsear ingredients para meal',
                  m.id,
                  e
                );
              }

              const typeConfig = {
                breakfast: {
                  icon: 'sunny-outline',
                  nome: 'Café da Manhã',
                  horario: '08:00',
                  ordem: 1,
                },
                morning_snack: {
                  icon: 'cafe-outline',
                  nome: 'Lanche da Manhã',
                  horario: '10:00',
                  ordem: 2,
                },
                lunch: {
                  icon: 'restaurant-outline',
                  nome: 'Almoço',
                  horario: '12:30',
                  ordem: 3,
                },
                afternoon_snack: {
                  icon: 'fast-food-outline',
                  nome: 'Lanche da Tarde',
                  horario: '16:00',
                  ordem: 4,
                },
                dinner: {
                  icon: 'moon-outline',
                  nome: 'Jantar',
                  horario: '19:30',
                  ordem: 5,
                },
                supper: {
                  icon: 'wine-outline',
                  nome: 'Ceia',
                  horario: '22:00',
                  ordem: 6,
                },
              };

              const cfg = typeConfig[m.meal_type] || {
                icon: 'restaurant-outline',
                nome: m.name || 'Refeição',
                horario: '00:00',
                ordem: 99,
              };

              return {
                id: m.id,
                concluido: m.consumed ?? false,
                icon: cfg.icon,
                nome: cfg.nome,
                mealName: m.name,
                horario: cfg.horario,
                ordem: cfg.ordem,
                calorias: m.calories || 0,
                protein: m.protein || 0,
                carbs: m.carbs || 0,
                fats: m.fats || 0,
                meal_foods: mealFoods,
                raw: m,
              };
            })
            .sort((a, b) => a.ordem - b.ordem);

          setMeals(adaptedMeals);
          console.log('📅 ===== FIM ABA DIA =====\n');
        }
      } else if (selectedTab === 'semana') {
        console.log('📅 ===== CARREGANDO ABA SEMANA =====');
        setMeals([]);
        const weekData = await nutritionService.getWeeklyData(user.id);
        setWeeklyData(weekData);
        console.log('📅 ===== FIM ABA SEMANA =====\n');
      } else if (selectedTab === 'mes') {
        console.log('📅 ===== CARREGANDO ABA MÊS =====');
        setMeals([]);
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth() + 1;
        const monthData = await nutritionService.getMonthlyData(
          user.id,
          year,
          month
        );
        setMonthlyData(monthData);
        console.log('📅 ===== FIM ABA MÊS =====\n');
      }

      console.log('🏁 ===== FIM DEBUG =====\n');
    } catch (err) {
      console.error('❌ Erro geral:', err);
      Alert.alert('Erro', 'Não foi possível carregar os dados nutricionais.');
    } finally {
      setLoading(false);
    }
  }, [user, selectedDate, selectedTab]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    loadNutritionData();
  }, [loadNutritionData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    await loadNutritionData();
    setRefreshing(false);
  };

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const handleMealPress = (meal) => {
    navigation.navigate('Diary', {
      initialDate: meal.raw?.meal_date || meal.meal_date,
    });
  };

  const handleToggleComplete = async (meal) => {
    try {
      const { error } = await supabase
        .from('meals')
        .update({ consumed: !meal.concluido })
        .eq('id', meal.id);

      if (error) throw error;

      console.log(
        `✓ Refeição ${meal.id} marcada como ${
          !meal.concluido ? 'consumida' : 'não consumida'
        }`
      );

      await loadNutritionData();
    } catch (error) {
      console.error('Erro ao atualizar refeição:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a refeição');
    }
  };

  return {
    user,
    userRole,
    profile,
    refreshing,
    selectedTab,
    setSelectedTab,
    selectedDate,
    setSelectedDate,
    loading,
    nutritionGoals,
    dailyMacros,
    dailyMicros,
    meals,
    weeklyData,
    monthlyData,
    onRefresh,
    width,
    changeDate,
    handleMealPress,
    handleToggleComplete,
  };
}
