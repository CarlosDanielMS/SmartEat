// apps/mobile/src/screens/app/AutopilotScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateMealPlan, clearMealPlanCache } from '../../services/groqService';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

export default function AutopilotScreen() {
  const { user } = useAuth();
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState('week');
  const [mealPlan, setMealPlan] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem('autopilot_enabled');
      if (saved !== null) {
        setIsEnabled(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const toggleAutopilot = async (value) => {
    try {
      setIsEnabled(value);
      await AsyncStorage.setItem('autopilot_enabled', JSON.stringify(value));
      
      if (value) {
        Alert.alert(
          'AutoPilot Ativado! 🤖',
          'A IA criará 6 refeições diárias personalizadas usando alimentos da Tabela TACO.'
        );
      }
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
    }
  };

  const populateDailyMeals = async (plan, userId, mealPlanId) => {
    try {
      console.log('📅 Populando refeições diárias no banco de dados...');
      
      // ✅ PASSO 1: Buscar datas do plano
      const dates = plan.days.map(day => day.date);
      console.log(`📅 Datas do plano: ${dates[0]} até ${dates[dates.length - 1]}`);
      
      // ✅ PASSO 2: DELETAR refeições existentes nessas datas
      console.log('🗑️ Removendo refeições antigas dessas datas...');
      const { error: deleteError } = await supabase
        .from('meals')
        .delete()
        .eq('user_id', userId)
        .in('meal_date', dates);
      
      if (deleteError) {
        console.error('❌ Erro ao deletar refeições antigas:', deleteError);
        throw deleteError;
      }
      
      console.log('✓ Refeições antigas removidas');
      
      // ✅ PASSO 3: Inserir novas refeições COM NUTRIENTES DA TACO
      const mealsToInsert = [];

      for (let i = 0; i < plan.days.length; i++) {
        const dayData = plan.days[i];

        for (const meal of dayData.meals) {
          mealsToInsert.push({
            user_id: userId,
            meal_plan_id: mealPlanId,
            meal_date: dayData.date,
            meal_type: meal.type,
            name: meal.name,
            calories: meal.calories || 0,
            protein: meal.macros?.protein || 0,
            carbs: meal.macros?.carbs || 0,
            fats: meal.macros?.fats || 0,
            ingredients: meal.ingredients || [],
            instructions: meal.instructions || '',
            consumed: false,
          });
        }
      }

      console.log(`📝 Inserindo ${mealsToInsert.length} refeições com nutrientes da TACO...`);
      
      const { error } = await supabase
        .from('meals')
        .insert(mealsToInsert);

      if (error) {
        console.error('❌ Erro ao inserir refeições:', error);
        throw error;
      }
      
      console.log(`✓ ${mealsToInsert.length} refeições adicionadas (${mealsToInsert.length / plan.days.length} por dia)!`);
      console.log('✓ Macros e micros calculados usando Tabela TACO 🇧🇷');
      
      return mealsToInsert.length;
    } catch (error) {
      console.error('❌ Erro ao popular refeições diárias:', error);
      throw error;
    }
  };

  const handleGenerateMeals = async () => {
    if (!isEnabled) {
      Alert.alert('AutoPilot Desabilitado', 'Ative o AutoPilot primeiro.');
      return;
    }

    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado.');
      return;
    }

    setLoading(true);
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('quiz_data, full_name')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      if (!profile || !profile.quiz_data || Object.keys(profile.quiz_data).length === 0) {
        Alert.alert('Perfil Incompleto', 'Complete o questionário primeiro.');
        return;
      }

      const toNumber = (v, def) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : def;
      };
      
      const clamp = (val, min, max, def) => {
        if (!Number.isFinite(val)) return def;
        return Math.min(Math.max(val, min), max);
      };

      const weight = clamp(toNumber(profile.quiz_data['3'], 70), 35, 250, 70);
      const age = clamp(toNumber(profile.quiz_data['4'], 25), 12, 100, 25);
      const height = clamp(toNumber(profile.quiz_data['5'], 170), 120, 220, 170);

      const goalCode = profile.quiz_data['2'];
      const genderCode = profile.quiz_data['1'];

      const userProfile = {
        gender: genderCode === 'male' ? 'masculino' : 'feminino',
        age,
        weight,
        height,
        goal:
          goalCode === 'lose_weight'
            ? 'perder peso'
            : goalCode === 'gain_weight'
            ? 'ganhar peso'
            : 'manter peso',
        activityLevel: 'moderado',
        restrictions: 'nenhuma',
      };

      console.log('👤 Perfil do usuário:', userProfile);

      const plan = await generateMealPlan(userProfile, period, {});
      setMealPlan(plan);

      const { data: savedPlan, error: savePlanError } = await supabase
        .from('meal_plans')
        .insert({
          user_id: user.id,
          plan_data: plan,
          period: period,
          is_active: true,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (savePlanError) throw savePlanError;

      console.log('✓ Plano salvo no banco de dados');

      const mealsCount = await populateDailyMeals(plan, user.id, savedPlan.id);
      
      Alert.alert(
        'Sucesso! 🎉',
        `Plano ${period === 'week' ? 'semanal' : 'mensal'} criado com TACO!\n\n✓ ${mealsCount} refeições geradas\n✓ 6 refeições por dia\n✓ Nutrientes da Tabela TACO 🇧🇷\n✓ Salvo no banco\n\nAcesse "Alimentação" para visualizar.`,
        [{ text: 'OK' }]
      );

    } catch (error) {
      console.error('Erro ao gerar plano:', error);
      Alert.alert('Erro', error.message || 'Não foi possível gerar o plano.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = async () => {
    Alert.alert(
      'Limpar Cache',
      'Deseja limpar o cache e gerar um novo plano?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            await clearMealPlanCache();
            setMealPlan(null);
            Alert.alert('Sucesso', 'Cache limpo!');
          }
        }
      ]
    );
  };

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
                  Acesse "Alimentação" para ver suas refeições.
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  content: { padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 24 },
  optionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  optionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 8 },
  optionDescription: { fontSize: 14, color: '#666', lineHeight: 20 },
  periodButtons: { flexDirection: 'row', gap: 12, marginTop: 12 },
  periodButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  periodButtonActive: { backgroundColor: '#34C759', borderColor: '#34C759' },
  periodButtonText: { fontSize: 14, color: '#666', fontWeight: '500', textAlign: 'center' },
  periodButtonTextActive: { color: '#fff' },
  generateButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  generateButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  loadingContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  loadingText: { color: '#fff', fontSize: 16, marginLeft: 10 },
  cacheButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  cacheButtonText: { color: '#666', fontSize: 14, fontWeight: '600' },
  planPreview: {
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  planTitle: { fontSize: 18, fontWeight: '600', color: '#2e7d32', marginBottom: 8 },
  planText: { fontSize: 16, color: '#1b5e20', lineHeight: 22, marginBottom: 4 },
  planSubtext: { fontSize: 14, color: '#2e7d32', lineHeight: 20, marginTop: 8, fontStyle: 'italic' },
});
