import { useState } from 'react';
import { Alert } from 'react-native';

export function useAddAllergen({ navigation }) {
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

  return {
    name,
    setName,
    handleSave
  };
}
