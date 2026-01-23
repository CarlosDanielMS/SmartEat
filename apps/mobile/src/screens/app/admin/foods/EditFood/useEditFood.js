export function useEditFood({ route, navigation }) {
  const { item } = route.params;

  const handleUpdate = (formData) => {
    console.log("Alimento Editado (Modo Teste):", formData);
    // Devolve o item atualizado para a tela de lista
    navigation.navigate('ManageFoods', { updatedItem: { ...item, ...formData } });
  };
  return { item, handleUpdate };
}
