export function useAddFood({ navigation }) {
  const handleSave = (formData) => {
    console.log("Novo Alimento (Modo Teste):", formData);
    // Devolve o novo item para a tela de lista
    navigation.navigate('ManageFoods', { newItem: formData });
  };
  return { handleSave };
}
