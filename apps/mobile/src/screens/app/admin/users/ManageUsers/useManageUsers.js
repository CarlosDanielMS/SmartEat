import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { MOCK_USERS, USER_LEVELS } from '../../../../../data/adminMockData';

export function useManageUsers({ navigation, route }) {
  const [users, setUsers] = useState(MOCK_USERS);

  // Efeito para receber dados das telas de Adicionar/Editar
  useEffect(() => {
    // Se recebemos um 'newItem' da tela de Adicionar
    if (route.params?.newItem) {
      const newItem = route.params.newItem;
      // Adiciona o novo item à lista (simulando ID)
      setUsers(prevUsers => [
        ...prevUsers, 
        { ...newItem, id: String(Math.random()) }
      ]);
    }
    
    // Se recebemos um 'updatedItem' da tela de Editar
    if (route.params?.updatedItem) {
      const updatedItem = route.params.updatedItem;
      // Atualiza o item na lista
      setUsers(prevUsers => 
        prevUsers.map(item => 
          item.id === updatedItem.id ? updatedItem : item
        )
      );
    }

    // Limpa os parâmetros da rota para evitar re-execução
    navigation.setParams({ newItem: null, updatedItem: null });

  }, [route.params?.newItem, route.params?.updatedItem, navigation]);


  const handleDelete = (id) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este usuário?",
      [
        { text: "Cancelar" },
        { 
          text: "Excluir", 
          onPress: () => {
            // Filtra a lista, removendo o item com o ID
            setUsers(prevUsers => prevUsers.filter(item => item.id !== id));
          },
          style: "destructive"
        }
      ]
    );
  };

  const getUserLevelName = (level) => {
    return USER_LEVELS[level] || 'Não encontrado';
  };

  return {
    users,
    handleDelete,
    getUserLevelName
  };
}
