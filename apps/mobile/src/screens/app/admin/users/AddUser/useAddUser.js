export function useAddUser({ navigation }) {
  const handleSave = (formData) => {
    console.log("Novo Usuário (Modo Teste):", formData);
    // Devolve o novo item para a tela de lista
    navigation.navigate('ManageUsers', { newItem: formData });
  };
  return { handleSave };
}
