import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles';

export function SummaryCard({ consumedCalories, totalCalories, meals }) {
  const progress = totalCalories > 0 ? consumedCalories / totalCalories : 0;

  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>Resumo Nutricional</Text>

      <Text style={styles.summaryText}>
        {consumedCalories} / {totalCalories} calorias
      </Text>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${Math.min(progress, 1) * 100}%` }]} />
      </View>

      <Text style={styles.summarySubtext}>
        {meals.filter((m) => m.consumed).length} de {meals.length} refeições consumidas
      </Text>
    </View>
  );
}
