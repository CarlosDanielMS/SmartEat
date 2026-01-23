import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import { useNotifications } from './useNotifications';

export default function NotificationsScreen() {
  const {
    notifications,
    loading,
    refreshing,
    todayProgress,
    markAsRead,
    clearAll,
    onRefresh
  } = useNotifications();

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