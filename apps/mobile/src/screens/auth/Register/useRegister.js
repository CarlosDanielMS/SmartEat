import { useState, useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../../../context/AuthContext';

export function useRegister(navigation, route) {
  // GUARDA SEGURO PARA route.params
  const safeParams =
    route && route.params && typeof route.params === 'object'
      ? route.params
      : {};
  
  const quizAnswers = useMemo(() => 
    safeParams.quizAnswers && typeof safeParams.quizAnswers === 'object'
      ? safeParams.quizAnswers
      : {}, [safeParams.quizAnswers]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();

  useEffect(() => {
    const hasAnswers =
      quizAnswers && typeof quizAnswers === 'object'
        ? Object.keys(quizAnswers).length > 0
        : false;

    if (hasAnswers) {
      console.log('✅ Quiz recebido no Register:', quizAnswers);
      Alert.alert(
        'Quiz Completo!',
        'Suas respostas serão salvas ao criar sua conta.',
        [{ text: 'OK' }]
      );
    }
  }, [quizAnswers]);

  const handleRegister = async () => {
    const hasAnswers =
      quizAnswers && typeof quizAnswers === 'object'
        ? Object.keys(quizAnswers).length > 0
        : false;

    console.log('🔵 [1] Iniciando registro...');
    console.log('📝 Dados:', {
      name,
      email,
      passwordLength: password.length,
      hasQuizAnswers: hasAnswers,
    });

    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    if (!email.includes('@')) {
      Alert.alert('Erro', 'Digite um email válido.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não conferem.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (name.trim().length < 3) {
      Alert.alert('Erro', 'Digite seu nome completo.');
      return;
    }

    try {
      setLoading(true);
      const result = await signUp(name, email, password, quizAnswers || {});
      console.log('✅ SignUp retornou:', result);

      Alert.alert(
        'Sucesso!',
        'Conta criada com sucesso! Faça login para continuar.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            },
          },
        ]
      );
    } catch (error) {
      console.error('❌ [ERRO] Erro no cadastro:', error);
      Alert.alert(
        'Erro no Cadastro',
        error?.message || 'Erro desconhecido. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    navigation.navigate('Login', { quizAnswers: quizAnswers || {} });
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    quizAnswers,
    handleRegister,
    goToLogin
  };
}
