import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import QuizStepScreen from './src/screens/app/QuizStepScreen';
import QuestionScreen from './src/screens/app/QuestionScreen';
import WeightGoalScreen from './src/screens/app/WeightGoalScreen';
import PlannerNavigator from './src/screens/app/planner/PlannerNavigator';
import AdminNavigator from './src/screens/app/admin/AdminNavigator';

// --- 1. Importar a nova tela de Perfil ---
import ProfileScreen from './src/screens/app/ProfileScreen';
// ----------------------------------------

import AppTabs from './src/navigation/AppTabs'; 
import { AuthProvider, useAuth } from './src/context/AuthContext';

const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();
const OnboardingStack = createNativeStackNavigator();

function OnboardingNavigator() {
  // ... (mantém igual)
  return (
    <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
      <OnboardingStack.Screen
        name="QuizStep"
        component={QuizStepScreen}
        initialParams={{ step: 1 }}
      />
      <OnboardingStack.Screen
        name="Question"
        component={QuestionScreen}
        options={{ headerShown: true, title: 'Questionário' }}
      />
      <OnboardingStack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: true, title: 'Crie sua conta' }}
      />
    </OnboardingStack.Navigator>
  );
}

function AuthNavigator() {
  // ... (mantém igual)
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen 
        name="Register" 
        component={RegisterScreen} 
        options={{ headerShown: true, title: 'Crie sua conta' }}
      />
    </AuthStack.Navigator>
  );
}

function AppNavigator() {
  return (
    <AppStack.Navigator>
      <AppStack.Screen 
        name="Main" 
        component={AppTabs} 
        options={{ headerShown: false }} 
      />
      
      {/* --- 2. Adicionar a rota 'Profile' ao AppStack --- */}
      <AppStack.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Meu Perfil' }} // Cabeçalho padrão com botão de voltar
      />
      {/* ----------------------------------------------- */}

      <AppStack.Screen 
        name="Planner" 
        component={PlannerNavigator}
        options={{ title: 'Meu Planejador' }}
      />
       <AppStack.Screen 
        name="WeightGoal" 
        component={WeightGoalScreen}
        options={{ title: 'Peso e Objetivo' }}
      />
      <AppStack.Screen 
        name="QuizStep" 
        component={QuizStepScreen} 
        options={{ title: 'Quiz' }}
      />
      <AppStack.Screen 
        name="Question" 
        component={QuestionScreen} 
        options={{ title: 'Perguntas' }}
      />
    </AppStack.Navigator>
  );
}

function RootNavigator() {
  const { userToken, userRole, isLoading, hasCompletedOnboarding } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (userToken != null) {
    if (userRole === 'admin') {
      return <AdminNavigator />;
    } else {
      return <AppNavigator />;
    }
  } else if (hasCompletedOnboarding) {
    return <AuthNavigator />;
  } else {
    return <OnboardingNavigator />;
  }
}

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});