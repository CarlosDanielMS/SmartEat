import React from 'react';
import { 
  View, 
  Text, 
  Button, 
  FlatList, 
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';
import { useManageUsers } from './useManageUsers';

export default function ManageUsersScreen({ navigation, route }) {
  const { users, handleDelete, getUserLevelName } = useManageUsers({ navigation, route });

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
