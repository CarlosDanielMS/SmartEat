import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
// Importa o formulário reutilizável
import FoodForm from '../../../../components/admin/FoodForm'; // <-- 4 PONTOS AGORA

export default function EditFoodScreen({ route, navigation }) {
  // Recebe o item que foi clicado na lista
  const { item } = route.params;

  const handleUpdate = (formData) => {
    console.log("Alimento Editado (Modo Teste):", formData);
    // Devolve o item atualizado para a tela de lista
    navigation.navigate('ManageFoods', { updatedItem: { ...item, ...formData } });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FoodForm 
        initialData={item} // Passa os dados iniciais
        onSubmit={handleUpdate} 
      />
    </SafeAreaView>
  );
}