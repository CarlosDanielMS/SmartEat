import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useActivity } from './useActivity';
import styles from './styles';

export default function ActivityScreen() {
  const {
    loading,
    yearData,
    year,
    months,
    monthLabel,
  } = useActivity();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#4CAF50" />
        <Text style={styles.loadingText}>Carregando atividade...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Sua atividade em {year}</Text>
      <Text style={styles.subtitle}>
        Resumo mensal de calorias e macronutrientes
      </Text>

      {months.map((m) => {
        const key = `${year}-${String(m).padStart(2, '0')}`;
        const data = yearData[key];

        return (
          <View key={key} style={styles.monthCard}>
            <Text style={styles.monthTitle}>{monthLabel(m)}</Text>
            {data ? (
              <View>
                <Text style={styles.line}>
                  Calorias: <Text style={styles.value}>{Math.round(data.kcal)} kcal</Text>
                </Text>
                <Text style={styles.line}>
                  Proteína: <Text style={styles.value}>{Math.round(data.protein)} g</Text>
                </Text>
                <Text style={styles.line}>
                  Carboidratos:{' '}
                  <Text style={styles.value}>{Math.round(data.carbs)} g</Text>
                </Text>
                <Text style={styles.line}>
                  Gorduras: <Text style={styles.value}>{Math.round(data.fats)} g</Text>
                </Text>
              </View>
            ) : (
              <Text style={styles.empty}>Nenhum dado registrado neste mês.</Text>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}
