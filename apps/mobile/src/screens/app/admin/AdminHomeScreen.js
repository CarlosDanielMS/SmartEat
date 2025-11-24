import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Button
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../context/AuthContext'; // <-- CORRIGIDO AQUI (3 PONTOS)

const { width } = Dimensions.get('window');

// --- Este é o "small-box" do seu PHP, traduzido para React ---
const StatBox = ({ title, value, icon, onPress, color }) => (
  <TouchableOpacity 
    style={[styles.statBox, { backgroundColor: color }]} 
    onPress={onPress}
  >
    <View style={styles.statBoxInner}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
    <View style={styles.statIconContainer}>
      <Text style={styles.statIcon}>{icon}</Text>
    </View>
    <View style={styles.statFooter}>
      <Text style={styles.statFooterText}>Mais Informações →</Text>
    </View>
  </TouchableOpacity>
);

// --- A Tela Principal do Admin ---
export default function AdminHomeScreen({ navigation }) { 
  const { signOut } = useAuth(); 

  // Como estamos no Modo Teste, vamos "chumbar" os valores
  const totalUsers = 15;
  const totalFoods = 42;
  const totalAllergens = 5;
  const totalClassifications = 4;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.dashboardTitle}>Dashboard</Text>
        
        {/* Tradução da <div class="row"> */}
        <View style={styles.row}>
          
          {/* Tradução do "small box bg-info" (Usuários) */}
          <StatBox
            title="Usuários"
            value={totalUsers}
            icon="👥"
            color="#17A2B8" // bg-info
            onPress={() => navigation.navigate('ManageUsers')}
          />
          
          {/* Tradução do "small box bg-success" (Alimentos) */}
          <StatBox
            title="Alimentos"
            value={totalFoods}
            icon="🍎"
            color="#28A745" // bg-success
            onPress={() => navigation.navigate('ManageFoods')}
          />

          {/* Novos Botões (Alérgenos e Classificações) */}
           <StatBox
            title="Grupos Alérgenos"
            value={totalAllergens}
            icon="🥜"
            color="#FFC107" // bg-warning
            onPress={() => navigation.navigate('ManageAllergens')}
          />
           <StatBox
            title="Classificações"
            value={totalClassifications}
            icon="🏷️"
            color="#6F42C1" // bg-indigo (cor customizada)
            onPress={() => navigation.navigate('ManageClassifications')}
          />
          
        </View>

        <View style={styles.logoutButton}>
          <Button title="Sair (Logout)" onPress={signOut} color="#ff3b30" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f6f9', // Um cinza claro, como no AdminLTE
  },
  container: {
    padding: 16,
  },
  dashboardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statBox: {
    width: (width / 2) - 24, // Metade da tela, menos o padding
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden', // Para o footer
  },
  statBoxInner: {
    padding: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  statTitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  statIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    opacity: 0.3,
  },
  statIcon: {
    fontSize: 40,
  },
  statFooter: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingVertical: 6,
    alignItems: 'center',
  },
  statFooterText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
  },
  logoutButton: {
    marginTop: 32,
  }
});