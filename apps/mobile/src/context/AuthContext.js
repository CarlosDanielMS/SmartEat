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
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);
          setUserToken(session.access_token);
          await refreshProfileFlags(session.user.id);
        }
      } finally {
        setIsLoading(false);
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          setUserToken(session.access_token);
          await refreshProfileFlags(session.user.id);
        } else {
          setUser(null);
          setUserToken(null);
          setHasCompletedOnboarding(false);
        }
      }
    );

    init();
    return () => authListener?.subscription?.unsubscribe();
  }, []);

  const ensureProfileRow = async (userId, fullName) => {
    const { error } = await supabase
      .from('profiles')
      .upsert(
        {
          id: userId,
          full_name: fullName || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (error) throw error;
  };

  const refreshProfileFlags = async (userId) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('quiz_data')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Erro ao ler profile para flags:', error);
      setHasCompletedOnboarding(false);
      return;
    }

    const completed =
      !!profile &&
      !!profile.quiz_data &&
      Object.keys(profile.quiz_data).length > 0;

    setHasCompletedOnboarding(completed);
  };

  // LOGIN (aceita quizAnswers opcional)
  const signIn = async (email, password, quizAnswers) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    const uid = data.user.id;
    const fullName = data.user.user_metadata?.full_name || null;

    // garante linha em profiles
    await ensureProfileRow(uid, fullName);

    // se veio do quiz, salva quiz_data
    if (quizAnswers && Object.keys(quizAnswers).length > 0) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          quiz_data: quizAnswers,
          updated_at: new Date().toISOString(),
        })
        .eq('id', uid);

      if (updateError) {
        console.error('Erro ao salvar quiz_data no login:', updateError);
      }
    }

    await refreshProfileFlags(uid);
    return data;
  };

  // CADASTRO (aceita quizAnswers opcional)
  const signUp = async (name, email, password, quizAnswers) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    if (authError) throw authError;

    const uid = authData.user?.id;
    if (!uid) return authData;

    await ensureProfileRow(uid, name);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: name,
        quiz_data: quizAnswers || {},
        updated_at: new Date().toISOString(),
      })
      .eq('id', uid);

    if (updateError) {
      console.error('Erro ao salvar quiz_data no cadastro:', updateError);
    }

    await refreshProfileFlags(uid);
    return authData;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
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
