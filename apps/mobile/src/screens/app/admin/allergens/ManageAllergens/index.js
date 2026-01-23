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
import { useManageAllergens } from './useManageAllergens';

export default function ManageAllergensScreen({ navigation, route }) {
  const { allergens, handleDelete } = useManageAllergens({ navigation, route });

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemTitle}>{item.name}</Text>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => navigation.navigate('EditAllergen', { item })}
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
        <Text style={styles.headerTitle}>Grupos Alérgenos</Text>
        <Button 
          title="Adicionar Novo" 
          onPress={() => navigation.navigate('AddAllergen')} 
        />
      </View>
      <FlatList
        data={allergens}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />
    </SafeAreaView>
  );
}
