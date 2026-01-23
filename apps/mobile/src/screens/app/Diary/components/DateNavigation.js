import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles';

export function DateNavigation({ selectedDate, changeDate, isToday }) {
  return (
    <View style={styles.dateNavigation}>
      <TouchableOpacity style={styles.dateButton} onPress={() => changeDate(-1)}>
        <Text style={styles.dateButtonText}>← Anterior</Text>
      </TouchableOpacity>

      <View style={styles.dateContainer}>
        <Text
          style={styles.dateText}
        >
          {selectedDate.toLocaleDateString('pt-BR', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
          })}
        </Text>
        {isToday && <Text style={styles.todayBadge}>Hoje</Text>}
      </View>

      <TouchableOpacity style={styles.dateButton} onPress={() => changeDate(1)}>
        <Text style={styles.dateButtonText}>Próximo →</Text>
      </TouchableOpacity>
    </View>
  );
}
