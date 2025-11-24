import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
// Importa o formulário reutilizável
import UserForm from '../../../../components/admin/UserForm'; // <-- 4 PONTOS AGORA

export default function EditUserScreen({ route, navigation }) {
  // Recebe o item que foi clicado na lista
  const { item } = route.params;

  const handleUpdate = (formData) => {
    console.log("Usuário Editado (Modo Teste):", formData);
    // Devolve o item atualizado para a tela de lista
    navigation.navigate('ManageUsers', { updatedItem: { ...item, ...formData } });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <UserForm 
        initialData={item} // Passa os dados iniciais
        onSubmit={handleUpdate} 
      />
    </SafeAreaView>
  );
}