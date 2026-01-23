import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles';

export const MonthView = ({ monthlyData, selectedDate, onSelectDay }) => {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    const dateStr = date.toISOString().split('T')[0];
    const dayData = monthlyData[dateStr] || { calorias: 0 };

    days.push(
      <TouchableOpacity
        key={i}
        style={styles.monthDayCard}
        onPress={() => onSelectDay(date)}
      >
        <Text style={styles.monthDayNumber}>{i}</Text>
        <Text style={styles.monthDayCalories}>
          {dayData.calorias > 0 ? `${dayData.calorias.toFixed(0)}` : '-'}
        </Text>
      </TouchableOpacity>
    );
  }

  return <View style={styles.monthContainer}>{days}</View>;
};
