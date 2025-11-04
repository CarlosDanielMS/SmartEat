import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { questionarioSteps } from "./questionarioSteps"; // Importa as etapas

// Telas
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/login/Login";
import CadastroScreen from "../screens/cadastro/Cadastro";
import DashboardScreen from "../screens/dashboard/Dashboard";
import QuestionarioScreen from "../screens/questionario/Questionario";

// Interface para as opções de resposta
interface StepOption {
  label: string;
  value: string;
}

// Tipagem para os parâmetros que cada tela do questionário receberá
export type QuestionarioStepParams = {
  title: string;
  dataKey: string;
  nextScreen: keyof RootStackParamList;
  inputType: 'select' | 'text';
  options?: StepOption[];
};

// Lista de todas as rotas e seus parâmetros
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Cadastro: undefined;
  Dashboard: undefined;
  QuestionarioObjetivo: QuestionarioStepParams;
  QuestionarioGenero: QuestionarioStepParams;
  QuestionarioNascimento: QuestionarioStepParams;
  QuestionarioAltura: QuestionarioStepParams;
  QuestionarioPesoAtual: QuestionarioStepParams;
  QuestionarioPesoAlvo: QuestionarioStepParams;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { status } = useAuth();

  if (status === "loading") {
    return <SplashScreen />; // Simplificado para mostrar apenas a splash screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {status === "signedOut" ? (
          <>
            {/* Mapeia e cria uma tela para cada etapa do questionário */}
            {questionarioSteps.map((step, index) => (
              <Stack.Screen
                key={step.name}
                name={step.name}
                component={QuestionarioScreen}
                initialParams={{
                  title: step.title,
                  dataKey: step.dataKey,
                  nextScreen: step.nextScreen,
                  inputType: step.inputType,
                  options: step.options,
                }}
                options={{ title: `Passo ${index + 1} de ${questionarioSteps.length}` }}
              />
            ))}
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ title: "Crie sua Conta" }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: "Meu Dashboard" }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;