import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FoodForm from '../../../../../components/admin/FoodForm';
import { useEditFood } from './useEditFood';
import styles from './styles';

export default function EditFoodScreen({ route, navigation }) {
  const { item, handleUpdate } = useEditFood({ route, navigation });

  return (
    <SafeAreaView style={styles.container}>
      <FoodForm 
        initialData={item} 
        onSubmit={handleUpdate} 
      />
    </SafeAreaView>
  );
}
