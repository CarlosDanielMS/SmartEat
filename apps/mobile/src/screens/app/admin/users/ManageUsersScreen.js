import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Button, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// --- CORREÇÃO AQUI (4 PONTOS) ---
import { MOCK_USERS, USER_LEVELS } from '../../../../data/adminMockData';

// Função para "traduzir" o ID do Nível (do seu list.php)
const getUserLevelName = (level) => {
  return USER_LEVELS[level] || 'Não encontrado';
};

// --- Componente Principal ---
export default function ManageUsersScreen({ navigation, route }) {
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

  }, [route.params?.newItem, route.params?.updatedItem]);


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

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemTitle}>{item.first_name} {item.last_name}</Text>
        <Text style={styles.itemSubtitle}>{item.email}</Text>
        <Text style={styles.itemLevel}>{getUserLevelName(item.level)}</Text>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => navigation.navigate('EditUser', { item })}
        >
          <Text style={styles.actionButtonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.actionButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gerenciar Usuários</Text>
        <Button 
          title="Adicionar Novo" 
          onPress={() => navigation.navigate('AddUser')} 
        />
      </View>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#555',
  },
  itemLevel: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 4,
  },
  itemActions: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
    minWidth: 60,
  },
  editButton: {
    backgroundColor: '#17A2B8', // bg-info
    marginBottom: 8,
  },
  deleteButton: {
    backgroundColor: '#DC3545', // bg-danger
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});