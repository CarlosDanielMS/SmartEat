import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
// Importa o formulário reutilizável
import UserForm from '../../../../components/admin/UserForm'; // <-- 4 PONTOS AGORA

export default function AddUserScreen({ navigation }) {

  const handleSave = (formData) => {
    console.log("Novo Usuário (Modo Teste):", formData);
    // Devolve o novo item para a tela de lista
    navigation.navigate('ManageUsers', { newItem: formData });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <UserForm 
        onSubmit={handleSave} 
      />
    </SafeAreaView>
  );
}