import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSupport } from './useSupport';
import styles from './styles';

export default function SupportScreen() {
  const { handleEmail } = useSupport();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Ajuda e Suporte</Text>
      <Text style={styles.subtitle}>
        Está com dúvidas ou encontrou algum problema? Veja abaixo algumas orientações
        ou fale diretamente com o suporte.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Dúvidas frequentes</Text>
        <Text style={styles.itemTitle}>• As refeições não aparecem no dia correto</Text>
        <Text style={styles.itemText}>
          Verifique se a data do plano está correta no AutoPilot e se o fuso horário
          do seu aparelho está atualizado.
        </Text>

        <Text style={styles.itemTitle}>• Calorias não batem com o esperado</Text>
        <Text style={styles.itemText}>
          Lembre-se de marcar a refeição como concluída para que ela seja contabilizada
          no resumo diário.
        </Text>

        <Text style={styles.itemTitle}>• Problemas de login</Text>
        <Text style={styles.itemText}>
          Use a opção de redefinição de senha na tela de login. Se o problema continuar,
          envie uma mensagem para o suporte.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Falar com o suporte</Text>
        <Text style={styles.itemText}>
          Se você precisar de ajuda personalizada, pode enviar um email diretamente
          para o desenvolvedor do app.
        </Text>

        <TouchableOpacity style={styles.supportButton} onPress={handleEmail}>
          <Feather name="mail" size={18} color="#fff" />
          <Text style={styles.supportButtonText}>Enviar email para o suporte</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
