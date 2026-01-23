import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from '../styles';

export const WeekView = ({ weeklyData, selectedDate, onSelectDay }) => {
  const weekDays = [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado',
  ];
  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

  return (
    <ScrollView style={styles.weekScrollContainer}>
      {weekDays.map((day, index) => {
        const currentDay = new Date(startOfWeek);
        currentDay.setDate(startOfWeek.getDate() + index);
        const dateStr = currentDay.toISOString().split('T')[0];

        const dayData = weeklyData[dateStr] || { calorias: 0, meals: [] };
        const dayMeals = dayData.meals || [];
        const isToday =
          dateStr === new Date().toISOString().split('T')[0];

        return (
          <View key={index} style={styles.weekDaySection}>
            <View
              style={[
                styles.weekDayHeader,
                isToday && styles.weekDayHeaderToday,
              ]}
            >
              <View style={styles.weekDayHeaderLeft}>
                <Text
                  style={[
                    styles.weekDayTitle,
                    isToday && styles.weekDayTitleToday,
                  ]}
                >
                  {day}
                </Text>
                <Text style={styles.weekDaySubtitle}>
                  {currentDay.getDate()} de{' '}
                  {currentDay.toLocaleDateString('pt-BR', {
                    month: 'long',
                  })}
                </Text>
              </View>
              <View style={styles.weekDayHeaderRight}>
                <Text style={styles.weekDayCaloriesTotal}>
                  {dayData.calorias.toFixed(0)} kcal
                </Text>
                {isToday && (
                  <View style={styles.todayBadge}>
                    <Text style={styles.todayBadgeText}>Hoje</Text>
                  </View>
                )}
              </View>
            </View>

            {dayMeals.length > 0 ? (
              <View style={styles.weekMealsList}>
                <Text style={styles.weekMealsTitle}>
                  {dayMeals.length} refeições planejadas
                </Text>
                {dayMeals.map((meal, idx) => (
                  <View key={idx} style={styles.weekMealItem}>
                    <Text
                      style={[
                        styles.weekMealName,
                        meal.consumed && styles.weekMealConsumed,
                      ]}
                    >
                      {meal.consumed ? '✓ ' : '○ '}
                      {meal.name}
                    </Text>
                    <Text
                      style={[
                        styles.weekMealCalories,
                        meal.consumed && styles.weekMealConsumed,
                      ]}
                    >
                      {Math.round(meal.calories || 0)} kcal
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.weekMealsList}>
                <Text style={styles.weekMealEmpty}>
                  Nenhuma refeição planejada
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.viewDayButton}
              onPress={() => onSelectDay(currentDay)}
            >
              <Text style={styles.viewDayButtonText}>
                Ver detalhes completos →
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
};
