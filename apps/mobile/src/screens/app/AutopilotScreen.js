import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AutopilotScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Autopilot</Text>
      <Text>Em breve: Geração automática de dieta.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
});