import React from 'react';
import {
  View,
  Text,
  Button,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';

import {
  useWeightGoal,
  getSexLabel,
  getModelDietLabel,
  getPALabel,
} from './useWeightGoal';
import styles from './styles';

const InfoRow = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}:</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

export default function WeightGoalScreen() {
  const {
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
  } = useWeightGoal();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Meu Perfil</Text>

            <Image
              source={
                imageUri
                  ? { uri: imageUri }
                  : require('../../../../assets/icon.png')
              }
              style={styles.photo}
            />
            <Button title="Trocar Foto" onPress={handlePickImage} />
          </View>

          <InfoRow label="Sexo" value={getSexLabel(mainData.sex)} />
          <InfoRow label="Altura" value={`${mainData.height} cm`} />
          <InfoRow label="Peso Inicial" value={`${mainData.initial_weight} kg`} />
          <InfoRow label="Peso Atual" value={`${mainData.weight} kg`} />
          <InfoRow label="Idade" value={`${mainData.age} anos`} />
          <InfoRow
            label="Perfil Nutricional"
            value={getModelDietLabel(mainData.model_diet)}
          />
          <InfoRow
            label="Nível de Atividade"
            value={getPALabel(mainData.physical_activity_level)}
          />

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
              width={screenWidth - 40}
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
