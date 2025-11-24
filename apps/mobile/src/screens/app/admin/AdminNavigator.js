import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Home
import AdminHomeScreen from './AdminHomeScreen';
// Placeholders
import ManageAuthenticatorScreen from './authenticator/ManageAuthenticatorScreen';

// CRUD Alérgenos
import ManageAllergensScreen from './allergens/ManageAllergensScreen';
import AddAllergenScreen from './allergens/AddAllergenScreen';
import EditAllergenScreen from './allergens/EditAllergenScreen';

// CRUD Classificações
import ManageClassificationsScreen from './classifications/ManageClassificationsScreen';
import AddClassificationScreen from './classifications/AddClassificationScreen';
import EditClassificationScreen from './classifications/EditClassificationScreen';

// CRUD Alimentos
import ManageFoodsScreen from './foods/ManageFoodsScreen';
import AddFoodScreen from './foods/AddFoodScreen';
import EditFoodScreen from './foods/EditFoodScreen';

// --- 1. IMPORTAÇÃO DAS TELAS DE USUÁRIOS ---
import ManageUsersScreen from './users/ManageUsersScreen';
import AddUserScreen from './users/AddUserScreen';
import EditUserScreen from './users/EditUserScreen';
// ---

const Stack = createNativeStackNavigator();

export default function AdminNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="AdminHome" 
        component={AdminHomeScreen}
        options={{ title: 'Painel de Admin' }}
      />
      
      {/* --- 2. ROTAS DO CRUD DE USUÁRIOS --- */}
      <Stack.Screen 
        name="ManageUsers" 
        component={ManageUsersScreen}
        options={{ title: 'Gerenciar Usuários' }}
      />
      <Stack.Screen 
        name="AddUser" 
        component={AddUserScreen}
        options={{ title: 'Adicionar Usuário' }}
      />
       <Stack.Screen 
        name="EditUser" 
        component={EditUserScreen}
        options={{ title: 'Editar Usuário' }}
      />
       {/* --- FIM DAS ROTAS --- */}
      
      {/* --- Rotas do CRUD de Alimentos --- */}
      <Stack.Screen 
        name="ManageFoods" 
        component={ManageFoodsScreen}
        options={{ title: 'Gerenciar Alimentos' }}
      />
      <Stack.Screen 
        name="AddFood" 
        component={AddFoodScreen}
        options={{ title: 'Adicionar Alimento' }}
      />
       <Stack.Screen 
        name="EditFood" 
        component={EditFoodScreen}
        options={{ title: 'Editar Alimento' }}
      />
       
       {/* --- Rotas do CRUD de Alérgenos --- */}
       <Stack.Screen 
        name="ManageAllergens" 
        component={ManageAllergensScreen}
        options={{ title: 'Grupos Alérgenos' }}
      />
      <Stack.Screen 
        name="AddAllergen" 
        component={AddAllergenScreen}
        options={{ title: 'Adicionar Alérgeno' }}
      />
      <Stack.Screen 
        name="EditAllergen" 
        component={EditAllergenScreen}
        options={{ title: 'Editar Alérgeno' }}
      />

       {/* --- Rotas do CRUD de Classificação --- */}
       <Stack.Screen 
        name="ManageClassifications" 
        component={ManageClassificationsScreen}
        options={{ title: 'Gerenciar Classificações' }}
      />
       <Stack.Screen 
        name="AddClassification" 
        component={AddClassificationScreen}
        options={{ title: 'Adicionar Classificação' }}
      />
       <Stack.Screen 
        name="EditClassification" 
        component={EditClassificationScreen}
        options={{ title: 'Editar Classificação' }}
      />

       <Stack.Screen 
        name="ManageAuthenticator" 
        component={ManageAuthenticatorScreen}
        options={{ title: 'Gerenciar Autenticador' }}
      />
      
    </Stack.Navigator>
  );
}