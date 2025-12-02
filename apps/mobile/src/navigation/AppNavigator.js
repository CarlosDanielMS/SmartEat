import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

// Importar telas de Auth
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Importar Tabs
import AppTabs from './AppTabs';

// Importar telas de Onboarding/Quiz
import QuizStepScreen from '../screens/app/QuizStepScreen';
import QuestionScreen from '../screens/app/QuestionScreen';
import WeightGoalScreen from '../screens/app/WeightGoalScreen';

const Stack = createNativeStackNavigator();

// Tela de Loading
function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#4CAF50" />
      <Text style={styles.loadingText}>Carregando...</Text>
    </View>
  );
}

export default function AppNavigator() {
  const { user, userToken, isLoading, hasCompletedOnboarding } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userToken ? (
          // Usuário autenticado -> vai direto para o App
          <Stack.Screen name="AppTabs" component={AppTabs} />
        ) : (
          // Usuário NÃO autenticado -> Quiz + Login/Register
          <>
            <Stack.Screen 
              name="QuizStep" 
              component={QuizStepScreen}
              initialParams={{ step: 1 }}
            />
            <Stack.Screen 
              name="Question" 
              component={QuestionScreen}
            />
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});
