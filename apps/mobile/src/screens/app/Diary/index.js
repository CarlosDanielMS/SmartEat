import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { useDiary } from './useDiary';
import { MealCard } from './components/MealCard';
import { DateNavigation } from './components/DateNavigation';
import { SummaryCard } from './components/SummaryCard';

export default function DiaryScreen() {
  const {
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
  } = useDiary();

  if (loading && meals.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#34C759" />
          <Text style={styles.loadingText}>Carregando refeições...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Alimentação do Dia</Text>
          {!isToday && (
            <TouchableOpacity style={styles.todayButton} onPress={goToToday}>
              <Text style={styles.todayButtonText}>📅 Hoje</Text>
            </TouchableOpacity>
          )}
        </View>

        <DateNavigation
          selectedDate={selectedDate}
          changeDate={changeDate}
          isToday={isToday}
        />

        {meals.length > 0 && (
          <SummaryCard
            consumedCalories={consumedCalories}
            totalCalories={totalCalories}
            meals={meals}
          />
        )}

        {meals.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🍽️</Text>
            <Text style={styles.emptyTitle}>
              Nenhuma refeição planejada {isToday ? 'para hoje' : 'para este dia'}
            </Text>
            <Text style={styles.emptyText}>
              Acesse o <Text style={styles.emptyTextBold}>AutoPilot</Text> e clique em
              'Gerar 6 Refeições Diárias' para criar seu plano alimentar automaticamente.
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>
              {meals.length} Refeições do Dia
            </Text>

            {meals.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                toggleConsumed={toggleConsumed}
              />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
