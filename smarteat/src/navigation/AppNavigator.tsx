import React from "react";
// Container principal de navegação do React Navigation
import { NavigationContainer } from "@react-navigation/native";
// Stack navigator nativo (navegação em pilha)
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Hook de autenticação (AuthContext)
import { useAuth } from "../context/AuthContext";

// Telas da aplicação
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import AdminScreen from "../screens/AdminScreen";

// Definição dos tipos de parâmetros para cada rota do stack
// - Aqui nenhuma rota espera parâmetros, então todas são undefined
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Home: undefined;
  Admin: undefined;
};

// Cria o stack navigator tipado
const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Componente de navegação principal
 * - Define quais telas o usuário pode acessar de acordo com o status de autenticação
 */
const AppNavigator = () => {
  // Obtém o status global da autenticação (loading, signedOut, signedIn)
  const { status } = useAuth();

  // Enquanto está carregando (bootstrap do AuthContext) → mostra Splash
  if (status === "loading") {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ headerShown: false }} // oculta header da splash
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  // Se o usuário está deslogado → mostra stack de Login
  return (
    <NavigationContainer>
      {status === "signedOut" ? (
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: "Login" }}
          />
        </Stack.Navigator>
      ) : (
        // Se usuário está autenticado → mostra stack principal (Home + Admin)
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Home" }}
          />
          <Stack.Screen
            name="Admin"
            component={AdminScreen}
            options={{ title: "Admin" }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
