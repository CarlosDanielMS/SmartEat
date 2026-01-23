import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabase';

const LATE_TOLERANCE_MINUTES = 30; // atraso aceito

// Pure helper functions moved outside
const calculateGoals = (quizData) => {
  const weight = quizData?.['3'] || 70;
  const goal = quizData?.['2'] || 'maintain_weight';
  
  let calorieMultiplier = 35;
  if (goal === 'lose_weight') calorieMultiplier = 30;
  if (goal === 'gain_weight') calorieMultiplier = 40;

  const calories = weight * calorieMultiplier;
  
  return {
    calories: Math.round(calories),
    protein: Math.round(weight * 2),
    carbs: Math.round(calories * 0.4 / 4),
    fats: Math.round(calories * 0.3 / 9),
  };
};

const getPlannedDateTime = (meal) => {
  if (meal.meal_time) {
    const [h, m] = meal.meal_time.split(':').map(Number);
    const d = new Date(meal.meal_date);
    d.setHours(h, m, 0, 0);
    return d;
  }
  return new Date(meal.created_at);
};

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [todayProgress, setTodayProgress] = useState(null);

  const loadNotifications = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      
      if (data) {
        setNotifications(data);
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createNotification = useCallback(async (goal) => {
    if (!user?.id) return;

    const today = new Date().toISOString().split('T')[0];
    
    const { data: existing } = await supabase
      .from('notifications')
      .select('id')
      .eq('user_id', user.id)
      .eq('type', goal.type)
      .gte('created_at', `${today}T00:00:00`)
      .maybeSingle();

    if (existing) return;

    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: user.id,
        type: goal.type,
        title: goal.title,
        message: `Parabéns! Você atingiu sua meta de ${goal.type === 'calories' ? 'calorias' : goal.type} hoje! 🎉`,
        icon: goal.emoji,
        read: false,
        created_at: new Date().toISOString(),
      });

    if (!error) {
      loadNotifications();
    }
  }, [user, loadNotifications]);

  const checkAndNotifyGoals = useCallback(async (totals, goals) => {
    const achieved = [];
    
    if (totals.calories >= goals.calories * 0.95 && totals.calories <= goals.calories * 1.05) {
      achieved.push({ type: 'calories', emoji: '🔥', title: 'Meta de Calorias Atingida!' });
    }
    if (totals.protein >= goals.protein * 0.95) {
      achieved.push({ type: 'protein', emoji: '💪', title: 'Meta de Proteínas Atingida!' });
    }
    if (totals.carbs >= goals.carbs * 0.95) {
      achieved.push({ type: 'carbs', emoji: '🍞', title: 'Meta de Carboidratos Atingida!' });
    }
    if (totals.fats >= goals.fats * 0.95) {
      achieved.push({ type: 'fats', emoji: '🥑', title: 'Meta de Gorduras Atingida!' });
    }

    for (const goal of achieved) {
      await createNotification(goal);
    }
  }, [createNotification]);

  const checkDailyGoals = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('quiz_data')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      const today = new Date().toISOString().split('T')[0];
      const { data: meals, error: mealsError } = await supabase
        .from('meals')
        .select('calories, protein, carbs, fats')
        .eq('user_id', user.id)
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`);

      if (mealsError) throw mealsError;

      const totals = meals?.reduce((acc, meal) => ({
        calories: acc.calories + (meal.calories || 0),
        protein: acc.protein + (meal.protein || 0),
        carbs: acc.carbs + (meal.carbs || 0),
        fats: acc.fats + (meal.fats || 0),
      }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

      const goals = calculateGoals(profile?.quiz_data);

      setTodayProgress({
        totals,
        goals,
        percentages: {
          calories: ((totals.calories / goals.calories) * 100).toFixed(0),
          protein: ((totals.protein / goals.protein) * 100).toFixed(0),
          carbs: ((totals.carbs / goals.carbs) * 100).toFixed(0),
          fats: ((totals.fats / goals.fats) * 100).toFixed(0),
        }
      });

      checkAndNotifyGoals(totals, goals);
    } catch (error) {
      console.error('Erro ao verificar metas:', error);
    }
  }, [user, checkAndNotifyGoals]);

  const createLateMealNotification = useCallback(async (meal) => {
    if (!user?.id) return;

    const today = new Date().toISOString().split('T')[0];

    const { data: existing } = await supabase
      .from('notifications')
      .select('id')
      .eq('user_id', user.id)
      .eq('type', 'late_meal')
      .eq('ref_id', meal.id)
      .gte('created_at', `${today}T00:00:00`)
      .maybeSingle();

    if (existing) return;

    const readableName = meal.name || meal.meal_type || 'refeição';
    const title = 'Refeição atrasada';
    const message = `Você ainda não registrou a ${readableName} planejada. Que tal atualizar agora?`;

    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: user.id,
        type: 'late_meal',
        ref_id: meal.id,
        title,
        message,
        icon: '⏰',
        read: false,
        created_at: new Date().toISOString(),
      });

    if (!error) {
      await loadNotifications();
    }
  }, [user, loadNotifications]);

  const checkLateMeals = useCallback(async () => {
    if (!user?.id) return;

    try {
      const today = new Date().toISOString().split('T')[0];

      const { data: meals, error } = await supabase
        .from('meals')
        .select('id, name, meal_type, meal_date, created_at, consumed')
        .eq('user_id', user.id)
        .eq('meal_date', today);


      if (error) throw error;
      if (!meals || meals.length === 0) return;

      const now = new Date();

      for (const meal of meals) {
        if (meal.consumed) continue;

        const plannedAt = getPlannedDateTime(meal);
        const diffMs = now.getTime() - plannedAt.getTime();
        const diffMinutes = diffMs / (1000 * 60);

        if (diffMinutes >= LATE_TOLERANCE_MINUTES) {
          await createLateMealNotification(meal);
        }
      }
    } catch (err) {
      console.error('Erro ao checar refeições atrasadas:', err);
    }
  }, [user, createLateMealNotification]);

  const markAsRead = useCallback(async (notificationId) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (!error) {
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    }
  }, []);

  const clearAll = useCallback(() => {
    Alert.alert(
      'Limpar Notificações',
      'Tem certeza que deseja limpar todas as notificações?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase
              .from('notifications')
              .delete()
              .eq('user_id', user.id);

            if (!error) {
              setNotifications([]);
            }
          },
        },
      ]
    );
  }, [user]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      loadNotifications(),
      checkDailyGoals(),
      checkLateMeals(),
    ]);
    setRefreshing(false);
  }, [loadNotifications, checkDailyGoals, checkLateMeals]);

  useEffect(() => {
    loadNotifications();
    checkDailyGoals();
    checkLateMeals();
  }, [loadNotifications, checkDailyGoals, checkLateMeals]);

  return {
    notifications,
    loading,
    refreshing,
    todayProgress,
    markAsRead,
    clearAll,
    onRefresh
  };
}
