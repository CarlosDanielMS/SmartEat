// apps/mobile/src/screens/app/planner/PlannerTodayScreen.js
import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Dimensions, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart } from 'react-native-chart-kit';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { supabase } from '../../../lib/supabase'; // Importe o supabase
import { useFocusEffect } from '@react-navigation/native'; // Para recarregar ao voltar para tela

const screenWidth = Dimensions.get('window').width;

// ... (Mantenha os componentes MacroChart e FoodItem iguais ao seu arquivo original) ...
// Vou reimplementar apenas o componente principal e a lógica de dados

const MacroChart = ({ data }) => {
    // ... (Copie o código do seu componente MacroChart original aqui)
    // Apenas certifique-se que data.protein, data.carbs etc não sejam undefined (use || 0)
    const chartData = [
        { name: 'Prot', population: data?.protein || 0, color: 'hsl(185, 90%, 37.5%)', legendFontColor: '#7F7F7F', legendFontSize: 12 },
        { name: 'Carb', population: data?.carbs || 0, color: 'hsl(44, 86%, 45%)', legendFontColor: '#7F7F7F', legendFontSize: 12 },
        { name: 'Gord', population: data?.fat || 0, color: 'hsl(260, 48%, 50%)', legendFontColor: '#7F7F7F', legendFontSize: 12 },
    ];
    // ... restante do chart
    const chartConfig = { color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})` };
    return (
        <View style={styles.chartContainer}>
            <Text style={styles.sectionTitle}>Macros do Dia (g)</Text>
            <PieChart data={chartData} width={screenWidth - 40} height={180} chartConfig={chartConfig} accessor={'population'} backgroundColor={'transparent'} paddingLeft={'15'} absolute />
        </View>
    );
};

const FoodItem = ({ item, onToggleCheck }) => {
     // ... (Copie o código do seu componente FoodItem original aqui)
    return (
    <View style={styles.foodItem}>
      <BouncyCheckbox
        size={25} fillColor="#007AFF" unfillColor="#FFFFFF" iconStyle={{ borderColor: '#007AFF' }} innerIconStyle={{ borderWidth: 2 }}
        isChecked={item.is_checked} // Mudado de .checked para .is_checked (banco de dados)
        onPress={() => onToggleCheck(item.log_id, item.is_checked)} // Passa o ID do log e status atual
      />
      <Image source={{ uri: item.image_url || 'https://via.placeholder.com/100' }} style={styles.foodImage} />
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.foodPortion}>{item.portion}</Text>
      </View>
       {/* ... botões de ação ... */}
    </View>
  );
};

const MealCard = ({ mealName, foods, onToggleCheck }) => {
  // Calcula calorias totais dessa refeição
  const mealCalories = foods.reduce((acc, food) => acc + Number(food.calories), 0);

  return (
    <View style={styles.card}>
      <View style={styles.mealHeader}>
        <Text style={styles.mealName}>{mealName}</Text>
        <Text style={styles.mealCalories}>{mealCalories} Kcal</Text>
        <TouchableOpacity onPress={() => Alert.alert('Adicionar', `Adicionar em ${mealName}`)}>
          <Text style={styles.actionIcon}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.foodList}>
        {foods.length > 0 ? (
          foods.map((food) => (
            <FoodItem key={food.log_id} item={food} onToggleCheck={onToggleCheck} />
          ))
        ) : (
          <Text style={styles.emptyMealText}>Clique no + para adicionar alimentos</Text>
        )}
      </View>
    </View>
  );
};

export default function PlannerTodayScreen() {
  const [loading, setLoading] = useState(true);
  const [mealsData, setMealsData] = useState({});
  const [dailyStats, setDailyStats] = useState({
    eaten: 0,
    target: 2500,
    macros: { protein: 0, carbs: 0, fat: 0 }
  });

  const fetchDailyData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Busca os registros do dia atual (daily_logs) juntando com a tabela foods
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

      const { data, error } = await supabase
        .from('daily_logs')
        .select(`
          id,
          meal_type,
          is_checked,
          foods (
            id, name, calories, portion, image_url, macros_protein, macros_carbs, macros_fat
          )
        `)
        .eq('user_id', user.id)
        .eq('date', today);

      if (error) throw error;

      // Processar dados para o formato da UI
      const organizedMeals = {
        'Café da Manhã': [], 'Lanche da Manhã': [], 'Almoço': [],
        'Lanche da Tarde': [], 'Jantar': [], 'Ceia': []
      };

      let totalCalories = 0;
      let totalProtein = 0;
      let totalCarbs = 0;
      let totalFat = 0;

      data.forEach(log => {
        const food = log.foods;
        const foodItem = {
            ...food,
            log_id: log.id, // ID único do registro (não do alimento)
            is_checked: log.is_checked
        };

        if (organizedMeals[log.meal_type]) {
            organizedMeals[log.meal_type].push(foodItem);
        }

        // Só soma se estiver marcado como consumido
        if (log.is_checked) {
            totalCalories += Number(food.calories);
            totalProtein += Number(food.macros_protein || 0);
            totalCarbs += Number(food.macros_carbs || 0);
            totalFat += Number(food.macros_fat || 0);
        }
      });

      setMealsData(organizedMeals);
      setDailyStats({
          eaten: totalCalories,
          target: 2500, // Isso poderia vir de uma tabela 'user_goals'
          macros: { protein: totalProtein, carbs: totalCarbs, fat: totalFat }
      });

    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  // UseFocusEffect garante que os dados atualizem quando a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      fetchDailyData();
    }, [])
  );

  const handleToggleCheck = async (logId, currentStatus) => {
    try {
        // 1. Atualização Otimista (UI primeiro)
        // (Opcional, para simplificar, vamos apenas chamar o banco e recarregar)
        
        // 2. Atualizar no Supabase
        const { error } = await supabase
            .from('daily_logs')
            .update({ is_checked: !currentStatus })
            .eq('id', logId);

        if (error) throw error;

        // 3. Recarregar dados
        fetchDailyData();

    } catch (error) {
        Alert.alert('Erro ao atualizar', error.message);
    }
  };

  if (loading) {
      return (
          <SafeAreaView style={[styles.safeArea, {justifyContent: 'center', alignItems: 'center'}]}>
              <ActivityIndicator size="large" color="#007AFF" />
          </SafeAreaView>
      );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.caloriesText}>
            <Text style={styles.caloriesEaten}>{Math.round(dailyStats.eaten)}</Text>
            / {dailyStats.target} Kcal
          </Text>
          <TouchableOpacity onPress={fetchDailyData}>
            <Text style={styles.actionIcon}>↻</Text>
          </TouchableOpacity>
        </View>

        {Object.keys(mealsData).map((mealType) => (
          <MealCard 
            key={mealType} 
            mealName={mealType} 
            foods={mealsData[mealType]} 
            onToggleCheck={handleToggleCheck} 
          />
        ))}
        
        <MacroChart data={dailyStats.macros} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ... (Mantenha os estilos existentes no styles)
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f0f0f0' },
  container: { padding: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 8, marginBottom: 10 },
  caloriesText: { fontSize: 20, fontWeight: 'bold' },
  caloriesEaten: { color: '#007AFF', fontSize: 24 },
  actionIcon: { fontSize: 24, color: '#007AFF' },
  card: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 16 },
  mealHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10 },
  mealName: { fontSize: 18, fontWeight: 'bold' },
  mealCalories: { fontSize: 16, color: '#555' },
  foodList: { marginTop: 10 },
  foodItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  foodImage: { width: 50, height: 50, borderRadius: 8, marginHorizontal: 10 },
  foodInfo: { flex: 1 },
  foodName: { fontSize: 16 },
  foodPortion: { fontSize: 14, color: '#888' },
  foodActions: { flexDirection: 'row' },
  emptyMealText: { textAlign: 'center', color: '#888', padding: 10 },
  chartContainer: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, padding: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
});