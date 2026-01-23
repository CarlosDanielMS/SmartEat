import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles';

const StatBox = ({ title, value, icon, onPress, color }) => (
  <TouchableOpacity 
    style={[styles.statBox, { backgroundColor: color }]} 
    onPress={onPress}
  >
    <View style={styles.statBoxInner}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
    <View style={styles.statIconContainer}>
      <Text style={styles.statIcon}>{icon}</Text>
    </View>
    <View style={styles.statFooter}>
      <Text style={styles.statFooterText}>Mais Informações →</Text>
    </View>
  </TouchableOpacity>
);

export default StatBox;
