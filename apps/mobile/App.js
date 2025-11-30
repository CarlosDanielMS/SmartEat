import React from 'react';
import { NavigationContainer } from '@react-navigation/native'; // <--- O erro sumirá com isso
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';

// --- TELA DE LOGIN (Simples) ---
function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput placeholder="Email" style={styles.input} />
      <TextInput placeholder="Senha" secureTextEntry style={styles.input} />
      
      <Button title="Entrar" onPress={() => navigation.navigate('Dashboard')} />
      
      <View style={{ marginTop: 20 }}>
        <Button title="Criar Conta" color="gray" onPress={() => navigation.navigate('Cadastro')} />
      </View>
    </View>
  );
}

// --- TELA DE CADASTRO ---
function CadastroScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>
      <TextInput placeholder="Nome" style={styles.input} />
      <TextInput placeholder="Email" style={styles.input} />
      <TextInput placeholder="Senha" secureTextEntry style={styles.input} />
      
      <Button title="Cadastrar" onPress={() => navigation.navigate('Dashboard')} />
    </View>
  );
}

// --- TELA DE DASHBOARD ---
function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Dashboard!</Text>
      <Text>Aqui ficará o conteúdo principal do app.</Text>
    </View>
  );
}

// --- CONFIGURAÇÃO DA NAVEGAÇÃO ---
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// --- ESTILOS BÁSICOS ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  }
});