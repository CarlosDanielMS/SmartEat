// apps/mobile/src/screens/app/AddFoodScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { nutritionService } from '../../services/nutritionService';

export default function AddFoodScreen({ route, navigation }) {
  const { mealId, mealType } = route.params;
  const { user } = useAuth();

  const [foodName, setFoodName] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [catalogResults, setCatalogResults] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('g');
  const [calories, setCalories] = useState('');
  const [proteins, setProteins] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [loading, setLoading] = useState(false);
  const [mealFoods, setMealFoods] = useState([]);

  useEffect(() => {
    loadMealFoods();
  }, []);

  const loadMealFoods = async () => {
    try {
      const { data, error } = await supabase
        .from('meal_foods')
        .select('*')
        .eq('meal_id', mealId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMealFoods(data || []);
    } catch (error) {
      console.error('Erro ao carregar alimentos:', error);
    }
  };

  const handleFoodNameChange = (text) => {
    setFoodName(text);
    setSelectedFood(null);

    if (searchTimeout) clearTimeout(searchTimeout);

    const timeout = setTimeout(async () => {
      try {
        const results = await nutritionService.searchFoodCatalog(text);
        setCatalogResults(results);
      } catch (err) {
        console.error('Erro ao buscar catálogo:', err);
      }
    }, 400);

    setSearchTimeout(timeout);
  };

  const handleSelectCatalogItem = (item) => {
    setSelectedFood(item);
    setFoodName(item.nome);
    setCatalogResults([]);

    const baseQty = item.porcao_base || 100;
    setQuantity(String(baseQty));
    setUnit(item.unidade_base || 'g');

    const nutrients = nutritionService.computeNutrientsFromCatalog(item, baseQty);
    setCalories(String(nutrients.calorias.toFixed(0)));
    setProteins(String(nutrients.proteinas.toFixed(1)));
    setCarbs(String(nutrients.carboidratos.toFixed(1)));
    setFats(String(nutrients.gorduras.toFixed(1)));
  };

  const handleQuantityChange = (value) => {
    setQuantity(value);
    if (selectedFood) {
      const nutrients = nutritionService.computeNutrientsFromCatalog(selectedFood, value);
      setCalories(String((nutrients.calorias || 0).toFixed(0)));
      setProteins(String((nutrients.proteinas || 0).toFixed(1)));
      setCarbs(String((nutrients.carboidratos || 0).toFixed(1)));
      setFats(String((nutrients.gorduras || 0).toFixed(1)));
    }
  };

  const handleAddFood = async () => {
    if (!foodName.trim()) {
      Alert.alert('Atenção', 'Digite o nome do alimento');
      return;
    }

    if (!quantity || parseFloat(quantity) <= 0) {
      Alert.alert('Atenção', 'Digite uma quantidade válida');
      return;
    }

    try {
      setLoading(true);

      const nutrients = selectedFood
        ? nutritionService.computeNutrientsFromCatalog(selectedFood, quantity)
        : {
            calorias: parseFloat(calories) || 0,
            proteinas: parseFloat(proteins) || 0,
            carboidratos: parseFloat(carbs) || 0,
            gorduras: parseFloat(fats) || 0,
            vitamina_c: 0,
            ferro: 0,
            calcio: 0,
            vitamina_d: 0,
          };

      await nutritionService.addFoodToMeal(mealId, {
        food_id: selectedFood ? selectedFood.id : null,
        nome: foodName.trim(),
        quantidade: parseFloat(quantity),
        unidade: unit,
        ...nutrients,
      });

      setFoodName('');
      setSelectedFood(null);
      setQuantity('');
      setCalories('');
      setProteins('');
      setCarbs('');
      setFats('');

      await loadMealFoods();

      Alert.alert('Sucesso', 'Alimento adicionado! Marque a refeição como concluída para calcular nutrientes.');
    } catch (error) {
      console.error('Erro ao adicionar alimento:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o alimento');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFood = async (foodId) => {
    Alert.alert('Confirmar', 'Deseja remover este alimento?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          try {
            const { error } = await supabase
              .from('meal_foods')
              .delete()
              .eq('id', foodId);

            if (error) throw error;

            await loadMealFoods();
            Alert.alert('Sucesso', 'Alimento removido');
          } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Não foi possível remover o alimento');
          }
        },
      },
    ]);
  };

  const handleCompleteMeal = async () => {
    if (mealFoods.length === 0) {
      Alert.alert('Atenção', 'Adicione pelo menos um alimento antes de concluir');
      return;
    }

    try {
      await nutritionService.completeMealAndUpdateNutrients(mealId);

      Alert.alert('Sucesso', 'Refeição concluída! Nutrientes calculados.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível concluir a refeição');
    }
  };

  const units = ['g', 'ml', 'unidade', 'colher', 'xícara', 'porção', 'fatia'];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#212529" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{mealType}</Text>
          <View style={{ width: 24 }} />
        </View>

        {mealFoods.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alimentos Adicionados</Text>
            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={16} color="#FF9800" />
              <Text style={styles.infoText}>
                Os nutrientes serão calculados quando você marcar a refeição como concluída
              </Text>
            </View>
            {mealFoods.map((food) => (
              <View key={food.id} style={styles.foodItem}>
                <View style={styles.foodInfo}>
                  <Text style={styles.foodName}>{food.nome}</Text>
                  <Text style={styles.foodDetails}>
                    {food.quantidade} {food.unidade}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleDeleteFood(food.id)}>
                  <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adicionar Alimento</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Nome do Alimento * {selectedFood && '✓'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Digite para buscar no catálogo..."
              value={foodName}
              onChangeText={handleFoodNameChange}
            />

            {catalogResults.length > 0 && (
              <ScrollView style={styles.catalogList} nestedScrollEnabled>
                {catalogResults.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.catalogItem}
                    onPress={() => handleSelectCatalogItem(item)}
                  >
                    <Text style={styles.catalogItemName}>{item.nome}</Text>
                    {item.categoria && (
                      <Text style={styles.catalogItemCategory}>
                        {item.categoria} • {item.porcao_base} {item.unidade_base} • {item.calorias}{' '}
                        kcal
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Quantidade *</Text>
              <TextInput
                style={styles.input}
                placeholder="100"
                keyboardType="numeric"
                value={quantity}
                onChangeText={handleQuantityChange}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Unidade</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {units.map((u) => (
                  <TouchableOpacity
                    key={u}
                    style={[styles.unitButton, unit === u && styles.unitButtonActive]}
                    onPress={() => setUnit(u)}
                  >
                    <Text
                      style={[styles.unitButtonText, unit === u && styles.unitButtonTextActive]}
                    >
                      {u}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Calorias (kcal)</Text>
            <TextInput
              style={[styles.input, selectedFood && styles.inputDisabled]}
              placeholder="0"
              keyboardType="numeric"
              value={calories}
              onChangeText={setCalories}
              editable={!selectedFood}
            />
          </View>

          <Text style={styles.subsectionTitle}>Macronutrientes</Text>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Proteínas (g)</Text>
              <TextInput
                style={[styles.input, selectedFood && styles.inputDisabled]}
                placeholder="0"
                keyboardType="numeric"
                value={proteins}
                onChangeText={setProteins}
                editable={!selectedFood}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Carboidratos (g)</Text>
              <TextInput
                style={[styles.input, selectedFood && styles.inputDisabled]}
                placeholder="0"
                keyboardType="numeric"
                value={carbs}
                onChangeText={setCarbs}
                editable={!selectedFood}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gorduras (g)</Text>
            <TextInput
              style={[styles.input, selectedFood && styles.inputDisabled]}
              placeholder="0"
              keyboardType="numeric"
              value={fats}
              onChangeText={setFats}
              editable={!selectedFood}
            />
          </View>

          {selectedFood && (
            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={16} color="#4CAF50" />
              <Text style={styles.infoText}>
                Valores calculados automaticamente do catálogo
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddFood}
            disabled={loading}
          >
            <Ionicons name="add-circle" size={20} color="#fff" />
            <Text style={styles.addButtonText}>
              {loading ? 'Adicionando...' : 'Adicionar Alimento'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {mealFoods.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.completeButton} onPress={handleCompleteMeal}>
            <Ionicons name="checkmark-circle" size={24} color="#fff" />
            <Text style={styles.completeButtonText}>Concluir e Calcular Nutrientes</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6C757D',
    marginTop: 16,
    marginBottom: 8,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginBottom: 8,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  foodDetails: {
    fontSize: 12,
    color: '#6C757D',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DEE2E6',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#212529',
  },
  inputDisabled: {
    backgroundColor: '#E9ECEF',
    color: '#6C757D',
  },
  catalogList: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#DEE2E6',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
  },
  catalogItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  catalogItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 2,
  },
  catalogItemCategory: {
    fontSize: 12,
    color: '#6C757D',
  },
  row: {
    flexDirection: 'row',
  },
  unitButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#F8F9FA',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#DEE2E6',
  },
  unitButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  unitButtonText: {
    fontSize: 12,
    color: '#6C757D',
  },
  unitButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 12,
    color: '#E65100',
    marginLeft: 8,
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
