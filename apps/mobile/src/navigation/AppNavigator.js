// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

import { useAuth } from '../context/AuthContext';

import LoginScreen from '../screens/auth/Login';
import RegisterScreen from '../screens/auth/Register';
import QuizStepScreen from '../screens/app/QuizStep';
import QuestionScreen from '../screens/app/Question';
import WeightGoalScreen from '../screens/app/WeightGoal';

import AppTabs from './AppTabs';
import TacoFoodsScreen from '../screens/TacoFoodsScreen'; // ajuste o caminho

const Stack = createNativeStackNavigator();

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#4CAF50" />
      <Text style={styles.loadingText}>Carregando...</Text>
    </View>
  );
}

export default function AppNavigator() {
  const { userToken, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userToken ? (
          <>
            <Stack.Screen
              name="AppTabs"
              component={AppTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TacoFoods"
              component={TacoFoodsScreen}
              options={{ title: 'Alimentos TACO', headerShown: true }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen
              name="QuizStep"
              component={QuizStepScreen}
              initialParams={{ step: 1 }}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Question" component={QuestionScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
            <Stack.Screen name="WeightGoal" component={WeightGoalScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
});
