import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { useAutopilot } from './useAutopilot';

export default function AutopilotScreen() {
  const {
    isEnabled,
    toggleAutopilot,
    loading,
    period,
    setPeriod,
    mealPlan,
    handleGenerateMeals,
    handleClearCache
  } = useAutopilot();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>AutoPilot IA 🤖</Text>
        <Text style={styles.subtitle}>
          6 refeições diárias com Tabela TACO 🇧🇷
        </Text>

        <View style={styles.optionCard}>
          <View style={styles.optionHeader}>
            <Text style={styles.optionTitle}>Habilitar AutoPilot</Text>
            <Switch
              value={isEnabled}
              onValueChange={toggleAutopilot}
              trackColor={{ false: '#767577', true: '#34C759' }}
              thumbColor={isEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>
          <Text style={styles.optionDescription}>
            A IA criará 6 refeições por dia usando alimentos brasileiros da Tabela TACO: Café, Lanche Manhã, Almoço, Lanche Tarde, Jantar e Ceia
          </Text>
        </View>

        {isEnabled && (
          <>
            <View style={styles.optionCard}>
              <Text style={styles.optionTitle}>Período do Plano</Text>
              <View style={styles.periodButtons}>
                <TouchableOpacity
                  style={[styles.periodButton, period === 'week' && styles.periodButtonActive]}
                  onPress={() => setPeriod('week')}
                >
                  <Text style={[styles.periodButtonText, period === 'week' && styles.periodButtonTextActive]}>
                    📅 Semanal (7 dias)
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.periodButton, period === 'month' && styles.periodButtonActive]}
                  onPress={() => setPeriod('month')}
                >
                  <Text style={[styles.periodButtonText, period === 'month' && styles.periodButtonTextActive]}>
                    📆 Mensal (30 dias)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.generateButton, loading && styles.buttonDisabled]}
              onPress={handleGenerateMeals}
              disabled={loading}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.loadingText}>Gerando com IA + TACO...</Text>
                </View>
              ) : (
                <Text style={styles.generateButtonText}>
                  🤖 Gerar Plano com TACO 🇧🇷
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.cacheButton} onPress={handleClearCache}>
              <Text style={styles.cacheButtonText}>🗑️ Limpar Cache</Text>
            </TouchableOpacity>

            {mealPlan && (
              <View style={styles.planPreview}>
                <Text style={styles.planTitle}>✓ Plano Gerado com TACO 🇧🇷</Text>
                <Text style={styles.planText}>
                  {mealPlan.totalDays} dias • 6 refeições/dia
                </Text>
                <Text style={styles.planText}>
                  Meta: {mealPlan.dailyCalorieTarget} calorias/dia
                </Text>
                <Text style={styles.planSubtext}>
                  Nutrientes calculados com precisão usando a Tabela TACO
                </Text>
                <Text style={styles.planSubtext}>
                  Acesse &quot;Alimentação&quot; para ver suas refeições.
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
