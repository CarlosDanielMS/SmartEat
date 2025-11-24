import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// --- MODO DE TESTE (SEM API) ---
// const API_URL = 'http://SEU_IP_AQUI:3000/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Simulação de Banco de Dados em Memória
  const [tempUserDb, setTempUserDb] = useState(null);
  
  // Admin Hardcoded para testes - GARANTINDO QUE ISTO ESTÁ AQUI
  const adminUser = {
    email: 'admin@teste.com',
    password: '123'
  };

  useEffect(() => {
    const loadState = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        const role = await SecureStore.getItemAsync('userRole');
        const onboardingStatus = await AsyncStorage.getItem('hasCompletedOnboarding');

        if (onboardingStatus === 'true') {
            setHasCompletedOnboarding(true);
        }

        if (token) {
          setUserToken(token);
          if (role) {
              setUserRole(role);
          }
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } catch (e) {
        console.error('Falha ao carregar estado inicial', e);
      }
      setIsLoading(false);
    };
    loadState();
  }, []);

  const authContext = {
    signIn: async (email, password) => {
      console.log("MODO TESTE: Tentativa de Login com:", email);
      await new Promise(resolve => setTimeout(resolve, 500));

      let foundUser = null;
      let role = 'user';
      let token = null;

      // 1. Verificar se é ADMIN (Verificação direta e explícita)
      if (email === adminUser.email && password === adminUser.password) {
        console.log("MODO TESTE: Credenciais de Admin reconhecidas!");
        foundUser = adminUser;
        role = 'admin';
        token = "token_de_teste_simulado_ADMIN_123";
      } 
      // 2. Verificar se é USUÁRIO COMUM
      else if (tempUserDb && tempUserDb.email === email && tempUserDb.password === password) {
        console.log("MODO TESTE: Credenciais de Usuário reconhecidas!");
        foundUser = tempUserDb;
        role = 'user';
        token = "token_de_teste_simulado_USER_456";
      }

      if (foundUser) {
        setUserToken(token);
        setUserRole(role);
        await SecureStore.setItemAsync('userToken', token);
        await SecureStore.setItemAsync('userRole', role);
      } else {
        // Mensagem de erro específica
        if (email === adminUser.email) {
           throw new Error("Senha de admin incorreta.");
        } else if (!tempUserDb) {
            throw new Error("Nenhum usuário cadastrado. Cadastre-se primeiro.");
        } else {
            throw new Error("Email ou senha inválidos.");
        }
      }
    },

    signUp: async (name, email, password, quizAnswers) => {
      console.log("MODO TESTE: Cadastrando usuário:", { name, email });
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTempUserDb({ email, password }); 
      
      console.log("MODO TESTE: Usuário salvo na memória temporária.");
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      setHasCompletedOnboarding(true);
    },

    signOut: async () => {
      try {
        setUserToken(null);
        setUserRole(null);
        delete axios.defaults.headers.common['Authorization'];
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userRole');
      } catch (e) {
        console.error('Falha no logout', e);
      }
    },

    userToken,
    userRole,
    isLoading,
    hasCompletedOnboarding,
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};