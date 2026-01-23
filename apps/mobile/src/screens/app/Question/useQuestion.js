import { useState, useLayoutEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { questions } from '../../../data/questionData';

export function useQuestion(route, navigation) {
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

  const handleOptionSelect = (value) => {
    setAnswer(value);
    navigateForward(value);
  };

  return {
    questionData,
    answer,
    setAnswer,
    isLastQuestion,
    isNavigating,
    navigateForward,
    handleBack,
    handleOptionSelect,
  };
}
