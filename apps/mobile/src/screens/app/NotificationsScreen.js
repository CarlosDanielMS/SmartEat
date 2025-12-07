import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

export default function NotificationsScreen() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [todayProgress, setTodayProgress] = useState(null);

  useEffect(() => {
    loadNotifications();
    checkDailyGoals();
  }, []);

  const loadNotifications = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // Buscar notificações da tabela (você precisa criar essa tabela)
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      
      if (data) {
        setNotifications(data);
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkDailyGoals = async () => {
    if (!user?.id) return;

    try {
      // Buscar perfil com metas
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('quiz_data')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Buscar consumo de hoje
      const today = new Date().toISOString().split('T')[0];
      const { data: meals, error: mealsError } = await supabase
        .from('meals')
        .select('calories, protein, carbs, fats')
        .eq('user_id', user.id)
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`);

      if (mealsError) throw mealsError;

      // Calcular totais do dia
      const totals = meals?.reduce((acc, meal) => ({
        calories: acc.calories + (meal.calories || 0),
        protein: acc.protein + (meal.protein || 0),
        carbs: acc.carbs + (meal.carbs || 0),
        fats: acc.fats + (meal.fats || 0),
      }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

      // Metas (calcular baseado no quiz_data ou usar valores padrão)
      const goals = calculateGoals(profile?.quiz_data);

      setTodayProgress({
        totals,
        goals,
        percentages: {
          calories: ((totals.calories / goals.calories) * 100).toFixed(0),
          protein: ((totals.protein / goals.protein) * 100).toFixed(0),
          carbs: ((totals.carbs / goals.carbs) * 100).toFixed(0),
          fats: ((totals.fats / goals.fats) * 100).toFixed(0),
        }
      });

      // Verificar se bateu alguma meta
      checkAndNotifyGoals(totals, goals);

    } catch (error) {
      console.error('Erro ao verificar metas:', error);
    }
  };

  const calculateGoals = (quizData) => {
    // Calcular metas baseado nos dados do quiz
    // Aqui é um exemplo simples, você pode refinar depois
    const weight = quizData?.['3'] || 70;
    const goal = quizData?.['2'] || 'maintain_weight';
    
    let calorieMultiplier = 35; // Manter peso
    if (goal === 'lose_weight') calorieMultiplier = 30;
    if (goal === 'gain_weight') calorieMultiplier = 40;

    const calories = weight * calorieMultiplier;
    
    return {
      calories: Math.round(calories),
      protein: Math.round(weight * 2), // 2g/kg
      carbs: Math.round(calories * 0.4 / 4), // 40% das calorias
      fats: Math.round(calories * 0.3 / 9), // 30% das calorias
    };
  };

  const checkAndNotifyGoals = async (totals, goals) => {
    const achieved = [];
    
    // Verificar quais metas foram batidas
    if (totals.calories >= goals.calories * 0.95 && totals.calories <= goals.calories * 1.05) {
      achieved.push({ type: 'calories', emoji: '🔥', title: 'Meta de Calorias Atingida!' });
    }
    if (totals.protein >= goals.protein * 0.95) {
      achieved.push({ type: 'protein', emoji: '💪', title: 'Meta de Proteínas Atingida!' });
    }
    if (totals.carbs >= goals.carbs * 0.95) {
      achieved.push({ type: 'carbs', emoji: '🍞', title: 'Meta de Carboidratos Atingida!' });
    }
    if (totals.fats >= goals.fats * 0.95) {
      achieved.push({ type: 'fats', emoji: '🥑', title: 'Meta de Gorduras Atingida!' });
    }

    // Criar notificações para metas atingidas
    for (const goal of achieved) {
      await createNotification(goal);
    }
  };

  const createNotification = async (goal) => {
    if (!user?.id) return;

    const today = new Date().toISOString().split('T')[0];
    
    // Verificar se já foi criada hoje
    const { data: existing } = await supabase
      .from('notifications')
      .select('id')
      .eq('user_id', user.id)
      .eq('type', goal.type)
      .gte('created_at', `${today}T00:00:00`)
      .maybeSingle();

    if (existing) return; // Já existe notificação de hoje

    // Criar nova notificação
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: user.id,
        type: goal.type,
        title: goal.title,
        message: `Parabéns! Você atingiu sua meta de ${goal.type === 'calories' ? 'calorias' : goal.type} hoje! 🎉`,
        icon: goal.emoji,
        read: false,
        created_at: new Date().toISOString(),
      });

    if (!error) {
      loadNotifications(); // Recarregar lista
    }
  };

  const markAsRead = async (notificationId) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (!error) {
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    }
  };

  const clearAll = () => {
    Alert.alert(
      'Limpar Notificações',
      'Tem certeza que deseja limpar todas as notificações?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase
              .from('notifications')
              .delete()
              .eq('user_id', user.id);

            if (!error) {
              setNotifications([]);
            }
          },
        },
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadNotifications(), checkDailyGoals()]);
    setRefreshing(false);
  };

  const renderProgressCard = () => {
    if (!todayProgress) return null;

    const { totals, goals, percentages } = todayProgress;

    return (
      <View style={styles.progressCard}>
        <Text style={styles.progressTitle}>📊 Progresso de Hoje</Text>
        
        <View style={styles.progressItem}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>🔥 Calorias</Text>
            <Text style={styles.progressValue}>
              {totals.calories} / {goals.calories} kcal ({percentages.calories}%)
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${Math.min(percentages.calories, 100)}%`, backgroundColor: percentages.calories >= 95 ? '#34C759' : '#007AFF' }]} />
          </View>
        </View>

        <View style={styles.progressItem}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>💪 Proteínas</Text>
            <Text style={styles.progressValue}>
              {totals.protein}g / {goals.protein}g ({percentages.protein}%)
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${Math.min(percentages.protein, 100)}%`, backgroundColor: percentages.protein >= 95 ? '#34C759' : '#FF9500' }]} />
          </View>
        </View>

        <View style={styles.progressItem}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>🍞 Carboidratos</Text>
            <Text style={styles.progressValue}>
              {totals.carbs}g / {goals.carbs}g ({percentages.carbs}%)
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${Math.min(percentages.carbs, 100)}%`, backgroundColor: percentages.carbs >= 95 ? '#34C759' : '#FFD60A' }]} />
          </View>
        </View>

        <View style={styles.progressItem}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>🥑 Gorduras</Text>
            <Text style={styles.progressValue}>
              {totals.fats}g / {goals.fats}g ({percentages.fats}%)
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${Math.min(percentages.fats, 100)}%`, backgroundColor: percentages.fats >= 95 ? '#34C759' : '#FF375F' }]} />
          </View>
        </View>
      </View>
    );
  };

  const renderNotification = (item) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.notificationItem, item.read && styles.notificationRead]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.notificationIcon}>
        <Text style={styles.notificationEmoji}>{item.icon || '🔔'}</Text>
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTime}>
          {new Date(item.created_at).toLocaleString('pt-BR')}
        </Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#34C759" />
          <Text style={styles.loadingText}>Carregando notificações...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Avisos</Text>
        {notifications.length > 0 && (
          <TouchableOpacity onPress={clearAll}>
            <Ionicons name="trash-outline" size={24} color="#FF375F" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderProgressCard()}

        <View style={styles.notificationsContainer}>
          {notifications.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-off-outline" size={80} color="#ccc" />
              <Text style={styles.emptyTitle}>Nenhuma notificação</Text>
              <Text style={styles.emptySubtitle}>
                Continue acompanhando suas metas diárias!
              </Text>
            </View>
          ) : (
            notifications.map(renderNotification)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  progressCard: {
    margin: 16,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  progressItem: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  progressValue: {
    fontSize: 12,
    color: '#666',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  notificationsContainer: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationRead: {
    opacity: 0.6,
  },
  notificationIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationEmoji: {
    fontSize: 24,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#34C759',
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});
