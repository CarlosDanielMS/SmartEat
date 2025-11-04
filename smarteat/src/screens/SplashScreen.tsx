import React from "react";
import { View, ActivityIndicator } from "react-native";

/**
 * Tela Splash
 * - Exibida enquanto o app verifica o estado de autenticação (loading)
 * - Mostra apenas um spinner centralizado
 * - Não possui interações, serve como transição
 */
export default function SplashScreen() {
  return (
    <View
      style={{
        flex: 1, // ocupa toda a tela
        alignItems: "center", // centraliza horizontalmente
        justifyContent: "center", // centraliza verticalmente
      }}
    >
      {/* Indicador de carregamento nativo */}
      <ActivityIndicator />
    </View>
  );
}
