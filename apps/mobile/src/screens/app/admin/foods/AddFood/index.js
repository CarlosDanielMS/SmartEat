import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FoodForm from '../../../../../components/admin/FoodForm';
import { useAddFood } from './useAddFood';
import styles from './styles';

export default function AddFoodScreen({ navigation }) {
  const { handleSave } = useAddFood({ navigation });

  return (
    <SafeAreaView style={styles.container}>
      <FoodForm onSubmit={handleSave} />
    </SafeAreaView>
  );
}
