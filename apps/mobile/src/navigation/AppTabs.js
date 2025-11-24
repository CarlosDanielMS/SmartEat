import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

// Importar as telas
import HomeScreen from '../screens/app/HomeScreen';
import AutopilotScreen from '../screens/app/AutopilotScreen';
import CameraScreen from '../screens/app/CameraScreen';
import WeightGoalScreen from '../screens/app/WeightGoalScreen'; 
import NotificationsScreen from '../screens/app/NotificationsScreen';

const Tab = createBottomTabNavigator();

// --- BOTÃO CENTRAL (CORRIGIDO) ---
const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={{
      top: -25, // Sobe um pouco mais para destacar (era -20)
      justifyContent: 'center',
      alignItems: 'center',
      ...styles.shadow
    }}
    onPress={onPress}
    activeOpacity={0.9} // Feedback de toque melhor
  >
    <View style={{
      width: 65, // Tamanho levemente ajustado
      height: 65,
      borderRadius: 32.5, // Metade exata da largura/altura para círculo perfeito
      backgroundColor: '#007AFF', 
      justifyContent: 'center', // Centraliza Verticalmente o Ícone
      alignItems: 'center',     // Centraliza Horizontalmente o Ícone
      borderWidth: 4,           // Borda branca para separar do fundo
      borderColor: '#f2f2f2',   // Cor do fundo da tela (ou branco)
    }}>
      {children}
    </View>
  </TouchableOpacity>
);
// --------------------------------

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false, 
        tabBarStyle: {
          position: 'absolute',
          bottom: 20, // Um pouco mais baixo para modernidade
          left: 15,
          right: 15,
          elevation: 0,
          backgroundColor: '#ffffff',
          borderRadius: 20,
          height: 70, // Altura mais compacta e elegante
          ...styles.shadow,
          borderTopWidth: 0, // Remove linha superior padrão no Android
        },
        headerShown: false 
      }}
    >
      {/* 1. Home */}
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Feather name="home" size={24} color={focused ? '#007AFF' : '#C1C1C1'} />
              {/* Texto removido para visual mais limpo, ou descomente abaixo */}
              {/* <Text style={[styles.label, {color: focused ? '#007AFF' : '#C1C1C1'}]}>Home</Text> */}
            </View>
          ),
        }}
      />

      {/* 2. Autopilot */}
      <Tab.Screen 
        name="Autopilot" 
        component={AutopilotScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Feather name="send" size={24} color={focused ? '#007AFF' : '#C1C1C1'} />
            </View>
          ),
        }}
      />

      {/* 3. Câmera (Botão Central) */}
      <Tab.Screen 
        name="Camera" 
        component={CameraScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            // Ícone centralizado sem container extra que possa deslocar
            <Feather name="camera" size={28} color="#fff" style={{ marginLeft: 1 }} /> 
            // marginLeft: 1 é um hack visual comum para centralizar ícones que parecem deslocados
          ),
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} />
          )
        }}
      />

      {/* 4. Progresso */}
      <Tab.Screen 
        name="Progress" 
        component={WeightGoalScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Feather name="trending-up" size={24} color={focused ? '#007AFF' : '#C1C1C1'} />
            </View>
          ),
        }}
      />

      {/* 5. Avisos */}
      <Tab.Screen 
        name="Notifications" 
        component={NotificationsScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Feather name="bell" size={24} color={focused ? '#007AFF' : '#C1C1C1'} />
            </View>
          ),
        }}
      />

    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000', // Sombra preta padrão
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15, // Mais sutil
    shadowRadius: 5,
    elevation: 5,
  },
  iconContainer: {
    alignItems: 'center', 
    justifyContent: 'center', 
    // top: 10 // Removido para centralizar melhor verticalmente na barra de 70px
  },
  label: {
    fontSize: 9,
    marginTop: 2
  }
});