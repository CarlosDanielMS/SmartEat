import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../../../context/AuthContext';

export function useLogin(navigation) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    console.log('🔵 [Login] Iniciando login...');
    
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Erro', 'Digite um email válido.');
      return;
    }

    try {
      setLoading(true);
      console.log('🔵 [Login] Tentando autenticar:', email);
      
      // ✅ Login simples - sem quizAnswers
      await signIn(email, password);
      
      console.log('✅ [Login] Login bem-sucedido!');
      // Navegação automática via AuthContext/AppNavigator
    } catch (error) {
      console.error('❌ [Login] Erro:', error);
      Alert.alert(
        'Erro no Login',
        error.message || 'Email ou senha incorretos.'
      );
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    console.log('🔵 [Login] Navegando para Quiz/Registro');
    navigation.navigate('QuizStep', { step: 1 });
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleLogin,
    goToRegister,
  };
}
