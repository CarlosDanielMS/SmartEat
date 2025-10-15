import React from "react";
import { View, Text } from "react-native";

// Hook de autenticação vindo de um AuthContext (criado em outro arquivo)
// - Fornece dados do usuário e funções auxiliares (como hasRole)
import { useAuth } from "../context/AuthContext";

/**
 * Componente de alta ordem (wrapper) que restringe acesso
 * - Renderiza seus filhos apenas se o usuário tiver a role "admin"
 * - Caso contrário, mostra mensagem "Acesso negado"
 */
const AdminOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Obtém do contexto a função hasRole(role: string) → boolean
  const { hasRole } = useAuth();

  // Se o usuário NÃO for admin → mostra mensagem de bloqueio
  if (!hasRole("admin")) {
    return (
      <View style={{ padding: 16 }}>
        <Text>Acesso negado (admin apenas).</Text>
      </View>
    );
  }

  // Se for admin → renderiza normalmente o conteúdo filho
  return <>{children}</>;
};

export default AdminOnly;
