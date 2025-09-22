import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";

// Hook de autenticação do contexto global (contém função login)
import { useAuth } from "../context/AuthContext";

/**
 * Tela de Login
 * - Permite ao usuário inserir email e senha
 * - Usa o AuthContext para autenticar com o backend
 * - Exibe erros e estado de carregamento
 */
export default function LoginScreen() {
  const { login } = useAuth(); // função login (faz request /auth/login e salva tokens)

  // Estados locais para email e senha
  const [email, setEmail] = useState("admin@example.com"); // valores padrão para facilitar teste
  const [password, setPassword] = useState("admin123");

  // Estados auxiliares para UI
  const [loading, setLoading] = useState(false); // controla se está logando
  const [error, setError] = useState(""); // mensagem de erro se falhar

  /**
   * Função chamada ao clicar no botão Login
   * - Reseta erro
   * - Chama login(email, password)
   * - Atualiza estado de erro se falhar
   */
  const onSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await login(email, password); // dispara fluxo de autenticação
    } catch (e: any) {
      // Se o backend retornar erro, mostra mensagem
      setError(e?.response?.data?.error || "Login failed");
    }
    setLoading(false);
  };

  return (
    <View style={{ padding: 24, gap: 12 }}>
      {/* Título */}
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>Entrar</Text>

      {/* Mensagem de erro (renderiza apenas se existir) */}
      {!!error && <Text style={{ color: "red" }}>{error}</Text>}

      {/* Campo de email */}
      <TextInput
        placeholder="Email"
        autoCapitalize="none" // não coloca primeira letra maiúscula
        keyboardType="email-address" // teclado adaptado para emails
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10 }}
      />

      {/* Campo de senha */}
      <TextInput
        placeholder="Senha"
        secureTextEntry // oculta texto digitado
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 10 }}
      />

      {/* Botão de login (desabilita se estiver carregando) */}
      <Button
        title={loading ? "..." : "Login"}
        onPress={onSubmit}
        disabled={loading}
      />
    </View>
  );
}
