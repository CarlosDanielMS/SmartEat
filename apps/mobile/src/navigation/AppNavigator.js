import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
// Importamos o AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import axios from 'axios';

// const API_URL = 'https://sua-api.com/api';
// Usando seu IP local (exemplo):
const API_URL = 'http://192.168.1.5:3000/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- NOSSA NOVA FLAG ---
  // Esta flag controla se o usuário já viu o onboarding/cadastro
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    const loadState = async () => {
      try {
        // 1. Tenta carregar o TOKEN (se estiver logado)
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
          setUserToken(token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          // 2. Se não tem token, verifica se já completou o onboarding
          const onboardingStatus = await AsyncStorage.getItemAsync('hasCompletedOnboarding');
          if (onboardingStatus === 'true') {
            setHasCompletedOnboarding(true);
          }
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
      // (A lógica de login não muda)
      try {
        const response = await axios.post(`${API_URL}/login`, {
          email: email,
          password: password,
        });
        
        const token = response.data.token;
        setUserToken(token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await SecureStore.setItemAsync('userToken', token);
      } catch (e) {
        console.error('Falha no login', e.response?.data);
        throw new Error(e.response?.data?.message || 'Erro de rede');
      }
    },

    // --- ATUALIZAMOS O CADASTRO ---
    // Agora ele aceita as respostas do questionário
    signUp: async (name, email, password, quizAnswers) => {
      try {
        // Enviamos NOME, EMAIL, SENHA e as RESPOSTAS para a API
        await axios.post(`${API_URL}/cadastro`, {
          name: name,
          email: email,
          password: password,
          quizData: quizAnswers, // Enviando os dados do questionário
        });

        // --- MUDANÇA IMPORTANTE ---
        // 1. Marcamos que o onboarding foi concluído
        await AsyncStorage.setItemAsync('hasCompletedOnboarding', 'true');
        setHasCompletedOnboarding(true);
        
        // 2. NÃO fazemos login automático.
        // O App.js vai reagir a 'hasCompletedOnboarding' e mostrar o Login.

      } catch (e) {
        console.error('Falha no cadastro', e.response?.data);
        throw new Error(e.response?.data?.message || 'Erro de rede');
      }
    },

    signOut: async () => {
      // (A lógica de logout não muda)
      try {
        setUserToken(null);
        delete axios.defaults.headers.common['Authorization'];
        await SecureStore.deleteItemAsync('userToken');
      } catch (e) {
        console.error('Falha no logout', e);
      }
      // 'hasCompletedOnboarding' continua 'true', então o usuário
      // será direcionado para o Login, o que está correto.
    },
    
    userToken,
    isLoading,
    hasCompletedOnboarding, // <-- Exportamos a nova flag
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