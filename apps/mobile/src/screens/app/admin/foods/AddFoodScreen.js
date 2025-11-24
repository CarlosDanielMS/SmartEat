import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
// Importa o formulário reutilizável
import FoodForm from '../../../../components/admin/FoodForm'; // <-- 4 PONTOS AGORA

export default function AddFoodScreen({ navigation }) {

  const handleSave = (formData) => {
    console.log("Novo Alimento (Modo Teste):", formData);
    // Devolve o novo item para a tela de lista
    navigation.navigate('ManageFoods', { newItem: formData });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FoodForm 
        onSubmit={handleSave} 
      />
    </SafeAreaView>
  );
}