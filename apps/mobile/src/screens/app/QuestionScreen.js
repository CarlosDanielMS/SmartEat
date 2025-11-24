import React, { useState, useLayoutEffect, useCallback } from 'react'; // <-- 1. Importei o useCallback
import { 
  View, 
  Text, 
  StyleSheet, 
  Button, 
  TouchableOpacity, 
  ScrollView,
  Platform 
} from 'react-native';
// --- 2. Importação Corrigida ---
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker'; 
import { questions } from '../../data/questionData'; 

// --- Componente Interno ---

const ProgressBar = ({ progress }) => (
  <View style={styles.progressContainer}>
    <View style={[styles.progressBar, { width: `${progress}%` }]} />
  </View>
);

// --- Componente Principal da Tela ---

export default function QuestionScreen({ route, navigation }) {
  const { questionIndex } = route.params; 
  const questionData = questions[questionIndex];

  const [isNavigating, setIsNavigating] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState(route.params.answers || {});
  
  const [answer, setAnswer] = useState(
    quizAnswers[questionData.id] || questionData.min || null
  );

  const isLastQuestion = questionIndex === questions.length - 1;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Pergunta ${questionIndex + 1} de ${questions.length}`,
    });
  }, [navigation, questionIndex]);

  // --- NOSSA CORREÇÃO (useCallback) ---
  useFocusEffect(
    useCallback(() => { // <-- 3. Corrigido de React.Callback para useCallback
      setIsNavigating(false);
    }, [])
  );
  // -------------------------

  // Função central para navegar
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

  // Função para gerar os números do Picker
  const generatePickerItems = (min, max) => {
    let items = [];
    for (let i = min; i <= max; i++) {
      items.push(<Picker.Item key={i} label={String(i)} value={i} />);
    }
    return items;
  };

  // Renderiza as opções de resposta com base no 'type' da pergunta
  const renderInput = () => {
    // Caso: Botões de escolha única (Avança sozinho)
    if (questionData.type === 'single-choice') {
      return questionData.options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.optionButton,
            answer === option.value && styles.optionSelected
          ]}
          onPress={() => {
            setAnswer(option.value); 
            navigateForward(option.value); // Navega para a próxima
          }}
        >
          <Text style={styles.optionText}>{option.text}</Text>
        </TouchableOpacity>
      ));
    }

    // Caso: Picker (Seletor giratório)
    if (questionData.type === 'picker-input') {
      return (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={answer} // O valor selecionado
            onValueChange={(itemValue) => setAnswer(itemValue)} // Atualiza o state
            style={styles.picker}
            itemStyle={styles.pickerItem} // (para iOS)
          >
            {/* Gera os itens (ex: 140, 141, 142...) */}
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
          
          <View style={styles.inputSection}>
            {renderInput()}
          </View>
          
          <View style={styles.navigationButtons}>
            <Button 
              title="Voltar" 
              onPress={handleBack} 
              color="#888" 
              disabled={isNavigating} 
            />
            
            {questionData.type === 'picker-input' && (
              <Button 
                title={isLastQuestion ? 'Finalizar Questionário' : 'Próxima'} 
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

// --- Estilos Completos ---
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
  // Estilos para 'single-choice'
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
  // Estilos para 'picker-input'
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
      ios: {
      }
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
      }
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
  // Navegação
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
  },
});