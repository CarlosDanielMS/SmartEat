import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  TextInput,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { LineChart } from 'react-native-chart-kit';

// Pega a largura da tela para o gráfico
const screenWidth = Dimensions.get('window').width;

// --- DADOS MOCKADOS (Modo Teste) ---
// Em vez de buscar do PHP ($main_data), usamos um estado local.
const MOCK_DATA = {
  photo: null, // Começa sem foto
  sex: 1, // 1 = Homem
  height: 175,
  initial_weight: 90,
  weight: 85, // Peso atual
  age: 30,
  model_diet: 2, // Média
  physical_activity_level: 1.375, // Leve atividade
  target_weight: 75, // Peso objetivo
};

// Funções de tradução (lógica do PHP)
const getSexLabel = (sex) => (sex === 1 ? 'Homem' : 'Mulher');
const getModelDietLabel = (model) => {
  if (model === 1) return 'Baixa';
  if (model === 2) return 'Média';
  if (model === 3) return 'Alta';
  return 'N/A';
};
const getPALabel = (level) => {
  const labels = {
    1.2: 'Sedentário',
    1.375: 'Leve atividade',
    1.55: 'Atividade moderada',
    1.725: 'Atividade intensa',
    1.9: 'Atividade muito intensa',
  };
  return labels[level] || 'N/A';
};

// Componente de Linha de Informação
const InfoRow = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}:</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

// --- Componente Principal ---
export default function WeightGoalScreen() {
  const [mainData, setMainData] = useState(MOCK_DATA);
  
  // Estados para os inputs
  const [newWeight, setNewWeight] = useState(String(mainData.weight));
  const [newTargetWeight, setNewTargetWeight] = useState(String(mainData.target_weight));
  
  // Estado para a foto
  const [imageUri, setImageUri] = useState(mainData.photo);

  // Função para pedir permissão e escolher imagem
  const handlePickImage = async () => {
    // Pedir permissão para acessar a galeria
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar sua galeria.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images, // <--- CORREÇÃO AQUI
      allowsEditing: true,
      aspect: [1, 1], // Foto quadrada
      quality: 0.5,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      // Em um app real, aqui você faria o upload da imagem para a API
      Alert.alert('Foto atualizada (Modo Teste)', 'A foto foi alterada localmente.');
    }
  };

  // Função para atualizar o peso (simulação)
  const handleUpdateWeight = () => {
    const weightNum = parseFloat(newWeight);
    if (!isNaN(weightNum)) {
      setMainData({ ...mainData, weight: weightNum });
      Alert.alert('Peso Atualizado!', `Seu novo peso é ${weightNum} kg.`);
    } else {
      Alert.alert('Erro', 'Por favor, insira um número válido.');
    }
  };
  
  // Função para atualizar o objetivo (simulação)
  const handleUpdateTargetWeight = () => {
    const targetNum = parseFloat(newTargetWeight);
    if (!isNaN(targetNum)) {
      setMainData({ ...mainData, target_weight: targetNum });
      Alert.alert('Objetivo Atualizado!', `Seu novo objetivo é ${targetNum} kg.`);
    } else {
      Alert.alert('Erro', 'Por favor, insira um número válido.');
    }
  };

  // Lógica do Gráfico (copiada do seu PHP)
  const generateChartData = () => {
    const { weight, target_weight } = mainData;
    const weightLossPerWeek = 1; // Simulação
    
    // Prevenir divisão por zero ou loops infinitos
    if (weight <= target_weight) {
      return { labels: ['Agora'], datasets: [{ data: [weight] }] };
    }

    let weeks = [];
    const numWeeks = Math.ceil((weight - target_weight) / weightLossPerWeek);
    
    // Limitar o número de semanas no gráfico para não ficar lotado
    const maxWeeks = 12;
    const weekStep = numWeeks > maxWeeks ? Math.ceil(numWeeks / maxWeeks) : 1;

    let weights = [];
    
    for (let i = 0; i <= numWeeks; i += weekStep) {
      weeks.push(`S ${i}`);
      let currentWeight = weight - i * weightLossPerWeek;
      weights.push(currentWeight < target_weight ? target_weight : currentWeight);
    }
    
    // Garantir que o último ponto seja o objetivo
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Meu Perfil</Text>
            
            <View style={styles.photoSection}>
              <Image 
                // --- CORREÇÃO AQUI ---
                // O caminho correto, baseado na 'arquitetura-projeto.md', é 'assets/images/icon.png'
                source={imageUri ? { uri: imageUri } : require('../../../assets/images/icon.png')} 
                style={styles.photo} 
              />
              <Button title="Trocar Foto" onPress={handlePickImage} />
            </View>

            <InfoRow label="Sexo" value={getSexLabel(mainData.sex)} />
            <InfoRow label="Altura" value={`${mainData.height} cm`} />
            <InfoRow label="Peso Inicial" value={`${mainData.initial_weight} kg`} />
            <InfoRow label="Peso Atual" value={`${mainData.weight} kg`} />
            <InfoRow label="Idade" value={`${mainData.age} anos`} />
            <InfoRow label="Perfil Nutricional" value={getModelDietLabel(mainData.model_diet)} />
            <InfoRow label="Nível de Atividade" value={getPALabel(mainData.physical_activity_level)} />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Atualizar Dados</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Atualizar Peso Atual (kg)</Text>
              <TextInput 
                style={styles.input} 
                value={newWeight}
                onChangeText={setNewWeight}
                keyboardType="numeric" 
              />
              <Button title="Salvar Peso" onPress={handleUpdateWeight} />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Atualizar Objetivo (kg)</Text>
              <TextInput 
                style={styles.input} 
                value={newTargetWeight}
                onChangeText={setNewTargetWeight}
                keyboardType="numeric" 
              />
              <Button title="Salvar Objetivo" onPress={handleUpdateTargetWeight} />
            </View>
          </View>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Projeção de Perda de Peso</Text>
            <LineChart
              data={chartData}
              width={screenWidth - 40} // Largura da tela - padding
              height={220}
              yAxisSuffix="kg"
              chartConfig={{
                backgroundColor: '#e26a00',
                backgroundGradientFrom: '#fb8c00',
                backgroundGradientTo: '#ffa726',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: { borderRadius: 16 },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#eee',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rowLabel: {
    fontSize: 16,
    color: '#333',
  },
  rowValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  input: {
    height: 44,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#fafafa',
  },
});