import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
// Importe o hook useAuth
import { useAuth } from '../../context/AuthContext';

// --- ATUALIZAÇÃO ---
// Recebemos 'route' para pegar os dados do questionário
export default function RegisterScreen({ route, navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();

  // --- ATUALIZAÇÃO ---
  // Pegamos as respostas que vieram da tela 'QuestionScreen'
  // Usamos 'route.params?.quizAnswers' para evitar erro se 'params' for undefined
  const { quizAnswers } = route.params || {};

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    
    // (Opcional) Log para ver se os dados chegaram
    console.log('Enviando para cadastro:', { name, email, quizAnswers });

    setIsLoading(true);
    try {
      // --- ATUALIZAÇÃO ---
      // Enviamos os dados do questionário JUNTOS com o cadastro
      await signUp(name, email, password, quizAnswers);
      
      // Se der certo, o AuthContext vai atualizar o 'hasCompletedOnboarding'
      // e o App.js vai nos levar para a tela de Login automaticamente.
      Alert.alert(
        'Cadastro Concluído!', 
        'Sua conta foi criada com sucesso. Agora, por favor, faça o login.'
      );
      // O App.js vai tratar da navegação para o Login.

    } catch (e) {
      Alert.alert('Falha no Cadastro', e.message);
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finalizar Cadastro</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha (mín. 6 caracteres)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button 
        title={isLoading ? "Criando conta..." : "Cadastrar e Finalizar"} 
        onPress={handleRegister} 
        disabled={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
   title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    height: 44,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
});