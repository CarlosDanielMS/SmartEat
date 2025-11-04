import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";

// Importando as telas e o arquivo de configuração
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/login/Login";
import Cadastro from "../screens/cadastro/Cadastro";
import Dashboard from "../screens/dashboard/Dashboard";
import Questionario from "../screens/questionario/Questionario";
import { questionarioSteps } from "./questionarioSteps"; // <- Importa as etapas


// Adicionando todas as rotas do questionário à lista de tipos
export type QuestionarioStepParams = {
  title: string;
  dataKey: any;
  nextScreen: keyof RootStackParamList;
};

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
    // ... código da splash screen ...
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {status === "signedOut" ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />

            {/* CRIA UMA TELA PARA CADA ETAPA DO QUESTIONÁRIO DINAMICAMENTE */}
            {questionarioSteps.map((step) => (
              <Stack.Screen
                key={step.name}
                name={step.name}
                component={Questionario}
                initialParams={{
                  title: step.title,
                  dataKey: step.dataKey,
                  nextScreen: step.nextScreen,
                }}
                options={{ title: step.title }}
              />
            ))}

            <Stack.Screen name="Cadastro" component={Cadastro} options={{ title: "Crie sua Conta" }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Dashboard" component={Dashboard} options={{ title: "Meu Dashboard" }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;