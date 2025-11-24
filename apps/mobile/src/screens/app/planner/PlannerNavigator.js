import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PlannerTodayScreen from './PlannerTodayScreen';
import PlannerWeekScreen from './PlannerWeekScreen';

const Tab = createMaterialTopTabNavigator();

// Este é o componente que você chamará no App.js
export default function PlannerNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#888',
        tabBarIndicatorStyle: {
          backgroundColor: '#007AFF',
        },
      }}
    >
      <Tab.Screen 
        name="PlannerToday" 
        component={PlannerTodayScreen} 
        options={{ title: 'Hoje' }} // Aba "Dia"
      />
      <Tab.Screen 
        name="PlannerWeek" 
        component={PlannerWeekScreen} 
        options={{ title: 'Semana' }} // Aba "Semana"
      />
    </Tab.Navigator>
  );
}