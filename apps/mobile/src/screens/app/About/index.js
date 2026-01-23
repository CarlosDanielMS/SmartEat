import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import styles from './styles';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Feather name="info" size={32} color="#4CAF50" />
        <Text style={styles.title}>Sobre o SmartEat</Text>
        <Text style={styles.version}>Versão 1.0.0</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>O que é o SmartEat?</Text>
        <Text style={styles.text}>
          O SmartEat é um assistente de nutrição inteligente que ajuda você a
          planejar, acompanhar e ajustar sua dieta com base em metas
          personalizadas e refeições geradas por IA.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Principais recursos</Text>
        <Text style={styles.text}>• Planejamento automático de refeições (AutoPilot)</Text>
        <Text style={styles.text}>• Acompanhamento diário de calorias e macros</Text>
        <Text style={styles.text}>• Diário alimentar e marcação de refeições concluídas</Text>
        <Text style={styles.text}>• Relatórios mensais de atividade</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Objetivo do app</Text>
        <Text style={styles.text}>
          Facilitar o controle nutricional de forma prática, visual e
          integrada ao seu dia a dia, ajudando você a manter constância e
          tomar decisões melhores sobre sua alimentação.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Desenvolvimento</Text>
        <Text style={styles.text}>
          Aplicativo desenvolvido em React Native, integrado ao Supabase
          para autenticação e armazenamento de dados.
        </Text>
      </View>
    </ScrollView>
  );
}
