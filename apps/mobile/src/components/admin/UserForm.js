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
// --- CORREÇÃO AQUI (2 PONTOS) ---
import { USER_LEVELS } from '../../data/adminMockData';

// Pega os níveis de usuário do mock e transforma em array para o Picker
const levelOptions = Object.keys(USER_LEVELS).map(key => ({
  label: USER_LEVELS[key],
  value: key,
}));

export default function UserForm({ initialData = {}, onSubmit }) {
  const [formData, setFormData] = useState({
    first_name: initialData.first_name || '',
    last_name: initialData.last_name || '',
    phone: initialData.phone || '',
    genre: initialData.genre || '',
    photo: initialData.photo || null,
    datebirth: initialData.datebirth || '',
    document: initialData.document || '',
    level: initialData.level || '5', // Default 'Admin'
    email: initialData.email || '',
    password: '', // Senha sempre vazia por segurança
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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
    if (!formData.first_name || !formData.email) {
      Alert.alert('Erro', 'Nome e E-mail são obrigatórios.');
      return;
    }
    onSubmit(formData);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Nome */}
      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={formData.first_name}
        onChangeText={(val) => handleChange('first_name', val)}
        placeholder="Digite o nome"
      />

      {/* Sobrenome */}
      <Text style={styles.label}>Sobrenome</Text>
      <TextInput
        style={styles.input}
        value={formData.last_name}
        onChangeText={(val) => handleChange('last_name', val)}
        placeholder="Digite o sobrenome"
      />

      {/* E-mail */}
      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        value={formData.email}
        onChangeText={(val) => handleChange('email', val)}
        placeholder="Digite o e-mail"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      {/* Senha */}
      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        value={formData.password}
        onChangeText={(val) => handleChange('password', val)}
        placeholder={initialData.id ? "Deixe em branco para não alterar" : "Digite a senha"}
        secureTextEntry
      />

      {/* Perfil de Acesso */}
      <Text style={styles.label}>Perfil de Acesso</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={String(formData.level)}
          onValueChange={(val) => handleChange('level', val)}
        >
          <Picker.Item label="Selecione o perfil" value="" />
          {levelOptions.map(option => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>
      </View>

      {/* Gênero */}
      <Text style={styles.label}>Gênero</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.genre}
          onValueChange={(val) => handleChange('genre', val)}
        >
          <Picker.Item label="Selecione o gênero" value="" />
          <Picker.Item label="Masculino" value="male" />
          <Picker.Item label="Feminino" value="female" />
          <Picker.Item label="Outro" value="other" />
        </Picker>
      </View>

      {/* Telefone */}
      <Text style={styles.label}>Telefone/WhatsApp</Text>
      <TextInput
        style={styles.input}
        value={formData.phone}
        onChangeText={(val) => handleChange('phone', val)}
        placeholder="Digite o telefone"
        keyboardType="phone-pad"
      />

      {/* Nascimento */}
      <Text style={styles.label}>Nascimento</Text>
      <TextInput
        style={styles.input}
        value={formData.datebirth}
        onChangeText={(val) => handleChange('datebirth', val)}
        placeholder="DD/MM/AAAA"
      />

      {/* CPF */}
      <Text style={styles.label}>CPF</Text>
      <TextInput
        style={styles.input}
        value={formData.document}
        onChangeText={(val) => handleChange('document', val)}
        placeholder="Digite o CPF"
        keyboardType="numeric"
      />
      
      {/* Foto */}
      <Text style={styles.label}>Foto</Text>
      <Button title={formData.photo ? "Alterar Foto" : "Selecionar Foto"} onPress={handlePickImage} />
      {formData.photo && <Text style={styles.imageText}>Foto selecionada.</Text>}
      
      <View style={styles.submitButton}>
        <Button 
          title={initialData.id ? "Atualizar Usuário" : "Criar Usuário"} 
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