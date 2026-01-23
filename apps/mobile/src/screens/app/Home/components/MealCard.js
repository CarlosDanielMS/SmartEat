import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles';

export const MealCard = ({ meal, onToggleComplete, onPress }) => (
  <View style={[styles.mealCard, meal.concluido && styles.mealCardComplete]}>
    <View style={styles.mealHeader}>
      <TouchableOpacity
        onPress={() => onToggleComplete(meal)}
        style={styles.checkboxContainer}
      >
        <View style={[styles.checkbox, meal.concluido && styles.checkboxChecked]}>
          {meal.concluido && (
            <Ionicons name="checkmark" size={18} color="#fff" />
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.mealContent}
        activeOpacity={0.7}
        onPress={() => onPress(meal)}
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
          {!meal.concluido &&
            meal.meal_foods &&
            meal.meal_foods.length > 0 && (
              <View style={styles.foodCountBadge}>
                <Text style={styles.foodCountText}>
                  {meal.meal_foods.length}
                </Text>
              </View>
            )}
          <Ionicons name="chevron-forward" size={20} color="#ADB5BD" />
        </View>
      </TouchableOpacity>
    </View>

    <View style={styles.mealItems}>
      {/* Macros SEMPRE exibidos, usando dados da tabela meals */}
      <View style={styles.mealMacros}>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>
            {Math.round(meal.calorias || 0)}
          </Text>
          <Text style={styles.macroLabel}>kcal</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>
            {Math.round(meal.protein || 0)}g
          </Text>
          <Text style={styles.macroLabel}>prot</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>
            {Math.round(meal.carbs || 0)}g
          </Text>
          <Text style={styles.macroLabel}>carb</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>
            {Math.round(meal.fats || 0)}g
          </Text>
          <Text style={styles.macroLabel}>gord</Text>
        </View>
      </View>

      {/* Ingredientes, se existirem */}
      {meal.meal_foods && meal.meal_foods.length > 0 ? (
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
      ) : (
        <Text style={styles.mealEmpty}>Nenhum alimento nesta refeição</Text>
      )}

      {!meal.concluido && (
        <Text style={styles.mealPending}>
          ⚠️ Marque como concluída para contabilizar
        </Text>
      )}
    </View>
  </View>
);
