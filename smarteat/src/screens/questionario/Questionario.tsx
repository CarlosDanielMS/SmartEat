import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import type { NativeStackScreenProps, NativeStackNavigationProp } from "@react-navigation/native-stack";
// Ajuste o caminho abaixo conforme a localização real do arquivo AppNavigator.ts
import type { RootStackParamList, QuestionarioStepParams } from "../../navigation/AppNavigator";
import { useQuestionario } from "../../context/Questionario";
import { styles } from "./styles";

// Definimos que a tela receberá parâmetros para saber o que perguntar
type QuestionarioScreenProps = {
  route: { params: QuestionarioStepParams };
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export default function QuestionarioScreen({ route, navigation }: QuestionarioScreenProps) {
  const { title, dataKey, nextScreen } = route.params as QuestionarioStepParams; // Recebe os parâmetros
  const { updateData } = useQuestionario();
  const [value, setValue] = useState("");

  const handleNext = () => {
    if (!value) {
      Alert.alert("Atenção", "Por favor, preencha o campo.");
      return;
    }
    // Salva o valor no contexto
    updateData(dataKey, value);
  // Navega para a próxima tela definida nos parâmetros
  // O cast abaixo resolve uma sobrecarga do TypeScript onde a função espera literais
  navigation.navigate(nextScreen as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
          placeholder="Sua resposta"
          // Adapta o teclado para números quando necessário
          keyboardType={
            ["anoNascimento", "altura", "pesoAtual", "pesoAlvo", "refeicoesPorDia"].includes(dataKey)
              ? "numeric"
              : "default"
          }
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Próximo</Text>
      </TouchableOpacity>
    </View>
  );
}