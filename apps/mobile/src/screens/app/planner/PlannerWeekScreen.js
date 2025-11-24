import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mockWeekData } from '../../../data/plannerData';

// Componente para cada dia da semana
const DayCard = ({ dayData }) => {
  const isToday = new Date().getDay() === mockWeekData.indexOf(dayData); // Simulação

  return (
    <View style={[styles.card, isToday && styles.todayCard]}>
      <View style={styles.dayHeader}>
        <View>
          <Text style={styles.dayName}>{dayData.name}</Text>
          <Text style={styles.dayCalories}>{dayData.calories} Kcal</Text>
        </View>
        <TouchableOpacity onPress={() => Alert.alert('Modo Teste', 'API de "Refresh" não implementada.')}>
          <Text style={styles.actionIcon}>↻</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.mealInfo}>{dayData.meals} refeições planejadas</Text>
    </View>
  );
};

// --- Tela Principal (Semana) ---
export default function PlannerWeekScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {mockWeekData.map((day) => (
          <DayCard key={day.day} dayData={day} />
        ))}
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
  },
  todayCard: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dayCalories: {
    fontSize: 16,
    color: '#555',
  },
  actionIcon: {
    fontSize: 24,
    color: '#007AFF',
  },
  mealInfo: {
    fontSize: 14,
    color: '#888',
  },
});