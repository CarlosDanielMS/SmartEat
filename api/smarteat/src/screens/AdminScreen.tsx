import React from "react";
import { View, Text } from "react-native";

// Componente que protege conteúdo visível apenas para usuários com papel "admin"
import AdminOnly from "../components/AdminOnly";

/**
 * Tela de administração
 * - Envolve todo o conteúdo com <AdminOnly>
 * - Se o usuário for admin → mostra a área restrita
 * - Caso contrário → AdminOnly exibe mensagem "Acesso negado"
 */
export default function AdminScreen() {
  return (
    <AdminOnly>
      <View style={{ padding: 24 }}>
        {/* Título em destaque */}
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>
          Área do Administrador
        </Text>

        {/* Texto explicativo */}
        <Text>Somente usuários com papel `admin` podem ver esta tela.</Text>
      </View>
    </AdminOnly>
  );
}
