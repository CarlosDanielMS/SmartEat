import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from '../styles';

export const InfoItem = ({ label, value, icon }) => (
  <View style={styles.infoItem}>
    <View style={styles.iconContainer}>
      <Feather name={icon} size={20} color="#007AFF" />
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || '—'}</Text>
    </View>
  </View>
);
