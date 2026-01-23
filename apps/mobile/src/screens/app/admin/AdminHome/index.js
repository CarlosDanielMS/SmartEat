import React from 'react';
import { View, Text, ScrollView, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';
import { useAdminHome } from './useAdminHome';
import StatBox from './components/StatBox';

export default function AdminHomeScreen({ navigation }) { 
  const { signOut, stats } = useAdminHome(); 

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.dashboardTitle}>SmartEat</Text>
        
        {/* Tradução da <div class="row"> */}
        <View style={styles.row}>
          
          {/* Tradução do "small box bg-info" (Usuários) */}
          <StatBox
            title="Usuários"
            value={stats.totalUsers}
            icon="👥"
            color="#17A2B8" // bg-info
            onPress={() => navigation.navigate('ManageUsers')}
          />
          
          {/* Tradução do "small box bg-success" (Alimentos) */}
          <StatBox
            title="Alimentos"
            value={stats.totalFoods}
            icon="🍎"
            color="#28A745" // bg-success
            onPress={() => navigation.navigate('ManageFoods')}
          />

          {/* Novos Botões (Alérgenos e Classificações) */}
           <StatBox
            title="Grupos Alérgenos"
            value={stats.totalAllergens}
            icon="🥜"
            color="#FFC107" // bg-warning
            onPress={() => navigation.navigate('ManageAllergens')}
          />
           <StatBox
            title="Classificações"
            value={stats.totalClassifications}
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
