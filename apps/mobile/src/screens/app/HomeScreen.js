import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions,
  Image,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Removemos o uso direto do signOut aqui, pois ele estará na tela de Perfil
import { useAuth } from '../../context/AuthContext'; 
import { Feather } from '@expo/vector-icons'; 
import { mockTodayData } from '../../data/plannerData';
import DailyProgress from '../../components/app/DailyProgress'; 
import { 
  format, 
  addDays, 
  subDays, 
  startOfWeek, 
  isSameDay, 
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

const { width } = Dimensions.get('window');

// ... (WeeklyCalendar, FoodItem, MealSection, MenuCard mantêm-se iguais - OMITIDOS PARA BREVIDADE, SÃO OS MESMOS DA VERSÃO ANTERIOR)
// --- Componente de Calendário Semanal ---
const WeeklyCalendar = ({ selectedDate, onSelectDate }) => {
  const [weekStart, setWeekStart] = useState(startOfWeek(selectedDate, { weekStartsOn: 0 }));

  const prevWeek = () => setWeekStart(date => subDays(date, 7));
  const nextWeek = () => setWeekStart(date => addDays(date, 7));

  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    weekDays.push(addDays(weekStart, i));
  }

  const monthYear = format(weekStart, "MMMM yyyy", { locale: ptBR });
  const monthYearCapitalized = monthYear.charAt(0).toUpperCase() + monthYear.slice(1);

  return (
    <View style={styles.calendarContainer}>
      <View style={styles.calendarHeader}>
        <TouchableOpacity onPress={prevWeek} style={styles.navButton}>
          <Feather name="chevron-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.monthTitle}>{monthYearCapitalized}</Text>
        <TouchableOpacity onPress={nextWeek} style={styles.navButton}>
          <Feather name="chevron-right" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.daysContainer}>
        {weekDays.map((date, index) => {
          const isSelected = isSameDay(date, selectedDate);
          const dayName = format(date, "EEE", { locale: ptBR }).toUpperCase().slice(0, 3);
          const dayNumber = format(date, "d");

          return (
            <TouchableOpacity 
              key={index} 
              style={[styles.dayButton, isSelected && styles.dayButtonSelected]}
              onPress={() => onSelectDate(date)}
            >
              <Text style={[styles.dayNameText, isSelected && styles.textSelected]}>
                {dayName}
              </Text>
              <Text style={[styles.dayNumberText, isSelected && styles.textSelected]}>
                {dayNumber}
              </Text>
              {isSelected && <View style={styles.selectedDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const FoodItem = ({ food, onEdit, onDelete }) => (
  <View style={styles.foodItemContainer}>
    <View style={styles.foodInfoRow}>
      <Image source={{ uri: food.image }} style={styles.foodImage} />
      <View style={styles.foodTexts}>
        <Text style={styles.foodName}>{food.name}</Text>
        <Text style={styles.foodPortion}>{food.portion} • {food.calories} kcal</Text>
      </View>
    </View>
    
    <View style={styles.foodActions}>
      <TouchableOpacity onPress={() => onEdit(food)} style={styles.actionIconBtn}>
        <Feather name="edit-2" size={18} color="#666" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(food.id)} style={styles.actionIconBtn}>
        <Feather name="trash-2" size={18} color="#FF5252" />
      </TouchableOpacity>
    </View>
  </View>
);

const MealSection = ({ meal, onAddFood, onEditFood, onDeleteFood }) => {
  const totalMealCalories = meal.foods.reduce((acc, food) => acc + food.calories, 0);

  return (
    <View style={styles.mealCard}>
      <View style={styles.mealHeader}>
        <View>
          <Text style={styles.mealTitle}>{meal.name}</Text>
          <Text style={styles.mealSubtitle}>{totalMealCalories} kcal</Text>
        </View>
        <TouchableOpacity style={styles.addFoodButton} onPress={() => onAddFood(meal.id)}>
          <Feather name="plus" size={16} color="#fff" />
          <Text style={styles.addFoodText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.foodList}>
        {meal.foods.length > 0 ? (
          meal.foods.map((food) => (
            <FoodItem 
              key={food.id} 
              food={food} 
              onEdit={onEditFood} 
              onDelete={() => onDeleteFood(meal.id, food.id)} 
            />
          ))
        ) : (
          <Text style={styles.emptyMealText}>Nenhum alimento registrado.</Text>
        )}
      </View>
    </View>
  );
};

const MenuCard = ({ title, icon, color, onPress }) => (
  <TouchableOpacity 
    style={[styles.cardMenu, { borderLeftColor: color, borderLeftWidth: 4 }]} 
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
      <Feather name={icon} size={24} color={color} />
    </View>
    <Text style={styles.cardMenuTitle}>{title}</Text>
    <Feather name="chevron-right" size={20} color="#ccc" style={{ marginLeft: 'auto' }} />
  </TouchableOpacity>
);
// ... (FIM DOS COMPONENTES INTERNOS)

// --- Tela Principal ---

export default function HomeScreen({ navigation }) { 
  // Não precisamos mais do signOut aqui, ele foi para o ProfileScreen
  const { userToken } = useAuth(); 
  
  const [meals, setMeals] = useState(mockTodayData.meals);
  const [totalCalories, setTotalCalories] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    let total = 0;
    meals.forEach(meal => {
      meal.foods.forEach(food => total += food.calories);
    });
    setTotalCalories(total);
  }, [meals]);

  const progressData = {
    ...mockTodayData,
    calories: {
      ...mockTodayData.calories,
      eaten: totalCalories, 
    },
    macros: {
        ...mockTodayData.macros,
        protein_eaten: 120, 
        carbs_eaten: 110,
        fat_eaten: 35
    }
  };

  const handleAddFood = (mealId) => {
    Alert.alert("Adicionar Alimento", "Adicionando item de teste...", [
      { text: "Cancelar" },
      { 
        text: "Adicionar", 
        onPress: () => {
          const newFood = {
            id: Math.random().toString(),
            name: "Alimento Teste",
            portion: "1 unidade",
            calories: 100,
            image: "https://placehold.co/100x100/E0E0E0/333?text=Novo",
          };
          setMeals(prevMeals => prevMeals.map(meal => {
            if (meal.id === mealId) return { ...meal, foods: [...meal.foods, newFood] };
            return meal;
          }));
        }
      }
    ]);
  };

  const handleEditFood = (food) => { Alert.alert("Editar", `Editar ${food.name}?`); };

  const handleDeleteFood = (mealId, foodId) => {
    Alert.alert("Remover", "Tem certeza?", [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Remover",
        style: "destructive",
        onPress: () => {
          setMeals(prevMeals => prevMeals.map(meal => {
            if (meal.id === mealId) return { ...meal, foods: meal.foods.filter(f => f.id !== foodId) };
            return meal;
          }));
        }
      }
    ]);
  };

  const goToWeightGoal = () => { navigation.navigate('WeightGoal'); };

  // --- NOVA FUNÇÃO: Ir para Perfil ---
  const goToProfile = () => {
    navigation.navigate('Profile');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá!</Text>
            <Text style={styles.subGreeting}>Consumo no dia: <Text style={{fontWeight:'bold', color:'#007AFF'}}>{totalCalories} kcal</Text></Text>
          </View>
          
          {/* --- BOTÃO DE PERFIL (ATUALIZADO) --- */}
          <TouchableOpacity style={styles.avatarButton} onPress={goToProfile}>
             {/* Em um app real, usaríamos a foto do usuário do AuthContext */}
             <Image 
                source={require('../../../assets/images/icon.png')} 
                style={styles.avatarImage}
             />
          </TouchableOpacity>
          {/* ---------------------------------- */}
        </View>

        <DailyProgress data={progressData} />

        <WeeklyCalendar 
          selectedDate={currentDate} 
          onSelectDate={setCurrentDate} 
        />

        <View style={styles.quickAccessRow}>
          <MenuCard 
            title="Ver/Atualizar Meu Peso" 
            icon="activity" 
            color="#2196F3" 
            onPress={goToWeightGoal}
          />
        </View>

        <View style={styles.plannerHeader}>
            <Text style={styles.sectionTitle}>Refeições do Dia</Text>
            <Text style={styles.selectedDateText}>
                {format(currentDate, "dd 'de' MMMM", { locale: ptBR })}
            </Text>
        </View>
        
        {meals.map(meal => (
          <MealSection 
            key={meal.id} 
            meal={meal} 
            onAddFood={handleAddFood}
            onEditFood={handleEditFood}
            onDeleteFood={handleDeleteFood}
          />
        ))}

        {/* Removi o botão de sair daqui, pois agora ele está no Perfil */}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  container: {
    padding: 20,
    paddingBottom: 100, 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  subGreeting: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  // --- NOVO ESTILO DO BOTÃO DE AVATAR ---
  avatarButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    overflow: 'hidden', // Para cortar a imagem redonda
    borderWidth: 2,
    borderColor: '#fff'
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  // ... (Restante dos estilos iguais ao anterior)
  // Copie os estilos do arquivo anterior (calendarContainer, cardMenu, mealCard, etc.)
  // Vou omitir aqui para brevidade, mas CERTIFIQUE-SE DE MANTÊ-LOS!
  calendarContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  navButton: {
    padding: 5,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderRadius: 10,
    width: (width - 80) / 7, 
  },
  dayButtonSelected: {
    backgroundColor: '#007AFF',
  },
  dayNameText: {
    fontSize: 10,
    color: '#888',
    marginBottom: 4,
    fontWeight: '600',
  },
  dayNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  textSelected: {
    color: '#fff',
  },
  selectedDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#fff',
    marginTop: 4,
  },
  quickAccessRow: {
    marginBottom: 20,
  },
  cardMenu: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  cardMenuTitle: {
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
    fontSize: 16,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 8,
  },
  plannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedDateText: {
      fontSize: 14,
      color: '#007AFF',
      fontWeight: '600',
  },
  mealCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 10,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  mealSubtitle: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
  },
  addFoodButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  addFoodText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  foodList: {
  },
  emptyMealText: {
    color: '#aaa',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 10,
  },
  foodItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#FAFAFA',
    padding: 10,
    borderRadius: 10,
  },
  foodInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  foodImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  foodTexts: {
    flex: 1,
  },
  foodName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  foodPortion: {
    fontSize: 12,
    color: '#888',
  },
  foodActions: {
    flexDirection: 'row',
  },
  actionIconBtn: {
    padding: 8,
    marginLeft: 5,
  },
});