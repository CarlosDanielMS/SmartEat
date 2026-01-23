import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserForm from '../../../../../components/admin/UserForm';
import { useEditUser } from './useEditUser';
import styles from './styles';

export default function EditUserScreen({ route, navigation }) {
  const { item, handleUpdate } = useEditUser({ route, navigation });

  return (
    <SafeAreaView style={styles.container}>
      <UserForm 
        initialData={item} 
        onSubmit={handleUpdate} 
      />
    </SafeAreaView>
  );
}
