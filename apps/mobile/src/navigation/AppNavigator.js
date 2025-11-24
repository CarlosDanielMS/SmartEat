import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase'; // Certifique-se que o caminho está correto

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Função para buscar a Role do usuário no banco de dados
  const refreshUserRole = async (userId) => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (data) {
        setUserRole(data.role);
      }
    } catch (e) {
      console.log('Erro ao buscar role:', e);
    }
  };

  useEffect(() => {
    const loadSession = async () => {
      setIsLoading(true);
      try {
        // 1. Verificar Onboarding
        const onboardingStatus = await AsyncStorage.getItem('hasCompletedOnboarding');
        if (onboardingStatus === 'true') {
          setHasCompletedOnboarding(true);
        }

        // 2. Recuperar Sessão Ativa do Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setSession(session);
          setUser(session.user);
          await refreshUserRole(session.user.id);
        }
      } catch (error) {
        console.error('Erro ao carregar sessão:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();

    // 3. Ouvinte de eventos de Login/Logout (Automático)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await refreshUserRole(session.user.id);
      } else {
        setUserRole(null);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const authContext = {
    // Login: Apenas chama o Supabase. O useEffect acima detecta a mudança e atualiza o App.
    signIn: async (email, password) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw new Error(error.message);
    },

    // Cadastro: Cria o usuário e salva os dados extras na tabela 'profiles'
    signUp: async (name, email, password, quizAnswers) => {
      // 1. Criar Auth User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name } // Salva nos metadados também
        }
      });

      if (authError) throw new Error(authError.message);
      if (!authData.user) throw new Error("Erro ao criar usuário.");

      // 2. Salvar Perfil e Respostas do Quiz
      // (Se você criou o Trigger SQL acima, o perfil já foi criado, então usamos UPSERT ou UPDATE)
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          full_name: name,
          quiz_data: quizAnswers,
          role: 'user'
        });

      if (profileError) {
        console.log("Aviso: Erro ao salvar perfil extra", profileError);
      }

      // 3. Atualizar flags locais
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      setHasCompletedOnboarding(true);
    },

    signOut: async () => {
      await supabase.auth.signOut();
      // Limpa estados para garantir que a UI atualize
      setUser(null);
      setSession(null);
      setUserRole(null);
    },

    user,
    userToken: session?.access_token, // O App.js verifica se userToken existe para navegar
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

export const useAuth = () => useContext(AuthContext);