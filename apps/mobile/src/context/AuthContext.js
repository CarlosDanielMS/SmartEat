// apps/mobile/src/context/AuthContext.js
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        console.log('🔵 [AuthContext] Verificando sessão...');
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          console.log('✅ [AuthContext] Sessão encontrada:', session.user.email);
          setUser(session.user);
          setUserToken(session.access_token);
          await refreshProfileFlags(session.user.id);
        } else {
          console.log('⚠️ [AuthContext] Nenhuma sessão ativa');
        }
      } catch (error) {
        console.error('❌ [AuthContext] Erro ao verificar sessão:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔵 [AuthContext] Auth state changed:', event);
        
        if (session?.user) {
          console.log('✅ [AuthContext] Usuário autenticado:', session.user.email);
          setUser(session.user);
          setUserToken(session.access_token);
          await refreshProfileFlags(session.user.id);
        } else {
          console.log('⚠️ [AuthContext] Usuário deslogado');
          setUser(null);
          setUserToken(null);
          setHasCompletedOnboarding(false);
        }
      }
    );

    init();
    return () => authListener?.subscription?.unsubscribe();
  }, []);

  const refreshProfileFlags = async (userId) => {
    console.log('🔵 [AuthContext] Buscando perfil do usuário:', userId);
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('quiz_data')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('❌ [AuthContext] Erro ao ler profile:', error);
      setHasCompletedOnboarding(false);
      return;
    }

    if (!profile) {
      console.log('⚠️ [AuthContext] Perfil não encontrado');
      setHasCompletedOnboarding(false);
      return;
    }

    const completed =
      !!profile.quiz_data &&
      Object.keys(profile.quiz_data).length > 0;

    console.log('✅ [AuthContext] Quiz completado?', completed);
    console.log('📊 [AuthContext] Quiz data:', profile.quiz_data);
    setHasCompletedOnboarding(completed);
  };

  // ✅ LOGIN SIMPLIFICADO - Apenas email e password
  const signIn = async (email, password) => {
    console.log('🔵 [AuthContext/SignIn] Iniciando login...');
    console.log('📝 Email:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('❌ [AuthContext/SignIn] Erro:', error);
      throw error;
    }

    console.log('✅ [AuthContext/SignIn] Login bem-sucedido!');
    console.log('👤 Usuário:', data.user.email);
    
    // O onAuthStateChange vai atualizar automaticamente
    return data;
  };

  // ✅ CADASTRO COM QUIZ
  const signUp = async (name, email, password, quizAnswers = {}) => {
    console.log('🔵 [AuthContext/SignUp] Iniciando cadastro...');
    console.log('📝 Dados:', { name, email, hasQuiz: Object.keys(quizAnswers).length > 0 });

    // Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: { full_name: name },
      },
    });

    if (authError) {
      console.error('❌ [AuthContext/SignUp] Erro na autenticação:', authError);
      throw authError;
    }

    const uid = authData.user?.id;
    if (!uid) {
      console.error('❌ [AuthContext/SignUp] User ID não encontrado');
      throw new Error('Erro ao criar usuário');
    }

    console.log('✅ [AuthContext/SignUp] Usuário criado:', uid);
    console.log('⏳ [AuthContext/SignUp] Aguardando criação do perfil...');

    // Aguarda 2 segundos para garantir que o perfil foi criado
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Criar/Atualizar perfil com upsert
    console.log('🔵 [AuthContext/SignUp] Salvando perfil e quiz_data...');
    
    try {
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: uid,
          full_name: name,
          quiz_data: quizAnswers,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id',
        });

      if (upsertError) {
        console.error('❌ [AuthContext/SignUp] Erro ao salvar perfil:', upsertError);
        // Não lança erro, pois o usuário já foi criado
      } else {
        console.log('✅ [AuthContext/SignUp] Perfil e quiz_data salvos com sucesso!');
      }
    } catch (err) {
      console.error('❌ [AuthContext/SignUp] Erro inesperado ao salvar perfil:', err);
    }

    await refreshProfileFlags(uid);
    return authData;
  };

  const signOut = async () => {
    console.log('🔵 [AuthContext/SignOut] Fazendo logout...');
    await supabase.auth.signOut();
    console.log('✅ [AuthContext/SignOut] Logout bem-sucedido!');
  };

  const value = {
    user,
    userToken,
    isLoading,
    hasCompletedOnboarding,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
