import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import { useAddFood } from './useAddFood';

export default function AddFoodScreen({ route, navigation }) {
  const {
    mealType,
    foodName,
    handleFoodNameChange,
    selectedFood,
    catalogResults,
    handleSelectCatalogItem,
    quantity,
    handleQuantityChange,
    unit,
    setUnit,
    calories,
    setCalories,
    proteins,
    setProteins,
    carbs,
    setCarbs,
    fats,
    setFats,
    loading,
    mealFoods,
    handleAddFood,
    handleDeleteFood,
    handleCompleteMeal
  } = useAddFood(route, navigation);

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