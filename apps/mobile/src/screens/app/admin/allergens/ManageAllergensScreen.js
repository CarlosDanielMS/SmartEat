import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
export default function ManageAuthenticatorScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciar Autenticador</Text>
      <Text>Aqui ficará a tela do autenticador.</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
});