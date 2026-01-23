import { useState, useLayoutEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { infoSteps } from '../../../data/quizData';

export function useQuizStep(route, navigation) {
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

  return {
    stepData,
    isNavigating,
    isLastStep,
    handleNext,
    handleBack,
  };
}
