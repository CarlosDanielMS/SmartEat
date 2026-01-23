import React from 'react';
import { 
  View, 
  Text, 
  Button, 
  FlatList, 
  TouchableOpacity,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';
import { useManageFoods } from './useManageFoods';

export default function ManageFoodsScreen({ navigation, route }) {
  const { foods, handleDelete } = useManageFoods({ navigation, route });

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image 
        source={item.photo ? { uri: item.photo } : require('../../../../../assets/images/icon.png')} // Caminho para um ícone padrão
        style={styles.itemImage}
      />
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={styles.itemSubtitle}>Calorias: {item.calories} kcal</Text>
        <Text style={styles.itemSubtitle}>Proteínas: {item.protein}g</Text>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => navigation.navigate('EditFood', { item })}
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
        <Text style={styles.headerTitle}>Gerenciar Alimentos</Text>
        <Button 
          title="Adicionar Novo" 
          onPress={() => navigation.navigate('AddFood')} 
        />
      </View>
      <FlatList
        data={foods}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />
    </SafeAreaView>
  );
}
