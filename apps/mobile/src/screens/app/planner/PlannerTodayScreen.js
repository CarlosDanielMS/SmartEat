import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart } from 'react-native-chart-kit';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { mockTodayData } from '../../../data/plannerData';

const screenWidth = Dimensions.get('window').width;

// Gráfico de Macros (Pizza)
const MacroChart = ({ data }) => {
  const chartData = [
    {
      name: 'Prot',
      population: data.protein,
      color: 'hsl(185, 90%, 37.5%)',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'Carb',
      population: data.carbs,
      color: 'hsl(44, 86%, 45%)',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'Gord',
      population: data.fat,
      color: 'hsl(260, 48%, 50%)',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
  ];

  const chartConfig = {
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  };

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.sectionTitle}>Macros do Dia (g)</Text>
      <PieChart
        data={chartData}
        width={screenWidth - 40}
        height={180}
        chartConfig={chartConfig}
        accessor={'population'}
        backgroundColor={'transparent'}
        paddingLeft={'15'}
        absolute
      />
    </View>
  );
};

// Item de Comida
const FoodItem = ({ item, onToggleCheck }) => {
  return (
    <View style={styles.foodItem}>
      <BouncyCheckbox
        size={25}
        fillColor="#007AFF"
        unfillColor="#FFFFFF"
        iconStyle={{ borderColor: '#007AFF' }}
        innerIconStyle={{ borderWidth: 2 }}
        isChecked={item.checked}
        onPress={() => onToggleCheck(item.id)}
      />
      <Image source={{ uri: item.image }} style={styles.foodImage} />
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.foodPortion}>{item.portion}</Text>
      </View>
      <View style={styles.foodActions}>
        <TouchableOpacity onPress={() => Alert.alert('Modo Teste', 'API de "Trocar Alimento" não implementada.')}>
          <Text style={styles.actionIcon}>⇄</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Alert.alert('Modo Teste', 'API de "Refresh" não implementada.')}>
          <Text style={styles.actionIcon}>↻</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Card de Refeição
const MealCard = ({ meal, onToggleCheck }) => {
  return (
    <View style={styles.card}>
      <View style={styles.mealHeader}>
        <Text style={styles.mealName}>{meal.name}</Text>
        <Text style={styles.mealCalories}>{meal.calories} Kcal</Text>
        <TouchableOpacity onPress={() => Alert.alert('Modo Teste', 'API de "Adicionar Alimento" não implementada.')}>
          <Text style={styles.actionIcon}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.foodList}>
        {meal.foods.length > 0 ? (
          meal.foods.map((food) => (
            <FoodItem key={food.id} item={food} onToggleCheck={onToggleCheck} />
          ))
        ) : (
          <Text style={styles.emptyMealText}>Clique no + para adicionar alimentos</Text>
        )}
      </View>
    </View>
  );
};

// --- Tela Principal (Hoje) ---
export default function PlannerTodayScreen() {
  const [plannerData, setPlannerData] = useState(mockTodayData);

  // Atualiza o total de calorias consumidas (simulação)
  const calculateCaloriesEaten = (meals) => {
    let total = 0;
    meals.forEach(meal => {
      meal.foods.forEach(food => {
        if (food.checked) {
          total += food.calories;
        }
      });
    });
    return total;
  };

  // Função para marcar/desmarcar um item
  const handleToggleCheck = (foodId) => {
    const newPlannerData = { ...plannerData };
    let newTotalEaten = 0;

    newPlannerData.meals = newPlannerData.meals.map(meal => {
      meal.foods = meal.foods.map(food => {
        if (food.id === foodId) {
          food.checked = !food.checked;
        }
        if (food.checked) {
          newTotalEaten += food.calories;
        }
        return food;
      });
      return meal;
    });

    newPlannerData.calories.eaten = newTotalEaten;
    setPlannerData(newPlannerData);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.caloriesText}>
            <Text style={styles.caloriesEaten}>{Math.round(plannerData.calories.eaten)}</Text>
            / {plannerData.calories.target} Kcal
          </Text>
          <TouchableOpacity onPress={() => Alert.alert('Modo Teste', 'API de "Refresh" não implementada.')}>
            <Text style={styles.actionIcon}>↻</Text>
          </TouchableOpacity>
        </View>

        {plannerData.meals.map((meal) => (
          <MealCard key={meal.id} meal={meal} onToggleCheck={handleToggleCheck} />
        ))}
        
        <MacroChart data={plannerData.macros} />
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  container: {
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
  },
  caloriesText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  caloriesEaten: {
    color: '#007AFF',
    fontSize: 24,
  },
  actionIcon: {
    fontSize: 24,
    color: '#007AFF',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mealCalories: {
    fontSize: 16,
    color: '#555',
  },
  foodList: {
    marginTop: 10,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  foodImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
  },
  foodPortion: {
    fontSize: 14,
    color: '#888',
  },
  foodActions: {
    flexDirection: 'row',
  },
  emptyMealText: {
    textAlign: 'center',
    color: '#888',
    padding: 10,
  },
  chartContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});