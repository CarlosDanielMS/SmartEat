import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles';

const mealTypeLabels = {
  breakfast: '☀️ Café da Manhã',
  morning_snack: '🍎 Lanche da Manhã',
  lunch: '🍽️ Almoço',
  afternoon_snack: '🥤 Lanche da Tarde',
  dinner: '🌙 Jantar',
  supper: '🌜 Ceia',
};

export function MealCard({ meal, toggleConsumed }) {
  // Garante que ingredients seja um array
  let ingredients = [];
  try {
    if (Array.isArray(meal.ingredients)) {
      ingredients = meal.ingredients;
    } else if (typeof meal.ingredients === 'string' && meal.ingredients.trim()) {
      ingredients = JSON.parse(meal.ingredients);
    }
  } catch (e) {
    console.warn('Erro ao parsear ingredients da refeição', meal.id, e);
  }

  return (
    <View style={styles.mealCard}>
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

      {ingredients.length > 0 && (
        <View style={styles.ingredients}>
          <Text style={styles.ingredientsTitle}>📋 Ingredientes:</Text>
          {ingredients.slice(0, 3).map((ing, idx) => (
            <Text key={idx} style={styles.ingredientItem}>
              • {ing.name} - {ing.quantity}
            </Text>
          ))}
          {ingredients.length > 3 && (
            <Text style={styles.ingredientItem}>
              ... e mais {ingredients.length - 3} ingredientes
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
  );
}
