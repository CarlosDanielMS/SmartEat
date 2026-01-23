import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';
import { useAddAllergen } from './useAddAllergen';

export default function AddAllergenScreen({ navigation }) {
  const { name, setName, handleSave } = useAddAllergen({ navigation });

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
