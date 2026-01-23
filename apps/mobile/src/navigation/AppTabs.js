// apps/mobile/src/navigation/AppTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/app/Home';
import AddFoodScreen from '../screens/app/AddFood';
import CameraScreen from '../screens/app/Camera';
import AutopilotScreen from '../screens/app/Autopilot';
import NotificationsScreen from '../screens/app/Notifications';
import ProfileScreen from '../screens/app/Profile';
import DiaryScreen from '../screens/app/Diary';

import AccountPrivacyScreen from '../screens/app/AccountPrivacy'; // ✅ novo
import ActivityScreen from '../screens/app/Activity';
import SupportScreen from '../screens/app/Support';
import AboutScreen from '../screens/app/About';





const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="AddFood" component={AddFoodScreen} />
      <Stack.Screen name="Diary" component={DiaryScreen} />
    </Stack.Navigator>
  );
}

// ✅ novo stack para perfil
function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="AccountPrivacy" component={AccountPrivacyScreen} />
      <Stack.Screen name="Activity" component={ActivityScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="About" component={AboutScreen} /> 


    </Stack.Navigator>
  );
}

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Camera') {
            iconName = focused ? 'camera' : 'camera-outline';
          } else if (route.name === 'Autopilot') {
            iconName = focused ? 'nutrition' : 'nutrition-outline';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
        headerStyle: { backgroundColor: '#4CAF50' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ title: 'SmartEat - Nutrição Inteligente' }}
      />
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{ title: 'Câmera' }}
      />
      <Tab.Screen
        name="Autopilot"
        component={AutopilotScreen}
        options={{ title: 'Autopilot' }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: 'Notificações' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}   // ✅ agora usa o stack, não o Profile direto
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}

