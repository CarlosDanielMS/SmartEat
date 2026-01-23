import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from '../styles';

export const ActionButton = ({ label, icon, onPress, color = '#333' }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <View style={styles.actionContent}>
      <Feather name={icon} size={20} color={color} style={{ marginRight: 15 }} />
      <Text style={[styles.actionLabel, { color }]}>{label}</Text>
    </View>
    <Feather name="chevron-right" size={20} color="#ccc" />
  </TouchableOpacity>
);
