import React from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';

import { useQuestion } from './useQuestion';
import styles from './styles';

const ProgressBar = ({ progress }) => (
  <View style={styles.progressContainer}>
    <View style={[styles.progressBar, { width: `${progress}%` }]} />
  </View>
);

export default function QuestionScreen({ route, navigation }) {
  const {
    questionData,
    answer,
    setAnswer,
    isLastQuestion,
    isNavigating,
    navigateForward,
    handleBack,
    handleOptionSelect,
  } = useQuestion(route, navigation);

  const generatePickerItems = (min, max) => {
    let items = [];
    for (let i = min; i <= max; i++) {
      items.push(<Picker.Item key={i} label={String(i)} value={i} />);
    }
    return items;
  };

  const renderInput = () => {
    if (questionData.type === 'single-choice') {
      return questionData.options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.optionButton,
            answer === option.value && styles.optionSelected,
          ]}
          onPress={() => handleOptionSelect(option.value)}
        >
          <Text style={styles.optionText}>{option.text}</Text>
        </TouchableOpacity>
      ));
    }

    if (questionData.type === 'picker-input') {
      return (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={answer}
            onValueChange={(itemValue) => setAnswer(itemValue)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            {generatePickerItems(questionData.min, questionData.max)}
          </Picker>
          <Text style={styles.unitText}>{questionData.unit}</Text>
        </View>
      );
    }

    return <Text>Tipo de pergunta não suportado.</Text>;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View>
            <ProgressBar progress={questionData.progress} />
            <Text style={styles.questionText}>{questionData.question}</Text>
          </View>

          <View style={styles.inputSection}>{renderInput()}</View>

          <View style={styles.navigationButtons}>
            <Button
              title="Voltar"
              onPress={handleBack}
              color="#888"
              disabled={isNavigating}
            />

            {questionData.type === 'picker-input' && (
              <Button
                title={isLastQuestion ? 'Criar Conta' : 'Próxima'}
                onPress={() => navigateForward(answer)}
                disabled={!answer || isNavigating}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
