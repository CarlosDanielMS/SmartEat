// src/features/quiz/screens/QuestionScreen.js
import React, { useState, useLayoutEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

// import correto, partindo de features/quiz/screens → features/quiz/data
import { questions } from '../data/quizData';


const ProgressBar = ({ progress }) => (
  <View style={styles.progressContainer}>
    <View style={[styles.progressBar, { width: `${progress}%` }]} />
  </View>
);

export default function QuestionScreen({ route, navigation }) {
  const { questionIndex } = route.params;
  const questionData = questions[questionIndex];

  const [isNavigating, setIsNavigating] = useState(false);
  const [quizAnswers] = useState(route.params.answers || {});
  const [answer, setAnswer] = useState(
    quizAnswers[questionData.id] || questionData.min || null
  );

  const isLastQuestion = questionIndex === questions.length - 1;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Pergunta ${questionIndex + 1} de ${questions.length}`,
    });
  }, [navigation, questionIndex]);

  useFocusEffect(
    useCallback(() => {
      setIsNavigating(false);
    }, [])
  );

  const navigateForward = (valueToSave) => {
    if (isNavigating) return;
    setIsNavigating(true);

    const newAnswers = { ...quizAnswers, [questionData.id]: valueToSave };

    if (isLastQuestion) {
      console.log('Respostas Finais:', newAnswers);
      navigation.navigate('Register', { quizAnswers: newAnswers });
    } else {
      navigation.push('Question', {
        questionIndex: questionIndex + 1,
        answers: newAnswers,
      });
    }
  };

  const handleBack = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    navigation.goBack();
  };

  const generatePickerItems = (min, max) => {
    const items = [];
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
          onPress={() => {
            setAnswer(option.value);
            navigateForward(option.value);
          }}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  progressContainer: {
    height: 10,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  inputSection: {
    flex: 1,
    justifyContent: 'center',
  },
  optionButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
    alignItems: 'center',
  },
  optionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#e6f2ff',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      android: {
        height: 60,
        backgroundColor: '#fff',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        overflow: 'hidden',
      },
      ios: {},
    }),
  },
  picker: {
    ...Platform.select({
      android: {
        flex: 1,
        height: 60,
      },
      ios: {
        width: 150,
      },
    }),
  },
  pickerItem: {
    height: 150,
  },
  unitText: {
    fontSize: 18,
    marginLeft: 10,
    color: '#555',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
  },
});
