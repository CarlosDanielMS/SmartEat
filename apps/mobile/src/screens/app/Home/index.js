import React from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHome } from './useHome';
import { styles } from './styles';
import { NutrientBar } from './components/NutrientBar';
import { MealCard } from './components/MealCard';
import { WeekView } from './components/WeekView';
import { MonthView } from './components/MonthView';

export default function HomeScreen({ navigation }) {
  const {
    userRole,
    profile,
    refreshing,
    selectedTab,
    setSelectedTab,
    selectedDate,
    setSelectedDate,
    loading,
    nutritionGoals,
    dailyMacros,
    dailyMicros,
    meals,
    weeklyData,
    monthlyData,
    onRefresh,
    changeDate,
    handleMealPress,
    handleToggleComplete,
  } = useHome(navigation);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={{ marginTop: 10, color: '#666' }}>Carregando...</Text>
      </View>
    );
  }

  const goals = nutritionGoals || {
    calorias_meta: 2000,
    proteinas_meta: 150,
    carboidratos_meta: 250,
    gorduras_meta: 65,
    vitamina_c_meta: 90,
    ferro_meta: 18,
    calcio_meta: 1000,
    vitamina_d_meta: 15,
  };

  const TabButton = ({ title, value }) => (
    <TouchableOpacity
      style={[styles.tabButton, selectedTab === value && styles.tabButtonActive]}
      onPress={() => setSelectedTab(value)}
    >
      <Text
        style={[styles.tabText, selectedTab === value && styles.tabTextActive]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>
            Seja Bem-Vindo, {profile?.full_name || 'Usuário'}! 👋
          </Text>
          <View style={styles.dateNavigator}>
            <TouchableOpacity onPress={() => changeDate(-1)}>
              <Ionicons name="chevron-back" size={24} color="#4CAF50" />
            </TouchableOpacity>
            <Text style={styles.date}>
              {selectedDate.toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </Text>
            <TouchableOpacity onPress={() => changeDate(1)}>
              <Ionicons name="chevron-forward" size={24} color="#4CAF50" />
            </TouchableOpacity>
          </View>
        </View>
        {userRole === 'admin' && (
          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeText}>Admin</Text>
          </View>
        )}
      </View>

      <View style={styles.tabContainer}>
        <TabButton title="Dia" value="dia" />
        <TabButton title="Semana" value="semana" />
        <TabButton title="Mês" value="mes" />
      </View>

      {selectedTab === 'semana' && (
        <WeekView
          weeklyData={weeklyData}
          selectedDate={selectedDate}
          onSelectDay={(date) => {
            setSelectedDate(date);
            setSelectedTab('dia');
          }}
        />
      )}

      {selectedTab === 'mes' && (
        <MonthView
          monthlyData={monthlyData}
          selectedDate={selectedDate}
          onSelectDay={(date) => {
            setSelectedDate(date);
            setSelectedTab('dia');
          }}
        />
      )}

      {selectedTab === 'dia' && (
        <>
          <View style={styles.caloriesCard}>
            <Text style={styles.sectionTitle}>Resumo Calórico</Text>
            <View style={styles.caloriesRow}>
              <View style={styles.calorieItem}>
                <Text style={styles.calorieValue}>
                  {dailyMacros.calorias.toFixed(0)}
                </Text>
                <Text style={styles.calorieLabel}>Consumido</Text>
              </View>
              <View style={styles.calorieDivider}>
                <Text style={styles.calorieSlash}>/</Text>
              </View>
              <View style={styles.calorieItem}>
                <Text style={styles.calorieValue}>
                  {goals.calorias_meta}
                </Text>
                <Text style={styles.calorieLabel}>Meta</Text>
              </View>
              <View style={styles.calorieDivider}>
                <Text style={styles.calorieSlash}>=</Text>
              </View>
              <View style={styles.calorieItem}>
                <Text
                  style={[
                    styles.calorieValue,
                    { color: '#FF6B6B' },
                  ]}
                >
                  {(
                    goals.calorias_meta - dailyMacros.calorias
                  ).toFixed(0)}
                </Text>
                <Text style={styles.calorieLabel}>Restante</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Macronutrientes</Text>
            <View style={styles.macrosCard}>
              <NutrientBar
                name="Proteínas"
                consumido={dailyMacros.proteinas}
                meta={goals.proteinas_meta}
                unidade="g"
                color="#FF6B6B"
              />
              <NutrientBar
                name="Carboidratos"
                consumido={dailyMacros.carboidratos}
                meta={goals.carboidratos_meta}
                unidade="g"
                color="#4ECDC4"
              />
              <NutrientBar
                name="Gorduras"
                consumido={dailyMacros.gorduras}
                meta={goals.gorduras_meta}
                unidade="g"
                color="#FFD93D"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Micronutrientes</Text>
            <View style={styles.macrosCard}>
              <NutrientBar
                name="Vitamina C"
                consumido={dailyMicros.vitamina_c}
                meta={goals.vitamina_c_meta}
                unidade="mg"
                color="#95E1D3"
              />
              <NutrientBar
                name="Ferro"
                consumido={dailyMicros.ferro}
                meta={goals.ferro_meta}
                unidade="mg"
                color="#F38181"
              />
              <NutrientBar
                name="Cálcio"
                consumido={dailyMicros.calcio}
                meta={goals.calcio_meta}
                unidade="mg"
                color="#AA96DA"
              />
              <NutrientBar
                name="Vitamina D"
                consumido={dailyMicros.vitamina_d}
                meta={goals.vitamina_d_meta}
                unidade="µg"
                color="#FCBAD3"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alimentação do Dia (IA)</Text>
            {meals.length > 0 ? (
              meals.map((meal, index) => (
                <MealCard
                  key={meal.id || index}
                  meal={meal}
                  onToggleComplete={handleToggleComplete}
                  onPress={handleMealPress}
                />
              ))
            ) : (
              <View style={styles.emptyMeals}>
                <Text style={styles.emptyMealsIcon}>🍽️</Text>
                <Text style={styles.emptyMealsText}>
                  Nenhuma refeição gerada para hoje
                </Text>
                <TouchableOpacity
                  style={styles.generateButton}
                  onPress={() => navigation.navigate('Autopilot')}
                >
                  <Text style={styles.generateButtonText}>
                    🤖 Gerar com AutoPilot
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </>
      )}

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}
