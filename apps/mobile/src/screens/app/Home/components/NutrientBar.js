import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles';

export const NutrientBar = ({ name, consumido, meta, unidade, color }) => {
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
