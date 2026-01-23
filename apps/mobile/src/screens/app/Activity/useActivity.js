import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabase';

export function useActivity() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [yearData, setYearData] = useState({}); // { '2025-01': { kcal, protein, carbs, fats } }

  const year = new Date().getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const monthLabel = (m) =>
    new Date(year, m - 1, 1).toLocaleDateString('pt-BR', { month: 'long' });

  useEffect(() => {
    if (!user?.id) return;

    const load = async () => {
      try {
        setLoading(true);
        const start = `${year}-01-01`;
        const end = `${year}-12-31`;

        const { data, error } = await supabase
          .from('meals')
          .select('meal_date, calories, protein, carbs, fats')
          .eq('user_id', user.id)
          .gte('meal_date', start)
          .lte('meal_date', end);

        if (error) throw error;

        const map = {};
        (data || []).forEach((m) => {
          const monthKey = m.meal_date.slice(0, 7); // YYYY-MM
          if (!map[monthKey]) {
            map[monthKey] = { kcal: 0, protein: 0, carbs: 0, fats: 0 };
          }
          map[monthKey].kcal += m.calories || 0;
          map[monthKey].protein += m.protein || 0;
          map[monthKey].carbs += m.carbs || 0;
          map[monthKey].fats += m.fats || 0;
        });

        setYearData(map);
      } catch (e) {
        console.error(e);
        Alert.alert('Erro', 'Não foi possível carregar sua atividade.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user, year]);

  return {
    loading,
    yearData,
    year,
    months,
    monthLabel,
  };
}
