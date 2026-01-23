import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../context/AuthContext';

export function useDiary() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const dateStr = selectedDate.toISOString().split('T')[0];

  const loadMeals = useCallback(async () => {
    if (!user) {
      console.log('❌ useDiary: usuário não autenticado');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      console.log('🧪 useDiary -> user.id:', user.id);
      console.log('🧪 useDiary -> dateStr:', dateStr);

      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', user.id)
        .eq('meal_date', dateStr)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('❌ useDiary: erro na query meals:', error);
        throw error;
      }

      console.log(`🧪 useDiary -> ${data?.length || 0} refeições para ${dateStr}`);
      console.log('🧪 useDiary -> data bruta:', data);

      const mealOrder = [
        'breakfast',
        'morning_snack',
        'lunch',
        'afternoon_snack',
        'dinner',
        'supper',
      ];

      const sortedMeals = (data || []).sort(
        (a, b) => mealOrder.indexOf(a.meal_type) - mealOrder.indexOf(b.meal_type)
      );

      setMeals(sortedMeals);
    } catch (err) {
      console.error('❌ useDiary: erro inesperado:', err);
    } finally {
      setLoading(false);
    }
  }, [user, dateStr]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMeals();
    setRefreshing(false);
  };

  useEffect(() => {
    loadMeals();
  }, [loadMeals]);

  useFocusEffect(
    useCallback(() => {
      console.log('🔄 useDiary: tela focada, recarregando refeições...');
      loadMeals();
    }, [loadMeals])
  );

  const toggleConsumed = async (mealId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('meals')
        .update({ consumed: !currentStatus })
        .eq('id', mealId);

      if (error) throw error;

      console.log(
        `✓ useDiary: refeição ${mealId} marcada como ${
          !currentStatus ? 'consumida' : 'não consumida'
        }`
      );
      await loadMeals();
    } catch (err) {
      console.error('❌ useDiary: erro ao atualizar refeição:', err);
      Alert.alert('Erro', 'Não foi possível atualizar a refeição.');
    }
  };

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const totalCalories = meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
  const consumedCalories = meals
    .filter((m) => m.consumed)
    .reduce((sum, meal) => sum + (meal.calories || 0), 0);

  const isToday = dateStr === new Date().toISOString().split('T')[0];

  return {
    user,
    selectedDate,
    meals,
    loading,
    refreshing,
    onRefresh,
    toggleConsumed,
    changeDate,
    goToToday,
    totalCalories,
    consumedCalories,
    isToday,
    dateStr,
  };
}
