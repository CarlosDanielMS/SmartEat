import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  ScrollView,
  Dimensions 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

// --- Componente Circular Progress Reutilizável ---
const CircularProgress = ({ value, max, color, size = 80, strokeWidth = 8, label, unit, showMax = true }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = max > 0 ? Math.min(value / max, 1) : 0; // Evita divisão por zero
  const strokeDashoffset = circumference - progress * circumference;

  // Ajuste de tamanho da fonte baseado no tamanho do círculo
  const valueFontSize = size * 0.22;
  const labelFontSize = size * 0.15;

  return (
    <View style={{ alignItems: 'center', margin: 8 }}>
      <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
        <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
          {/* Fundo do Círculo */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E0E0E0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progresso */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </Svg>
        {/* Texto Central */}
        <View style={styles.circleTextContainer}>
          <Text style={[styles.circleValueText, { fontSize: valueFontSize }]}>
            {Math.round(value * 10) / 10} {/* Arredonda para 1 casa decimal se necessário */}
          </Text>
          {showMax && (
            <Text style={[styles.circleMaxText, { fontSize: labelFontSize }]}>
              /{max}{unit}
            </Text>
          )}
           {!showMax && (
            <Text style={[styles.circleMaxText, { fontSize: labelFontSize }]}>
              {unit}
            </Text>
          )}
        </View>
      </View>
      <Text style={[styles.circleLabel, { fontSize: labelFontSize }]}>{label}</Text>
    </View>
  );
};

// Dados mockados (mantidos iguais)
const MICRONUTRIENTS_DATA = {
  vitamins: [
    { name: 'B1', fullName: 'Vitamina B1', value: 1.1, target: 1.2, unit: 'mg', color: '#FF9800' },
    { name: 'B2', fullName: 'Vitamina B2', value: 1.2, target: 1.3, unit: 'mg', color: '#FF9800' },
    { name: 'B3', fullName: 'Vitamina B3', value: 14, target: 16, unit: 'mg', color: '#FF9800' },
    { name: 'B6', fullName: 'Vitamina B6', value: 1.2, target: 1.3, unit: 'mg', color: '#FF9800' },
  ],
  minerals: [
    { name: 'Cálcio', value: 850, target: 1000, unit: 'mg', color: '#00BCD4' },
    { name: 'Magnésio', value: 310, target: 400, unit: 'mg', color: '#00BCD4' },
    { name: 'Fósforo', value: 650, target: 700, unit: 'mg', color: '#00BCD4' },
    { name: 'Ferro', value: 13, target: 18, unit: 'mg', color: '#00BCD4' },
    { name: 'Sódio', value: 1800, target: 2300, unit: 'mg', color: '#00BCD4' },
    { name: 'Potássio', value: 2900, target: 3500, unit: 'mg', color: '#00BCD4' },
    { name: 'Manganês', value: 1.9, target: 2.3, unit: 'mg', color: '#00BCD4' },
    { name: 'Cobre', value: 0.8, target: 0.9, unit: 'mg', color: '#00BCD4' },
    { name: 'Zinco', value: 9.5, target: 11, unit: 'mg', color: '#00BCD4' },
  ],
  others: [
    { name: 'Fibras', value: 28, target: 30, unit: 'g', color: '#8BC34A' },
    { name: 'Colesterol', value: 180, target: 300, unit: 'mg', color: '#E91E63' },
  ],
  additives: [
    { code: 'E339', name: 'Sodium phosphates' },
    { code: 'E339i', name: 'Monosodium phosphate' },
    { code: 'E450', name: 'Diphosphates' },
    { code: 'E450iii', name: 'Tetrasodium diphosphate' },
    { code: 'E452', name: 'Polyphosphates' },
    { code: 'E452vi', name: 'Sodium tripolyphosphate' },
    { code: 'E500', name: 'Sodium carbonates' },
    { code: 'E500i', name: 'Sodium carbonate' },
    { code: 'E501', name: 'Potassium carbonates' },
    { code: 'E501i', name: 'Potassium carbonate' },
    { code: 'E621', name: 'Monosodium glutamate' },
    { code: 'E627', name: 'Disodium guanylate' },
    { code: 'E631', name: 'Disodium inosinate' },
  ]
};

const MicronutrientsModal = ({ visible, onClose }) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Micronutrientes</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Feather name="x" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
          
          <Text style={styles.nutrientSectionTitle}>Vitaminas</Text>
          <View style={styles.circlesGrid}>
            {MICRONUTRIENTS_DATA.vitamins.map((item, index) => (
              <CircularProgress 
                key={index}
                label={item.name} 
                value={item.value} 
                max={item.target} 
                color={item.color} 
                unit={item.unit}
                size={70} // Tamanho um pouco menor para o modal
                strokeWidth={6}
              />
            ))}
          </View>

          <Text style={styles.nutrientSectionTitle}>Minerais</Text>
          <View style={styles.circlesGrid}>
            {MICRONUTRIENTS_DATA.minerals.map((item, index) => (
              <CircularProgress 
                key={index}
                label={item.name} 
                value={item.value} 
                max={item.target} 
                color={item.color} 
                unit={item.unit}
                size={70}
                strokeWidth={6}
              />
            ))}
          </View>

          <Text style={styles.nutrientSectionTitle}>Outros</Text>
          <View style={styles.circlesGrid}>
            {MICRONUTRIENTS_DATA.others.map((item, index) => (
              <CircularProgress 
                key={index}
                label={item.name} 
                value={item.value} 
                max={item.target} 
                color={item.color} 
                unit={item.unit}
                size={70}
                strokeWidth={6}
              />
            ))}
          </View>

          <Text style={styles.nutrientSectionTitle}>Aditivos</Text>
          <View style={styles.additivesContainer}>
            {MICRONUTRIENTS_DATA.additives.map((item, index) => (
              <View key={index} style={styles.additiveItem}>
                <Text style={styles.additiveCode}>{item.code}</Text>
                <Text style={styles.additiveName}>{item.name}</Text>
              </View>
            ))}
          </View>
          <View style={{height: 40}} />
        </ScrollView>
      </View>
    </View>
  </Modal>
);

export default function DailyProgress({ data }) {
  const [modalVisible, setModalVisible] = useState(false);

  const PROTEIN_COLOR = '#00C853'; // Verde
  const CARBS_COLOR = '#FFAB00';   // Laranja
  const FAT_COLOR = '#D50000';     // Vermelho

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seu progresso - Macros</Text>

      {/* Resumo de Calorias */}
      <View style={styles.caloriesContainer}>
        <View style={styles.calorieItem}>
          <Text style={styles.calorieLabel}>Meta</Text>
          <Text style={styles.calorieValue}>{data.calories.target}</Text>
          <Text style={styles.calorieUnit}>kcal</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.calorieItem}>
          <Text style={styles.calorieLabel}>Consumido</Text>
          <Text style={[styles.calorieValue, { color: '#007AFF' }]}>{data.calories.eaten}</Text>
          <Text style={styles.calorieUnit}>kcal</Text>
        </View>
      </View>

      {/* Círculos de Macros Principais */}
      <View style={styles.circlesContainer}>
        <CircularProgress 
          label="Proteínas" 
          value={data.macros.protein_eaten || 120} 
          max={data.macros.protein} 
          color={PROTEIN_COLOR} 
          unit="g"
          size={90}
          strokeWidth={8}
        />
        <CircularProgress 
          label="Carboidratos" 
          value={data.macros.carbs_eaten || 110} 
          max={data.macros.carbs} 
          color={CARBS_COLOR} 
          unit="g"
          size={90}
          strokeWidth={8}
        />
        <CircularProgress 
          label="Gorduras" 
          value={data.macros.fat_eaten || 35} 
          max={data.macros.fat} 
          color={FAT_COLOR} 
          unit="g"
          size={90}
          strokeWidth={8}
        />
      </View>

      <TouchableOpacity style={styles.linkContainer} onPress={() => setModalVisible(true)}>
        <Feather name="info" size={16} color="#007AFF" />
        <Text style={styles.linkText}>Ver micronutrientes e detalhes</Text>
      </TouchableOpacity>

      <MicronutrientsModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  caloriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 12,
  },
  calorieItem: {
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: '#ddd',
    height: '80%',
    alignSelf: 'center',
  },
  calorieLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  calorieValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  calorieUnit: {
    fontSize: 12,
    color: '#888',
  },
  circlesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Distribui os círculos uniformemente
    marginBottom: 10,
  },
  // Novos Estilos para a Grade de Círculos no Modal
  circlesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center', // Centraliza os círculos
    marginBottom: 15,
  },
  circleTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleValueText: {
    fontWeight: 'bold',
    color: '#333',
  },
  circleMaxText: {
    color: '#888',
  },
  circleLabel: {
    marginTop: 4,
    fontWeight: '600',
    color: '#555',
    textAlign: 'center',
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%', // Altura do modal
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    flex: 1,
  },
  nutrientSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: '#F0F8FF',
    padding: 8,
    borderRadius: 6,
    textAlign: 'center', // Centraliza o título da seção
  },
  additivesContainer: {
    marginTop: 5,
  },
  additiveItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  additiveCode: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  additiveName: {
    fontSize: 14,
    color: '#666',
  },
});