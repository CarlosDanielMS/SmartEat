import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";

// Importando todas as telas existentes
import SplashScreen from "../screens/SplashScreen";
import Login from "../screens/login/Login";
import Cadastro from "../screens/cadastro/Cadastro";
import Dashboard from "../screens/dashboard/dashboard"; // Importando a nova tela

// Definindo todas as rotas que o app terá
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Cadastro: undefined;
  Dashboard: undefined; // Nome da rota para o dashboard
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { status } = useAuth();

  // Tela de carregamento
  if (status === "loading") {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {status === "signedOut" ? (
          // Telas para usuários deslogados
          <>
            <Stack.Screen name="Login" component={Login} options={{ title: "Login" }} />
            <Stack.Screen name="Cadastro" component={Cadastro} options={{ title: "Crie sua Conta" }} />
          </>
        ) : (
          // Telas para usuários logados
          <>
            <Stack.Screen name="Dashboard" component={Dashboard} options={{ title: "Meu Dashboard" }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;