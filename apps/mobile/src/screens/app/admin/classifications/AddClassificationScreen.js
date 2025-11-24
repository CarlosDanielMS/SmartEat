import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  Button, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddClassificationScreen({ navigation }) {
  const [name, setName] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'O nome da classificação não pode ficar em branco.');
      return;
    }

    // Em Modo Teste, nós "devolvemos" o novo item para a tela de lista
    const newItem = { name: name.trim() };
    navigation.navigate('ManageClassifications', { newItem: newItem });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.label}>Nome da Classificação</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Ex: Vegetariano, Vegano..."
        />
        <Button title="Criar" onPress={handleSave} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 44,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#fafafa',
  },
});