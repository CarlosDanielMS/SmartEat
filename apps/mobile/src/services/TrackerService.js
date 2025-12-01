import { supabase } from '../lib/supabase';

export const TrackerService = {
  
  // --- QUESTIONÁRIO & METAS ---
  
  // Salva as respostas do questionário e calcula a meta calórica inicial
  saveOnboardingData: async (userId, answers, calculatedGoals) => {
    const { error } = await supabase
      .from('profiles')
      .update({
        questionnaire_answers: answers,
        caloric_goal: calculatedGoals.calories,
        macro_goals: calculatedGoals.macros, // ex: { protein: 150, carbs: 200, fat: 50 }
      })
      .eq('id', userId);
    
    if (error) throw error;
  },

  // Busca as metas do usuário para exibir na Home
  getUserGoals: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('caloric_goal, macro_goals')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    return data;
  },

  // --- ALIMENTAÇÃO & DIÁRIO ---

  // Busca alimentos (para a tela de busca/adicionar)
  searchFoods: async (query) => {
    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .ilike('name', `%${query}%`) // Busca case-insensitive
      .limit(20);

    if (error) throw error;
    return data;
  },

  // Adiciona um alimento ao dia
  logFood: async (userId, foodItem, mealType, quantity = 1, date = new Date()) => {
    // Calcula os valores baseados na quantidade
    const calories = foodItem.calories * quantity;
    const macros = {
      protein: foodItem.protein * quantity,
      carbs: foodItem.carbs * quantity,
      fat: foodItem.fat * quantity
    };

    const { data, error } = await supabase
      .from('daily_logs')
      .insert({
        user_id: userId,
        food_id: foodItem.id,
        food_name: foodItem.name,
        date: date.toISOString().split('T')[0], // Formato YYYY-MM-DD
        meal_type: mealType,
        quantity: quantity,
        calories_consumed: calories,
        macros_consumed: macros
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // --- RELATÓRIOS & GRÁFICOS ---

  // Busca o consumo de um dia específico
  getDailyLog: async (userId, date) => {
    const formattedDate = date.toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('daily_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('date', formattedDate);

    if (error) throw error;
    
    // Agrupa por refeição para facilitar a exibição no frontend
    const summary = {
      breakfast: data.filter(d => d.meal_type === 'breakfast'),
      lunch: data.filter(d => d.meal_type === 'lunch'),
      dinner: data.filter(d => d.meal_type === 'dinner'),
      snack: data.filter(d => d.meal_type === 'snack'),
      totalCalories: data.reduce((acc, curr) => acc + (curr.calories_consumed || 0), 0),
      totalProtein: data.reduce((acc, curr) => acc + (curr.macros_consumed?.protein || 0), 0),
      totalCarbs: data.reduce((acc, curr) => acc + (curr.macros_consumed?.carbs || 0), 0),
      totalFat: data.reduce((acc, curr) => acc + (curr.macros_consumed?.fat || 0), 0),
    };

    return summary;
  },

  // Gera dados para o gráfico semanal
  getWeeklyReport: async (userId) => {
    // Lógica simples: pegar últimos 7 dias
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    const { data, error } = await supabase
      .from('daily_logs')
      .select('date, calories_consumed')
      .eq('user_id', userId)
      .gte('date', sevenDaysAgo.toISOString().split('T')[0])
      .lte('date', today.toISOString().split('T')[0]);

    if (error) throw error;

    // Agrupa os dados para o gráfico
    // Saída esperada: { "2023-10-01": 2100, "2023-10-02": 1800 ... }
    const report = {};
    data.forEach(entry => {
      if (!report[entry.date]) report[entry.date] = 0;
      report[entry.date] += entry.calories_consumed;
    });

    return report;
  }
};
```

### 3. Como usar no App

Agora, você pode conectar isso nas suas telas existentes. Aqui estão exemplos práticos:

#### A. Salvando o Questionário (No final do Quiz)
No seu `QuizStepScreen.js` ou onde você finaliza o questionário:

```javascript
import { TrackerService } from '../../services/TrackerService';
import { useAuth } from '../../context/AuthContext';

// ... dentro do componente
const { user } = useAuth();

const handleFinishQuiz = async (answers) => {
  // Exemplo de cálculo simples de meta (você pode usar sua lógica complexa aqui)
  const calculatedGoals = {
    calories: 2500, 
    macros: { protein: 180, carbs: 250, fat: 80 }
  };

  try {
    await TrackerService.saveOnboardingData(user.id, answers, calculatedGoals);
    navigation.navigate('Home');
  } catch (error) {
    console.error("Erro ao salvar quiz:", error);
  }
};
```

#### B. Tela de Dashboard / Home (Mostrando Progresso)
Para mostrar o gráfico ou as calorias do dia na `HomeScreen.js`:

```javascript
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { TrackerService } from '../../services/TrackerService';
import { useAuth } from '../../context/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();
  const [todayData, setTodayData] = useState(null);
  const [goals, setGoals] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      // 1. Pega as metas do usuário
      const userGoals = await TrackerService.getUserGoals(user.id);
      setGoals(userGoals);

      // 2. Pega o consumo de hoje
      const log = await TrackerService.getDailyLog(user.id, new Date());
      setTodayData(log);
    };

    fetchData();
  }, [user]);

  if (!todayData || !goals) return <Text>Carregando...</Text>;

  return (
    <View>
      <Text>Calorias: {todayData.totalCalories} / {goals.caloric_goal}</Text>
      <Text>Proteínas: {todayData.totalProtein.toFixed(0)}g</Text>
      {/* Aqui você pode inserir um componente de Gráfico usando esses dados */}
    </View>
  );
}