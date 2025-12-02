// apps/mobile/src/screens/app/DiaryScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export default function DiaryScreen() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const dateStr = selectedDate.toISOString().split('T')[0];

  const loadMeals = async () => {
    if (!user) {
      console.log('❌ Usuário não autenticado');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      console.log(`📊 Carregando refeições para ${dateStr}...`);
      
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', user.id)
        .eq('meal_date', dateStr)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('❌ Erro ao carregar refeições:', error);
        throw error;
      }
      
      console.log(`✓ ${data?.length || 0} refeições encontradas para ${dateStr}`);
      
      // Ordenar por tipo de refeição
      const mealOrder = ['breakfast', 'morning_snack', 'lunch', 'afternoon_snack', 'dinner', 'supper'];
      const sortedMeals = (data || []).sort((a, b) => {
        return mealOrder.indexOf(a.meal_type) - mealOrder.indexOf(b.meal_type);
      });
      
      setMeals(sortedMeals);
    } catch (error) {
      console.error('❌ Erro ao carregar refeições:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMeals();
    setRefreshing(false);
  };

  useEffect(() => {
    loadMeals();
  }, [selectedDate, user]);

  useFocusEffect(
    useCallback(() => {
      console.log('🔄 Tela focada, recarregando refeições...');
      loadMeals();
    }, [selectedDate, user])
  );

  const toggleConsumed = async (mealId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('meals')
        .update({ consumed: !currentStatus })
        .eq('id', mealId);

      if (error) throw error;
      
      console.log(`✓ Refeição marcada como ${!currentStatus ? 'consumida' : 'não consumida'}`);
      await loadMeals();
    } catch (error) {
      console.error('❌ Erro ao atualizar refeição:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a refeição.');
    }
  };

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const totalCalories = meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
  const consumedCalories = meals
    .filter(m => m.consumed)
    .reduce((sum, meal) => sum + (meal.calories || 0), 0);

  const mealTypeLabels = {
    breakfast: '☀️ Café da Manhã',
    morning_snack: '🍎 Lanche da Manhã',
    lunch: '🍽️ Almoço',
    afternoon_snack: '🥤 Lanche da Tarde',
    dinner: '🌙 Jantar',
    supper: '🌜 Ceia',
  };

  const isToday = dateStr === new Date().toISOString().split('T')[0];

  if (loading) {
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
        
        {/* Navegação de data */}
        <View style={styles.dateNavigation}>
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => changeDate(-1)}
          >
            <Text style={styles.dateButtonText}>← Anterior</Text>
          </TouchableOpacity>
          
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>
              {selectedDate.toLocaleDateString('pt-BR', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
              })}
            </Text>
            {isToday && <Text style={styles.todayBadge}>Hoje</Text>}
          </View>
          
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => changeDate(1)}
          >
            <Text style={styles.dateButtonText}>Próximo →</Text>
          </TouchableOpacity>
        </View>

        {/* Resumo */}
        {meals.length > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Resumo Nutricional</Text>
            <Text style={styles.summaryText}>
              {consumedCalories} / {totalCalories} calorias
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min((consumedCalories / (totalCalories || 1)) * 100, 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.summarySubtext}>
              {meals.filter(m => m.consumed).length} de {meals.length} refeições consumidas
            </Text>
          </View>
        )}

        {/* Lista de refeições */}
        {meals.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🍽️</Text>
            <Text style={styles.emptyTitle}>
              Nenhuma refeição planejada {isToday ? 'para hoje' : 'para este dia'}
            </Text>
            <Text style={styles.emptyText}>
              Acesse o <Text style={styles.emptyTextBold}>AutoPilot</Text> e clique em "Gerar 6 Refeições Diárias" para criar seu plano alimentar automaticamente
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>
              {meals.length} Refeições do Dia
            </Text>
            
            {meals.map((meal) => (
              <View key={meal.id} style={styles.mealCard}>
                <View style={styles.mealHeader}>
                  <View>
                    <Text style={styles.mealType}>
                      {mealTypeLabels[meal.meal_type] || meal.meal_type}
                    </Text>
                    <Text style={styles.mealName}>{meal.name}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => toggleConsumed(meal.id, meal.consumed)}
                    style={[styles.checkbox, meal.consumed && styles.checkboxChecked]}
                  >
                    <Text style={styles.checkboxText}>
                      {meal.consumed ? '✅' : '⬜'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.macros}>
                  <View style={styles.macroItem}>
                    <Text style={styles.macroValue}>{meal.calories}</Text>
                    <Text style={styles.macroLabel}>kcal</Text>
                  </View>
                  <View style={styles.macroItem}>
                    <Text style={styles.macroValue}>{meal.protein}g</Text>
                    <Text style={styles.macroLabel}>proteína</Text>
                  </View>
                  <View style={styles.macroItem}>
                    <Text style={styles.macroValue}>{meal.carbs}g</Text>
                    <Text style={styles.macroLabel}>carbo</Text>
                  </View>
                  <View style={styles.macroItem}>
                    <Text style={styles.macroValue}>{meal.fats}g</Text>
                    <Text style={styles.macroLabel}>gordura</Text>
                  </View>
                </View>

                {meal.ingredients && meal.ingredients.length > 0 && (
                  <View style={styles.ingredients}>
                    <Text style={styles.ingredientsTitle}>📋 Ingredientes:</Text>
                    {meal.ingredients.slice(0, 3).map((ing, idx) => (
                      <Text key={idx} style={styles.ingredientItem}>
                        • {ing.name} - {ing.quantity}
                      </Text>
                    ))}
                    {meal.ingredients.length > 3 && (
                      <Text style={styles.ingredientItem}>
                        ... e mais {meal.ingredients.length - 3} ingredientes
                      </Text>
                    )}
                  </View>
                )}

                {meal.instructions && (
                  <View style={styles.instructions}>
                    <Text style={styles.instructionsTitle}>👨‍🍳 Modo de Preparo:</Text>
                    <Text style={styles.instructionsText} numberOfLines={3}>
                      {meal.instructions}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  content: { padding: 20, paddingBottom: 40 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#666', fontSize: 16 },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  todayButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  todayButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  
  dateNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dateButton: { padding: 8 },
  dateButtonText: { fontSize: 14, color: '#007AFF', fontWeight: '600' },
  dateContainer: { alignItems: 'center' },
  dateText: { fontSize: 16, color: '#333', fontWeight: '600', textTransform: 'capitalize' },
  todayBadge: { fontSize: 12, color: '#34C759', fontWeight: '600', marginTop: 4 },
  
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: { fontSize: 16, fontWeight: '600', color: '#666', marginBottom: 8 },
  summaryText: { fontSize: 28, fontWeight: 'bold', color: '#34C759', marginBottom: 12 },
  progressBar: { height: 12, backgroundColor: '#e0e0e0', borderRadius: 6, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', backgroundColor: '#34C759', borderRadius: 6 },
  summarySubtext: { fontSize: 14, color: '#666' },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  
  emptyState: { alignItems: 'center', paddingVertical: 80 },
  emptyIcon: { fontSize: 80, marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: '#333', marginBottom: 12, textAlign: 'center', paddingHorizontal: 20 },
  emptyText: { fontSize: 15, color: '#666', textAlign: 'center', paddingHorizontal: 30, lineHeight: 22 },
  emptyTextBold: { fontWeight: '700', color: '#007AFF' },
  
  mealCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  mealHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  mealType: { fontSize: 14, fontWeight: '600', color: '#007AFF', marginBottom: 4 },
  mealName: { fontSize: 18, fontWeight: 'bold', color: '#333', maxWidth: 250 },
  checkbox: { padding: 8 },
  checkboxChecked: { backgroundColor: '#e8f5e9', borderRadius: 8 },
  checkboxText: { fontSize: 28 },
  
  macros: { 
    flexDirection: 'row', 
    justifyContent: 'space-around',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  macroItem: { alignItems: 'center' },
  macroValue: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 2 },
  macroLabel: { fontSize: 11, color: '#666', textTransform: 'uppercase' },
  
  ingredients: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  ingredientsTitle: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  ingredientItem: { fontSize: 14, color: '#666', marginBottom: 4, lineHeight: 20 },
  
  instructions: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  instructionsTitle: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  instructionsText: { fontSize: 14, color: '#666', lineHeight: 20 },
});
