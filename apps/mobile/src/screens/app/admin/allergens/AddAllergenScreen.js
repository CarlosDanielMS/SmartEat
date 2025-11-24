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

export default function AddAllergenScreen({ navigation }) {
  const [name, setName] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'O nome não pode ficar em branco.');
      return;
    }

    // Em Modo Teste, nós "devolvemos" o novo item para a tela de lista
    const newItem = { name: name.trim() };
    navigation.navigate('ManageAllergens', { newItem: newItem });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.label}>Nome do Grupo Alérgeno</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Ex: Glúten, Laticínios..."
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