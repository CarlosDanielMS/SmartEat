import React, { useState, useLayoutEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Button, 
  FlatList, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// MODO TESTE: Vamos simular o banco de dados ($list_classifications) aqui
const MOCK_DATA = [
  { id: '1', name: 'Vegetariano' },
  { id: '2', name: 'Vegano' },
  { id: '3', name: 'Sem Glúten' },
  { id: '4', name: 'Low Carb' },
];

export default function ManageClassificationsScreen({ navigation, route }) {
  const [classifications, setClassifications] = useState(MOCK_DATA);

  // Botão de "Adicionar" no cabeçalho (tradução do seu <a> no PHP)
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button 
          onPress={() => navigation.navigate('AddClassification')} 
          title="Adicionar" 
        />
      ),
    });
  }, [navigation]);

  // Lógica de "Deletar"
  const handleDelete = (id) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza de que deseja excluir esta classificação?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: () => {
            // Em Modo Teste, apenas filtramos o estado
            setClassifications(prev => prev.filter(item => item.id !== id));
            // Em Modo Real, você chamaria a API aqui
          }
        }
      ]
    );
  };

  // Lógica para atualizar a lista quando voltamos do Add/Edit
  React.useEffect(() => {
    if (route.params?.newItem) {
      setClassifications(prev => [
        ...prev, 
        { id: String(Math.random()), name: route.params.newItem.name }
      ]);
    }
    if (route.params?.updatedItem) {
      setClassifications(prev => prev.map(item => 
        item.id === route.params.updatedItem.id ? route.params.updatedItem : item
      ));
    }
  }, [route.params?.newItem, route.params?.updatedItem]);


  // Item da Lista (tradução do seu <tr>)
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.name}</Text>
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.editButton]} 
          onPress={() => navigation.navigate('EditClassification', { item: item })}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.deleteButton]}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={classifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma classificação encontrada.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
  list: { padding: 16 },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#007AFF', // Azul (Info)
  },
  deleteButton: {
    backgroundColor: '#DC3545', // Vermelho (Danger)
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  }
});