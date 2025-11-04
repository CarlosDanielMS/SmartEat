import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { postData } from '../services/api';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await postData('login', { email, password });
      // exemplo: se sucesso, navegar ou exibir mensagem
      Alert.alert('Login', response.message || 'Sucesso!');
    } catch (err) {
      Alert.alert('Erro', err.message || 'Falha ao autenticar');
    }
    setLoading(false);
  };
  
  return (
    <View style={{padding: 24}}>
      <Text>Faça login para iniciar sua sessão</Text>
      <TextInput
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={{marginVertical: 8, borderWidth: 1}}
      />
      <TextInput
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{marginVertical: 8, borderWidth: 1}}
      />
      <Button onPress={handleLogin} title={loading ? "Entrando..." : "Entrar"} />
    </View>
  );
}
