import React from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useQuizStep } from './useQuizStep';
import styles from './styles';

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

export default function QuizStepScreen({ route, navigation }) {
  const {
    stepData,
    isNavigating,
    isLastStep,
    handleNext,
    handleBack,
  } = useQuizStep(route, navigation);

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
