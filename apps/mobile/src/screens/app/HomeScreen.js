// apps/mobile/src/screens/app/HomeScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { nutritionService } from '../../services/nutritionService';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { user, userRole } = useAuth();
  const [profile, setProfile] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('dia');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const [nutritionGoals, setNutritionGoals] = useState(null);
  const [dailyMacros, setDailyMacros] = useState({
    calorias: 0,
    proteinas: 0,
    carboidratos: 0,
    gorduras: 0,
  });
  const [dailyMicros, setDailyMicros] = useState({
    vitamina_c: 0,
    ferro: 0,
    calcio: 0,
    vitamina_d: 0,
  });
  const [meals, setMeals] = useState([]);
  const [weeklyData, setWeeklyData] = useState({});
  const [monthlyData, setMonthlyData] = useState({});

  const loadProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (data) setProfile(data);
  };

  const loadNutritionData = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      console.log('🔍 ===== DEBUG HOMESCREEN =====');
      console.log('📅 Data:', dateStr);
      console.log('👤 User:', user.id);
      console.log('📑 Tab selecionada:', selectedTab);

      let goals = await nutritionService.getNutritionGoals(user.id);
      if (!goals) {
        const { data: newGoals } = await supabase
          .from('nutrition_goals')
          .insert({ user_id: user.id })
          .select()
          .single();
        goals = newGoals;
      }
      setNutritionGoals(goals);

      if (selectedTab === 'dia') {
        console.log('📅 ===== CARREGANDO ABA DIA =====');
        console.log('📅 Data formatada:', dateStr);
        console.log('👤 User ID:', user.id);
        
        const macros = await nutritionService.getDailyMacros(user.id, dateStr);
        setDailyMacros(macros);

        const micros = await nutritionService.getDailyMicronutrients(user.id, dateStr);
        setDailyMicros(micros);

        console.log('📡 Buscando refeições APENAS do dia:', dateStr);
        
        // ✅ BUSCAR APENAS REFEIÇÕES DESTE DIA ESPECÍFICO
        const { data: aiMeals, error: mealsError } = await supabase
          .from('meals')
          .select('id, user_id, meal_type, name, meal_date, calories, protein, carbs, fats, consumed, ingredients, created_at')
          .eq('user_id', user.id)
          .eq('meal_date', dateStr)
          .order('created_at', { ascending: true });

        if (mealsError) {
          console.error('❌ Erro ao buscar refeições:', mealsError);
          setMeals([]);
        } else {
          console.log(`📊 RESULTADO: ${aiMeals?.length || 0} refeições encontradas para ${dateStr}`);
          
          // LOG detalhado de cada refeição
          if (aiMeals && aiMeals.length > 0) {
            console.log('📋 Refeições encontradas:');
            aiMeals.forEach((meal, idx) => {
              console.log(`  ${idx + 1}. ${meal.meal_type} - ${meal.name} (Data: ${meal.meal_date})`);
            });
          } else {
            console.log('⚠️ Nenhuma refeição encontrada para esta data!');
          }

          // Se encontrou mais de 6 refeições, algo está errado
          if (aiMeals && aiMeals.length > 6) {
            console.warn(`⚠️ ATENÇÃO: Encontradas ${aiMeals.length} refeições! Deveria ser no máximo 6.`);
            console.log('📋 Todas as datas das refeições:');
            aiMeals.forEach(m => console.log(`   - ${m.meal_date}`));
          }
        }

        const mealTypeMap = {
          breakfast: { 
            nome: '☀️ Café da Manhã', 
            icon: 'cafe', 
            horario: '07:30',
            tipo: 'cafe_manha'
          },
          morning_snack: { 
            nome: '🍎 Lanche da Manhã', 
            icon: 'nutrition', 
            horario: '10:00',
            tipo: 'lanche_manha'
          },
          lunch: { 
            nome: '🍽️ Almoço', 
            icon: 'restaurant', 
            horario: '12:30',
            tipo: 'almoco'
          },
          afternoon_snack: { 
            nome: '🥤 Lanche da Tarde', 
            icon: 'fast-food', 
            horario: '16:00',
            tipo: 'lanche_tarde'
          },
          dinner: { 
            nome: '🌙 Jantar', 
            icon: 'pizza', 
            horario: '19:30',
            tipo: 'jantar'
          },
          supper: { 
            nome: '🌜 Ceia', 
            icon: 'moon', 
            horario: '21:30',
            tipo: 'ceia'
          },
        };

        const mappedMeals = (aiMeals || []).map(meal => {
          const typeInfo = mealTypeMap[meal.meal_type] || {
            nome: meal.meal_type,
            icon: 'fast-food',
            horario: '--:--',
            tipo: meal.meal_type
          };

          let mealFoods = [];
          try {
            const ingredients = Array.isArray(meal.ingredients) 
              ? meal.ingredients 
              : (typeof meal.ingredients === 'string' 
                  ? JSON.parse(meal.ingredients) 
                  : []);
            
            mealFoods = ingredients.map(ing => ({
              id: ing.name || ing.id,
              nome: ing.name || 'Item',
              quantidade: ing.quantity || ing.quantidade || '1 un',
              unidade: 'un'
            }));
          } catch (err) {
            console.error('Erro ao parsear ingredients:', err);
            mealFoods = [];
          }

          return {
            id: meal.id,
            ...typeInfo,
            calorias: parseFloat(meal.calories || 0),
            concluido: meal.consumed || false,
            meal_foods: mealFoods,
            mealName: meal.name || 'Refeição',
            protein: parseFloat(meal.protein || 0),
            carbs: parseFloat(meal.carbs || 0),
            fats: parseFloat(meal.fats || 0),
            meal_date: meal.meal_date,
          };
        });

        const mealOrder = ['breakfast', 'morning_snack', 'lunch', 'afternoon_snack', 'dinner', 'supper'];
        const sortedMeals = mappedMeals.sort((a, b) => {
          const aType = Object.keys(mealTypeMap).find(key => mealTypeMap[key].tipo === a.tipo) || '';
          const bType = Object.keys(mealTypeMap).find(key => mealTypeMap[key].tipo === b.tipo) || '';
          return mealOrder.indexOf(aType) - mealOrder.indexOf(bType);
        });

        console.log(`✅ ${sortedMeals.length} refeições mapeadas e ordenadas`);
        console.log('📅 ===== FIM ABA DIA =====\n');
        
        setMeals(sortedMeals);

      } else if (selectedTab === 'semana') {
        console.log('📅 ===== CARREGANDO ABA SEMANA =====');
        
        // Limpar meals quando estiver na aba semana
        setMeals([]);
        
        const startOfWeek = new Date(selectedDate);
        startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        // ✅ USAR A NOVA FUNÇÃO DO NUTRITION SERVICE
        const weekData = await nutritionService.getWeeklyMeals(user.id, startOfWeek, endOfWeek);
        setWeeklyData(weekData);
        
        console.log('✅ Dados da semana carregados');
        console.log('📅 ===== FIM ABA SEMANA =====\n');
        
      } else if (selectedTab === 'mes') {
        console.log('📅 ===== CARREGANDO ABA MÊS =====');
        
        // Limpar meals quando estiver na aba mês
        setMeals([]);
        
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth() + 1;
        const monthData = await nutritionService.getMonthlyData(user.id, year, month);
        setMonthlyData(monthData);
        
        console.log('📅 ===== FIM ABA MÊS =====\n');
      }
      
      console.log('🏁 ===== FIM DEBUG =====\n');
      
    } catch (err) {
      console.error('❌ Erro geral:', err);
      Alert.alert('Erro', 'Não foi possível carregar os dados nutricionais.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [user]);

  useEffect(() => {
    loadNutritionData();
  }, [user, selectedDate, selectedTab]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    await loadNutritionData();
    setRefreshing(false);
  };

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const handleMealPress = (meal) => {
    navigation.navigate('Diary');
  };

  const handleToggleComplete = async (meal) => {
    try {
      const { error } = await supabase
        .from('meals')
        .update({ consumed: !meal.concluido })
        .eq('id', meal.id);

      if (error) throw error;

      console.log(`✓ Refeição ${meal.id} marcada como ${!meal.concluido ? 'consumida' : 'não consumida'}`);
      await loadNutritionData();
    } catch (error) {
      console.error('Erro ao atualizar refeição:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a refeição');
    }
  };

  const TabButton = ({ title, value }) => (
    <TouchableOpacity
      style={[styles.tabButton, selectedTab === value && styles.tabButtonActive]}
      onPress={() => setSelectedTab(value)}
    >
      <Text style={[styles.tabText, selectedTab === value && styles.tabTextActive]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const NutrientBar = ({ name, consumido, meta, unidade, color }) => {
    const safeMeta = meta || 1;
    const percentage = Math.min((consumido / safeMeta) * 100, 100);

    return (
      <View style={styles.nutrientContainer}>
        <View style={styles.nutrientHeader}>
          <Text style={styles.nutrientName}>{name}</Text>
          <Text style={styles.nutrientValue}>
            {consumido.toFixed(1)}/{safeMeta} {unidade}
          </Text>
        </View>
        <View style={styles.nutrientBarContainer}>
          <View
            style={[
              styles.nutrientBarFill,
              { width: `${percentage}%`, backgroundColor: color },
            ]}
          />
        </View>
        <Text style={styles.nutrientPercentage}>{percentage.toFixed(0)}%</Text>
      </View>
    );
  };

  const MealCard = ({ meal }) => (
    <View style={[styles.mealCard, meal.concluido && styles.mealCardComplete]}>
      <View style={styles.mealHeader}>
        <TouchableOpacity
          onPress={() => handleToggleComplete(meal)}
          style={styles.checkboxContainer}
        >
          <View style={[styles.checkbox, meal.concluido && styles.checkboxChecked]}>
            {meal.concluido && <Ionicons name="checkmark" size={18} color="#fff" />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mealContent}
          activeOpacity={0.7}
          onPress={() => handleMealPress(meal)}
        >
          <View style={styles.mealTitleContainer}>
            <Ionicons
              name={meal.icon}
              size={24}
              color={meal.concluido ? '#4CAF50' : '#6C757D'}
            />
            <View style={styles.mealInfo}>
              <Text style={styles.mealType}>{meal.nome}</Text>
              {meal.mealName && (
                <Text style={styles.mealName}>{meal.mealName}</Text>
              )}
              <Text style={styles.mealTime}>{meal.horario}</Text>
            </View>
          </View>

          <View style={styles.mealRightSide}>
            {!meal.concluido && meal.meal_foods && meal.meal_foods.length > 0 && (
              <View style={styles.foodCountBadge}>
                <Text style={styles.foodCountText}>{meal.meal_foods.length}</Text>
              </View>
            )}
            <Ionicons name="chevron-forward" size={20} color="#ADB5BD" />
          </View>
        </TouchableOpacity>
      </View>

      {meal.meal_foods && meal.meal_foods.length > 0 ? (
        <View style={styles.mealItems}>
          <View style={styles.mealMacros}>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{Math.round(meal.calorias)}</Text>
              <Text style={styles.macroLabel}>kcal</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{Math.round(meal.protein || 0)}g</Text>
              <Text style={styles.macroLabel}>prot</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{Math.round(meal.carbs || 0)}g</Text>
              <Text style={styles.macroLabel}>carb</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{Math.round(meal.fats || 0)}g</Text>
              <Text style={styles.macroLabel}>gord</Text>
            </View>
          </View>

          <View style={styles.ingredientsList}>
            <Text style={styles.ingredientsTitle}>📋 Ingredientes:</Text>
            {meal.meal_foods.slice(0, 3).map((food, index) => (
              <Text key={food.id || index} style={styles.mealItem}>
                • {food.nome} - {food.quantidade}
              </Text>
            ))}
            {meal.meal_foods.length > 3 && (
              <Text style={styles.mealItemMore}>
                +{meal.meal_foods.length - 3} ingrediente(s)
              </Text>
            )}
          </View>

          {!meal.concluido && (
            <Text style={styles.mealPending}>
              ⚠️ Marque como concluída para contabilizar
            </Text>
          )}
        </View>
      ) : (
        <Text style={styles.mealEmpty}>Nenhum alimento nesta refeição</Text>
      )}
    </View>
  );

  const renderWeekView = () => {
    const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
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
          const isToday = dateStr === new Date().toISOString().split('T')[0];

          return (
            <View key={index} style={styles.weekDaySection}>
              <View style={[styles.weekDayHeader, isToday && styles.weekDayHeaderToday]}>
                <View style={styles.weekDayHeaderLeft}>
                  <Text style={[styles.weekDayTitle, isToday && styles.weekDayTitleToday]}>
                    {day}
                  </Text>
                  <Text style={styles.weekDaySubtitle}>
                    {currentDay.getDate()} de {currentDay.toLocaleDateString('pt-BR', { month: 'long' })}
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
                      <Text style={[styles.weekMealName, meal.consumed && styles.weekMealConsumed]}>
                        {meal.consumed ? '✓ ' : '○ '}{meal.name}
                      </Text>
                      <Text style={[styles.weekMealCalories, meal.consumed && styles.weekMealConsumed]}>
                        {Math.round(meal.calories || 0)} kcal
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.weekMealsList}>
                  <Text style={styles.weekMealEmpty}>Nenhuma refeição planejada</Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.viewDayButton}
                onPress={() => {
                  setSelectedDate(currentDay);
                  setSelectedTab('dia');
                }}
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

  const renderMonthView = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateStr = date.toISOString().split('T')[0];
      const dayData = monthlyData[dateStr] || { calorias: 0 };

      days.push(
        <View key={i} style={styles.monthDayCard}>
          <Text style={styles.monthDayNumber}>{i}</Text>
          <Text style={styles.monthDayCalories}>
            {dayData.calorias > 0 ? `${dayData.calorias.toFixed(0)}` : '-'}
          </Text>
        </View>
      );
    }

    return <View style={styles.monthContainer}>{days}</View>;
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
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

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>Seja Bem-Vindo, {profile?.full_name || 'Usuário'}! 👋</Text>
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

      {selectedTab === 'semana' && renderWeekView()}
      {selectedTab === 'mes' && renderMonthView()}

      {selectedTab === 'dia' && (
        <>
          <View style={styles.caloriesCard}>
            <Text style={styles.sectionTitle}>Resumo Calórico</Text>
            <View style={styles.caloriesRow}>
              <View style={styles.calorieItem}>
                <Text style={styles.calorieValue}>{dailyMacros.calorias.toFixed(0)}</Text>
                <Text style={styles.calorieLabel}>Consumido</Text>
              </View>
              <View style={styles.calorieDivider}>
                <Text style={styles.calorieSlash}>/</Text>
              </View>
              <View style={styles.calorieItem}>
                <Text style={styles.calorieValue}>{goals.calorias_meta}</Text>
                <Text style={styles.calorieLabel}>Meta</Text>
              </View>
              <View style={styles.calorieDivider}>
                <Text style={styles.calorieSlash}>=</Text>
              </View>
              <View style={styles.calorieItem}>
                <Text style={[styles.calorieValue, { color: '#FF6B6B' }]}>
                  {(goals.calorias_meta - dailyMacros.calorias).toFixed(0)}
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
                <MealCard key={meal.id || index} meal={meal} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
  dateNavigator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  date: {
    fontSize: 14,
    color: '#6C757D',
    textTransform: 'capitalize',
    flex: 1,
    textAlign: 'center',
  },
  adminBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  adminBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 8,
    marginBottom: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  tabButtonActive: {
    backgroundColor: '#4CAF50',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6C757D',
  },
  tabTextActive: {
    color: '#fff',
  },
  caloriesCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 16,
  },
  caloriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  calorieItem: {
    alignItems: 'center',
  },
  calorieValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  calorieLabel: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 4,
  },
  calorieDivider: {
    marginHorizontal: 8,
  },
  calorieSlash: {
    fontSize: 24,
    color: '#ADB5BD',
    fontWeight: '300',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 8,
  },
  macrosCard: {},
  nutrientContainer: {
    marginBottom: 12,
  },
  nutrientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  nutrientName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
  },
  nutrientValue: {
    fontSize: 12,
    color: '#6C757D',
  },
  nutrientBarContainer: {
    height: 8,
    backgroundColor: '#E9ECEF',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  nutrientBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  nutrientPercentage: {
    fontSize: 11,
    color: '#ADB5BD',
    textAlign: 'right',
  },
  mealCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E9ECEF',
  },
  mealCardComplete: {
    borderColor: '#4CAF50',
    backgroundColor: '#F1F8F4',
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    marginRight: 12,
    padding: 4,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#ADB5BD',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  mealContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  mealInfo: {
    marginLeft: 12,
    flex: 1,
  },
  mealType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  mealName: {
    fontSize: 13,
    color: '#007AFF',
    marginTop: 2,
    fontWeight: '500',
  },
  mealTime: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 2,
  },
  mealRightSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  foodCountBadge: {
    backgroundColor: '#FF9800',
    borderRadius: 10,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodCountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  mealItems: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    marginLeft: 40,
  },
  mealMacros: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
  },
  macroLabel: {
    fontSize: 10,
    color: '#6C757D',
    marginTop: 2,
  },
  ingredientsList: {
    marginTop: 4,
  },
  ingredientsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  mealItem: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 4,
  },
  mealItemMore: {
    fontSize: 12,
    color: '#6C757D',
    fontStyle: 'italic',
    marginTop: 4,
  },
  mealPending: {
    fontSize: 11,
    color: '#FF9800',
    fontStyle: 'italic',
    marginTop: 8,
  },
  mealEmpty: {
    fontSize: 12,
    color: '#ADB5BD',
    fontStyle: 'italic',
    marginTop: 8,
    marginLeft: 40,
  },
  emptyMeals: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyMealsIcon: {
    fontSize: 60,
    marginBottom: 12,
  },
  emptyMealsText: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 20,
  },
  generateButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  weekScrollContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  weekDaySection: {
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginTop: 8,
  },
  weekDayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 2,
    borderBottomColor: '#E9ECEF',
  },
  weekDayHeaderToday: {
    backgroundColor: '#E8F5E9',
    borderBottomColor: '#4CAF50',
  },
  weekDayHeaderLeft: {
    flex: 1,
  },
  weekDayHeaderRight: {
    alignItems: 'flex-end',
  },
  weekDayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  weekDayTitleToday: {
    color: '#4CAF50',
  },
  weekDaySubtitle: {
    fontSize: 13,
    color: '#6C757D',
    textTransform: 'capitalize',
  },
  weekDayCaloriesTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  todayBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  todayBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  weekMealsList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  weekMealsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6C757D',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  weekMealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  weekMealName: {
    fontSize: 14,
    color: '#495057',
    flex: 1,
  },
  weekMealCalories: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6C757D',
  },
  weekMealConsumed: {
    color: '#4CAF50',
  },
  weekMealEmpty: {
    fontSize: 13,
    color: '#ADB5BD',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 8,
  },
  viewDayButton: {
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  viewDayButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  monthContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    padding: 8,
    marginBottom: 8,
  },
  monthDayCard: {
    width: (width - 64) / 7,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  monthDayNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 2,
  },
  monthDayCalories: {
    fontSize: 9,
    color: '#4CAF50',
  },
});
