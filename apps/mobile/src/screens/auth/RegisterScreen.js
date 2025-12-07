// apps/mobile/src/screens/auth/RegisterScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

export default function RegisterScreen({ navigation, route }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();

  // respostas do quiz, se vieram do QuestionScreen
  const quizAnswers = route?.params?.quizAnswers || {};

  useEffect(() => {
    if (quizAnswers && Object.keys(quizAnswers).length > 0) {
      console.log('✅ Quiz recebido no Register:', quizAnswers);
      Alert.alert(
        'Quiz Completo! 🎉',
        'Suas respostas serão salvas ao criar sua conta.',
        [{ text: 'OK' }]
      );
    }
  }, []);

  const handleRegister = async () => {
    console.log('🔵 [1] Iniciando registro...');
    console.log('📝 Dados:', { 
      name, 
      email, 
      passwordLength: password.length,
      hasQuizAnswers: Object.keys(quizAnswers).length > 0 
    });

    if (!name || !email || !password || !confirmPassword) {
      console.log('❌ Validação: Campos vazios');
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    if (!email.includes('@')) {
      console.log('❌ Validação: Email inválido');
      Alert.alert('Erro', 'Digite um email válido.');
      return;
    }

    if (password !== confirmPassword) {
      console.log('❌ Validação: Senhas não conferem');
      Alert.alert('Erro', 'As senhas não conferem.');
      return;
    }

    if (password.length < 6) {
      console.log('❌ Validação: Senha muito curta');
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (name.trim().length < 3) {
      console.log('❌ Validação: Nome muito curto');
      Alert.alert('Erro', 'Digite seu nome completo.');
      return;
    }

    console.log('✅ [2] Todas validações passaram');

    try {
      setLoading(true);
      console.log('🔵 [3] Chamando signUp do AuthContext...');
      console.log('📤 Enviando:', { name, email, quizAnswers });
      
      const result = await signUp(name, email, password, quizAnswers);
      
      console.log('✅ [4] SignUp retornou:', result);
      console.log('✅ [5] Cadastro bem-sucedido!');

      Alert.alert(
        'Sucesso!',
        'Conta criada com sucesso! Faça login para continuar.',
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('🔵 [6] Navegando para Login...');
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
      console.error('❌ Mensagem:', error.message);
      console.error('❌ Stack:', error.stack);
      console.error('❌ Erro completo:', JSON.stringify(error, null, 2));
      
      Alert.alert(
        'Erro no Cadastro', 
        error.message || 'Erro desconhecido. Tente novamente.'
      );
    } finally {
      setLoading(false);
      console.log('🔵 [7] Loading finalizado');
    }
  };

  const goToLogin = () => {
    navigation.navigate('Login', { quizAnswers });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.logo}>🍎</Text>
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>
              Comece sua jornada saudável hoje
            </Text>
          </View>

          {quizAnswers && Object.keys(quizAnswers).length > 0 && (
            <View style={styles.quizBanner}>
              <Text style={styles.quizBannerText}>
                ✓ Quiz completo - Suas preferências serão salvas
              </Text>
            </View>
          )}

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome Completo</Text>
              <TextInput
                style={styles.input}
                placeholder="João Silva"
                autoCapitalize="words"
                autoComplete="name"
                value={name}
                onChangeText={setName}
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={styles.input}
                placeholder="Mínimo 6 caracteres"
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password-new"
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar Senha</Text>
              <TextInput
                style={styles.input}
                placeholder='Repita sua senha'
                secureTextEntry
                autoCapitalize='none'
                autoComplete='password-new'
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!loading}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color='#fff' />
              ) : (
                <Text style={styles.buttonText}>Criar Conta</Text>
              )}
            </TouchableOpacity>

            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                Ao criar uma conta, você concorda com nossos{' '}
                <Text style={styles.termsLink}>Termos de Uso</Text> e{' '}
                <Text style={styles.termsLink}>Política de Privacidade</Text>
              </Text>
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OU</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={goToLogin}
              disabled={loading}
            >
              <Text style={styles.secondaryButtonText}>
                Já tenho uma conta
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// estilos (mantidos 100% originais)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  quizBanner: {
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  quizBannerText: {
    color: '#2e7d32',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  termsContainer: {
    marginBottom: 20,
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#999',
    fontSize: 14,
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#34C759',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  secondaryButtonText: {
    color: '#34C759',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
