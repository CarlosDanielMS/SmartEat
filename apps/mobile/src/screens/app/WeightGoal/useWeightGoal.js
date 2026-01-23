import { useState } from 'react';
import { Alert, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const MOCK_DATA = {
  photo: null,
  sex: 1,
  height: 175,
  initial_weight: 90,
  weight: 85,
  age: 30,
  model_diet: 2,
  physical_activity_level: 1.375,
  target_weight: 75,
};

export const getSexLabel = (sex) => (sex === 1 ? 'Homem' : 'Mulher');
export const getModelDietLabel = (model) => {
  if (model === 1) return 'Baixa';
  if (model === 2) return 'Média';
  if (model === 3) return 'Alta';
  return 'N/A';
};
export const getPALabel = (level) => {
  const labels = {
    1.2: 'Sedentário',
    1.375: 'Leve atividade',
    1.55: 'Atividade moderada',
    1.725: 'Atividade intensa',
    1.9: 'Atividade muito intensa',
  };
  return labels[level] || 'N/A';
};

export function useWeightGoal() {
  const [mainData, setMainData] = useState(MOCK_DATA);
  const [newWeight, setNewWeight] = useState(String(mainData.weight));
  const [newTargetWeight, setNewTargetWeight] = useState(String(mainData.target_weight));
  const [imageUri, setImageUri] = useState(mainData.photo);

  const screenWidth = Dimensions.get('window').width;

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar sua galeria.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      Alert.alert('Foto atualizada (Modo Teste)', 'A foto foi alterada localmente.');
    }
  };

  const handleUpdateWeight = () => {
    const weightNum = parseFloat(newWeight);
    if (!isNaN(weightNum)) {
      setMainData({ ...mainData, weight: weightNum });
      Alert.alert('Peso Atualizado!', `Seu novo peso é ${weightNum} kg.`);
    } else {
      Alert.alert('Erro', 'Por favor, insira um número válido.');
    }
  };

  const handleUpdateTargetWeight = () => {
    const targetNum = parseFloat(newTargetWeight);
    if (!isNaN(targetNum)) {
      setMainData({ ...mainData, target_weight: targetNum });
      Alert.alert('Objetivo Atualizado!', `Seu novo objetivo é ${targetNum} kg.`);
    } else {
      Alert.alert('Erro', 'Por favor, insira um número válido.');
    }
  };

  const generateChartData = () => {
    const { weight, target_weight } = mainData;
    const weightLossPerWeek = 1;
    
    if (weight <= target_weight) {
      return { labels: ['Agora'], datasets: [{ data: [weight] }] };
    }

    let weeks = [];
    const numWeeks = Math.ceil((weight - target_weight) / weightLossPerWeek);
    
    const maxWeeks = 12;
    const weekStep = numWeeks > maxWeeks ? Math.ceil(numWeeks / maxWeeks) : 1;

    let weights = [];
    
    for (let i = 0; i <= numWeeks; i += weekStep) {
      weeks.push(`S ${i}`);
      let currentWeight = weight - i * weightLossPerWeek;
      weights.push(currentWeight < target_weight ? target_weight : currentWeight);
    }
    
    if (weeks[weeks.length - 1] !== `S ${numWeeks}`) {
       weeks.push(`S ${numWeeks}`);
       weights.push(target_weight);
    }

    return {
      labels: weeks,
      datasets: [{ data: weights, strokeWidth: 2 }],
    };
  };

  const chartData = generateChartData();

  return {
    mainData,
    newWeight,
    setNewWeight,
    newTargetWeight,
    setNewTargetWeight,
    imageUri,
    handlePickImage,
    handleUpdateWeight,
    handleUpdateTargetWeight,
    chartData,
    screenWidth,
  };
}
