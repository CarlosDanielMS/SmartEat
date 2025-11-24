import React, { useState } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  TextInput, 
  Button, 
  StyleSheet,
  Alert 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { MOCK_CLASSIFICATIONS, MOCK_ALLERGENS } from '../../data/adminMockData';

// Componente reutilizável para Inputs
const FormInput = ({ label, value, onChange, ...props }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={String(value)}
      onChangeText={onChange}
      {...props}
    />
  </View>
);

// Componente reutilizável para Pickers
const FormPicker = ({ label, selectedValue, onValueChange, items }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
      >
        <Picker.Item label={`Selecione ${label.toLowerCase()}...`} value="" />
        {items.map(item => (
          <Picker.Item key={item.id} label={item.name} value={item.id} />
        ))}
      </Picker>
    </View>
  </View>
);

// --- Formulário Principal ---
export default function FoodForm({ initialData = {}, onSubmit }) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    photo: initialData.photo || null,
    classification_id: initialData.classification_id || '',
    allergen_id: initialData.allergen_id || '',
    division_id: initialData.division_id || '',
    
    // Macros
    calories: initialData.calories || '0',
    protein: initialData.protein || '0',
    carbohydrate: initialData.carbohydrate || '0',
    fat: initialData.fat || '0',
    
    // Níveis
    sugar_level: initialData.sugar_level || '',
    fat_level: initialData.fat_level || '',
    sodium_level: initialData.sodium_level || '',

    // Micros (simplificado)
    fiber: initialData.fiber || '0',
    vitamin_c: initialData.vitamin_c || '0',
    potassium: initialData.potassium || '0',
    // Adicione outros micros se necessário
  });

  // Função genérica para atualizar o estado do formulário
  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar sua galeria.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images, // <--- CORREÇÃO AQUI
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      handleChange('photo', result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    // Validação simples (pode ser melhorada)
    if (!formData.name || !formData.calories) {
      Alert.alert('Erro', 'Nome e Calorias são obrigatórios.');
      return;
    }
    onSubmit(formData);
  };

  // Opções para os Pickers de Nível
  const levelOptions = [
    { id: 'low', name: 'Baixo' },
    { id: 'medium', name: 'Médio' },
    { id: 'high', name: 'Alto' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Informações Principais</Text>
      
      <FormInput
        label="Nome do Alimento"
        value={formData.name}
        onChangeText={(val) => handleChange('name', val)}
        placeholder="Ex: Maçã"
      />
      
      <Text style={styles.label}>Foto</Text>
      <Button title={formData.photo ? "Alterar Foto" : "Selecionar Foto"} onPress={handlePickImage} />
      {formData.photo && <Text style={styles.imageText}>Foto selecionada.</Text>}

      <FormPicker
        label="Classificação"
        selectedValue={formData.classification_id}
        onValueChange={(val) => handleChange('classification_id', val)}
        items={MOCK_CLASSIFICATIONS}
      />
      
      <FormPicker
        label="Grupo Alérgeno"
        selectedValue={formData.allergen_id}
        onValueChange={(val) => handleChange('allergen_id', val)}
        items={MOCK_ALLERGENS}
      />

      <Text style={styles.sectionTitle}>Macros (por 100g)</Text>
      
      <FormInput
        label="Calorias (kcal)"
        value={formData.calories}
        onChangeText={(val) => handleChange('calories', val)}
        keyboardType="numeric"
      />
      <FormInput
        label="Proteínas (g)"
        value={formData.protein}
        onChangeText={(val) => handleChange('protein', val)}
        keyboardType="numeric"
      />
      <FormInput
        label="Carboidratos (g)"
        value={formData.carbohydrate}
        onChangeText={(val) => handleChange('carbohydrate', val)}
        keyboardType="numeric"
      />
      <FormInput
        label="Gorduras (g)"
        value={formData.fat}
        onChangeText={(val) => handleChange('fat', val)}
        keyboardType="numeric"
      />

      <Text style={styles.sectionTitle}>Níveis</Text>
      
      <FormPicker
        label="Nível de Açúcar"
        selectedValue={formData.sugar_level}
        onValueChange={(val) => handleChange('sugar_level', val)}
        items={levelOptions}
      />
      <FormPicker
        label="Nível de Gordura"
        selectedValue={formData.fat_level}
        onValueChange={(val) => handleChange('fat_level', val)}
        items={levelOptions}
      />
      <FormPicker
        label="Nível de Sódio"
        selectedValue={formData.sodium_level}
        onValueChange={(val) => handleChange('sodium_level', val)}
        items={levelOptions}
      />

      <Text style={styles.sectionTitle}>Micros (por 100g)</Text>
      
      <FormInput
        label="Fibra (g)"
        value={formData.fiber}
        onChangeText={(val) => handleChange('fiber', val)}
        keyboardType="numeric"
      />
      <FormInput
        label="Vitamina C (mg)"
        value={formData.vitamin_c}
        onChangeText={(val) => handleChange('vitamin_c', val)}
        keyboardType="numeric"
      />
      <FormInput
        label="Potássio (mg)"
        value={formData.potassium}
        onChangeText={(val) => handleChange('potassium', val)}
        keyboardType="numeric"
      />
      
      <View style={styles.submitButton}>
        <Button 
          title={initialData.id ? "Atualizar Alimento" : "Criar Alimento"} 
          onPress={handleSubmit} 
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 4,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    height: 44,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fafafa',
  },
  pickerContainer: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fafafa',
  },
  imageText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#555',
    marginTop: 8,
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 48,
  },
});