export function useEditUser({ route, navigation }) {
  const { item } = route.params;

  const handleUpdate = (formData) => {
    console.log("Usuário Editado (Modo Teste):", formData);
    // Devolve o item atualizado para a tela de lista
    navigation.navigate('ManageUsers', { updatedItem: { ...item, ...formData } });
  };
  return { item, handleUpdate };
}
