import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateMealPlan, clearMealPlanCache } from '../../../services/groq/groqService';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabase';

export function useAutopilot() {
  const { user } = useAuth();
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState('week');
  const [mealPlan, setMealPlan] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem('autopilot_enabled');
      if (saved !== null) {
        setIsEnabled(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const toggleAutopilot = async (value) => {
    try {
      setIsEnabled(value);
      await AsyncStorage.setItem('autopilot_enabled', JSON.stringify(value));
      
      if (value) {
        Alert.alert(
          'AutoPilot Ativado! 🤖',
          'A IA criará 6 refeições diárias personalizadas usando alimentos da Tabela TACO.'
        );
      }
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
    }
  };

  const populateDailyMeals = async (plan, userId, mealPlanId) => {
    try {
      console.log('📅 Populando refeições diárias no banco de dados...');
      
      const dates = plan.days.map(day => day.date);
      console.log(`📅 Datas do plano: ${dates[0]} até ${dates[dates.length - 1]}`);
      
      console.log('🗑️ Removendo refeições antigas dessas datas...');
      const { error: deleteError } = await supabase
        .from('meals')
        .delete()
        .eq('user_id', userId)
        .in('meal_date', dates);
      
      if (deleteError) {
        console.error('❌ Erro ao deletar refeições antigas:', deleteError);
        throw deleteError;
      }
      
      console.log('✓ Refeições antigas removidas');
      
      const mealsToInsert = [];

      for (let i = 0; i < plan.days.length; i++) {
        const dayData = plan.days[i];

        for (const meal of dayData.meals) {
          mealsToInsert.push({
            user_id: userId,
            meal_plan_id: mealPlanId,
            meal_date: dayData.date,
            meal_type: meal.type,
            name: meal.name,
            calories: meal.calories || 0,
            protein: meal.macros?.protein || 0,
            carbs: meal.macros?.carbs || 0,
            fats: meal.macros?.fats || 0,
            ingredients: meal.ingredients || [],
            instructions: meal.instructions || '',
            consumed: false,
          });
        }
      }

      console.log(`📝 Inserindo ${mealsToInsert.length} refeições com nutrientes da TACO...`);
      
      const { error } = await supabase
        .from('meals')
        .insert(mealsToInsert);

      if (error) {
        console.error('❌ Erro ao inserir refeições:', error);
        throw error;
      }
      
      console.log(`✓ ${mealsToInsert.length} refeições adicionadas (${mealsToInsert.length / plan.days.length} por dia)!`);
      console.log('✓ Macros e micros calculados usando Tabela TACO 🇧🇷');
      
      return mealsToInsert.length;
    } catch (error) {
      console.error('❌ Erro ao popular refeições diárias:', error);
      throw error;
    }
  };

  const handleGenerateMeals = async () => {
    if (!isEnabled) {
      Alert.alert('AutoPilot Desabilitado', 'Ative o AutoPilot primeiro.');
      return;
    }

    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado.');
      return;
    }

    setLoading(true);
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('quiz_data, full_name')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      if (!profile || !profile.quiz_data || Object.keys(profile.quiz_data).length === 0) {
        Alert.alert('Perfil Incompleto', 'Complete o questionário primeiro.');
        return;
      }

      const toNumber = (v, def) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : def;
      };
      
      const clamp = (val, min, max, def) => {
        if (!Number.isFinite(val)) return def;
        return Math.min(Math.max(val, min), max);
      };

      const weight = clamp(toNumber(profile.quiz_data['3'], 70), 35, 250, 70);
      const age = clamp(toNumber(profile.quiz_data['4'], 25), 12, 100, 25);
      const height = clamp(toNumber(profile.quiz_data['5'], 170), 120, 220, 170);

      const goalCode = profile.quiz_data['2'];
      const genderCode = profile.quiz_data['1'];

      const userProfile = {
        gender: genderCode === 'male' ? 'masculino' : 'feminino',
        age,
        weight,
        height,
        goal:
          goalCode === 'lose_weight'
            ? 'perder peso'
            : goalCode === 'gain_weight'
            ? 'ganhar peso'
            : 'manter peso',
        activityLevel: 'moderado',
        restrictions: 'nenhuma',
      };

      console.log('👤 Perfil do usuário:', userProfile);

      const plan = await generateMealPlan(userProfile, period, {});
      setMealPlan(plan);

      const { data: savedPlan, error: savePlanError } = await supabase
        .from('meal_plans')
        .insert({
          user_id: user.id,
          plan_data: plan,
          period: period,
          is_active: true,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (savePlanError) throw savePlanError;

      console.log('✓ Plano salvo no banco de dados');

      const mealsCount = await populateDailyMeals(plan, user.id, savedPlan.id);
      
      Alert.alert(
        'Sucesso! 🎉',
        `Plano ${period === 'week' ? 'semanal' : 'mensal'} criado com TACO!\n\n✓ ${mealsCount} refeições geradas\n✓ 6 refeições por dia\n✓ Nutrientes da Tabela TACO 🇧🇷\n✓ Salvo no banco\n\nAcesse "Alimentação" para visualizar.`,
        [{ text: 'OK' }]
      );

    } catch (error) {
      console.error('Erro ao gerar plano:', error);
      Alert.alert('Erro', error.message || 'Não foi possível gerar o plano.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = async () => {
    Alert.alert(
      'Limpar Cache',
      'Deseja limpar o cache e gerar um novo plano?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            await clearMealPlanCache();
            setMealPlan(null);
            Alert.alert('Sucesso', 'Cache limpo!');
          }
        }
      ]
    );
  };

  return {
    isEnabled,
    toggleAutopilot,
    loading,
    period,
    setPeriod,
    mealPlan,
    handleGenerateMeals,
    handleClearCache
  };
}
