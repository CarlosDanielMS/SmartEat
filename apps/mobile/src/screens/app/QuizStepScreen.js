import React, { useLayoutEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { infoSteps } from '../../data/quizData'; 

// --- Componentes Internos da Tela ---

const ProgressBar = ({ progress }) => (
  <View style={styles.progressContainer}>
    <View style={[styles.progressBar, { width: `${progress}%` }]} />
  </View>
);

const ListItem = ({ item }) => {
  let styleType = styles.textDefault;
  let prefix = '• '; 

  if (item.type === 'good') {
    styleType = styles.textGood;
    prefix = '✓ ';
  } else if (item.type === 'bad') {
    styleType = styles.textBad;
    prefix = 'X ';
  } else if (item.type === 'neutral') {
    prefix = '* ';
  }

  return (
    <View style={styles.listItem}>
      <Text style={[styles.listText, styleType]}>{prefix}</Text>
      <Text style={[styles.listText, styleType, styles.listItemText]}>{item.text}</Text>
    </View>
  );
};

// --- Componente Principal da Tela ---

export default function QuizStepScreen({ route, navigation }) {
  // ✅ CORREÇÃO: Adicionar valor padrão caso route.params seja undefined
  const step = route.params?.step || 1;
  const [isNavigating, setIsNavigating] = useState(false);
  const stepData = infoSteps[step - 1]; 
  const isLastStep = step === infoSteps.length;

  useLayoutEffect(() => {
    if (stepData) {
      navigation.setOptions({
        title: `Etapa ${step} de ${infoSteps.length}`,
      });
    }
  }, [navigation, step, stepData]);

  useFocusEffect(
    useCallback(() => {
      setIsNavigating(false); 
    }, []) 
  );

  const handleNext = () => {
    if (isNavigating) return; 
    setIsNavigating(true); 

    if (isLastStep) {
      navigation.navigate('Question', { questionIndex: 0 }); 
    } else {
      navigation.push('QuizStep', { step: step + 1 });
    }
  };

  const handleBack = () => {
    if (isNavigating) return; 
    setIsNavigating(true); 
    navigation.goBack();
  };

  if (!stepData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>Etapa não encontrada</Text>
          <Button title="Voltar" onPress={handleBack} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <ProgressBar progress={stepData.progress} />
          
          <Text style={styles.title}>{stepData.title}</Text>
          
          {stepData.texts && stepData.texts.map((text, index) => (
            <Text key={index} style={styles.text}>{text}</Text>
          ))}
          
          {stepData.list && (
            <View style={styles.listContainer}>
              {stepData.list.map((item, index) => (
                <ListItem key={index} item={item} />
              ))}
            </View>
          )}

          {stepData.title2 && <Text style={styles.title2}>{stepData.title2}</Text>}

          {stepData.list2 && (
            <View style={styles.listContainer}>
              {stepData.list2.map((item, index) => (
                <ListItem key={index} item={item} />
              ))}
            </View>
          )}

          {stepData.legal && <Text style={styles.legal}>{stepData.legal}</Text>}

          <View style={styles.navigationButtons}>
            <Button 
              title="Voltar" 
              onPress={handleBack} 
              color="#888" 
              disabled={isNavigating} 
            />
            <Button 
              title={isLastStep ? 'Iniciar Questionário' : 'Próxima'} 
              onPress={handleNext} 
              disabled={isNavigating} 
            />
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  title2: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 22,
    color: '#555',
  },
  legal: {
    fontSize: 12,
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
    marginTop: 20,
  },
  listContainer: {
    marginVertical: 10,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  listText: {
    fontSize: 16,
    lineHeight: 22,
  },
  listItemText: {
    flex: 1, 
  },
  textDefault: {
    color: '#555',
  },
  textGood: {
    color: '#28a745', 
    fontWeight: 'bold',
  },
  textBad: {
    color: '#dc3545', 
    fontWeight: 'bold',
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
