import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList, QuestionarioStepParams } from "../../navigation/AppNavigator";
import { useQuestionario } from "../../context/Questionario";
import { styles } from "./styles";

type QuestionarioScreenProps = {
  route: { params: QuestionarioStepParams };
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export default function QuestionarioScreen({ route, navigation }: QuestionarioScreenProps) {
  const { title, dataKey, nextScreen, inputType, options } = route.params;
  const { updateData } = useQuestionario();

  // Estado para o valor bruto (sem máscara)
  const [rawValue, setRawValue] = useState("");
  // Estado para o valor formatado (com máscara) que o usuário vê
  const [formattedValue, setFormattedValue] = useState("");

  const handleNext = (valueToSave: string) => {
    if (!valueToSave.trim()) {
      Alert.alert("Atenção", "Por favor, forneça uma resposta.");
      return;
    }
    updateData(dataKey, valueToSave.trim());
    navigation.navigate(nextScreen as any);
  };

  // Função para aplicar as máscaras
  const handleInputChange = (text: string) => {
    const cleanedText = text.replace(/[^0-9]/g, ''); // Remove tudo que não for número

    let newFormattedValue = cleanedText;
    let newRawValue = cleanedText;

    switch (dataKey) {
      case 'anoNascimento':
        if (cleanedText.length > 2) {
          newFormattedValue = `${cleanedText.slice(0, 2)}/${cleanedText.slice(2)}`;
        }
        if (cleanedText.length > 4) {
          newFormattedValue = `${cleanedText.slice(0, 2)}/${cleanedText.slice(2, 4)}/${cleanedText.slice(4, 8)}`;
        }
        newRawValue = newFormattedValue.slice(0, 10); // Limita ao formato DD/MM/AAAA
        break;

      case 'altura':
        if (cleanedText.length > 1) {
          newFormattedValue = `${cleanedText.slice(0, 1)}.${cleanedText.slice(1, 3)}`;
        }
        newRawValue = newFormattedValue.replace('.', '');
        break;

      case 'pesoAtual':
      case 'pesoAlvo':
        if (cleanedText.length > 2) {
          newFormattedValue = `${cleanedText.slice(0, -1)}.${cleanedText.slice(-1)}`;
        }
        newRawValue = newFormattedValue.replace('.', '');
        break;

      default:
        newRawValue = text;
        newFormattedValue = text;
        break;
    }

    setFormattedValue(newFormattedValue);
    setRawValue(newRawValue);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>

        {inputType === 'select' && options ? (
          <View style={styles.optionsContainer}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.optionButton}
                onPress={() => handleNext(option.value)}
              >
                <Text style={styles.optionButtonText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <TextInput
            style={styles.input}
            value={formattedValue} // Mostra o valor formatado
            onChangeText={handleInputChange} // Chama a função de formatação
            placeholder={dataKey === 'anoNascimento' ? 'DD/MM/AAAA' : 'Sua resposta'}
            keyboardType="numeric" // Sempre numérico para os campos com máscara
            maxLength={dataKey === 'anoNascimento' ? 10 : undefined} // Limita o tamanho para a data
          />
        )}
      </View>

      {inputType === 'text' && (
        <TouchableOpacity style={styles.button} onPress={() => handleNext(formattedValue)}>
          <Text style={styles.buttonText}>Próximo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}