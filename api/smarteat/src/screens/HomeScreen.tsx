import React from "react";
import { View, Text, Button, Alert } from "react-native";

// Hook do contexto de autenticação (dados do usuário, funções de login/logout)
import { useAuth } from "../context/AuthContext";

// Cliente Axios configurado com tokens e interceptors
import { API } from "../api/client";

/**
 * Tela principal (Home)
 * - Mostra dados do usuário autenticado
 * - Permite chamar endpoints privados (/me e /admin/metrics)
 * - Possui navegação para tela Admin
 * - Permite logout
 */
export default function HomeScreen({ navigation }: any) {
  const { user, logout } = useAuth(); // pega usuário logado e função de logout

  /**
   * Chamada ao endpoint privado /private/me
   * - Retorna informações do usuário autenticado
   * - Mostra resultado em um Alert
   */
  const callMe = async () => {
    try {
      const { data } = await API.get("/private/me");
      Alert.alert("ME", JSON.stringify(data));
    } catch (e: any) {
      Alert.alert("Erro", e?.response?.data?.error || "Falha");
    }
  };

  /**
   * Chamada ao endpoint /private/admin/metrics
   * - Requer role "admin"
   * - Se autorizado → mostra métricas
   * - Se não autorizado → mostra mensagem de erro
   */
  const callAdmin = async () => {
    try {
      const { data } = await API.get("/private/admin/metrics");
      Alert.alert("ADMIN", JSON.stringify(data));
    } catch (e: any) {
      Alert.alert("Sem permissão", JSON.stringify(e?.response?.data || {}));
    }
  };

  return (
    <View style={{ padding: 24, gap: 12 }}>
      {/* Saudação personalizada com o email do usuário */}
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>
        Bem-vindo, {user?.email}
      </Text>

      {/* Botão para chamar rota protegida /me */}
      <Button title="/private/me" onPress={callMe} />

      {/* Botão para chamar rota restrita a admin */}
      <Button title="/private/admin/metrics" onPress={callAdmin} />

      {/* Navegação para tela Admin (UI protegida por <AdminOnly>) */}
      <Button
        title="Ir para tela Admin"
        onPress={() => navigation.navigate("Admin")}
      />

      {/* Botão de logout → limpa tokens e volta ao estado signedOut */}
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
