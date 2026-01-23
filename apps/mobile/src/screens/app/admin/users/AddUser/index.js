import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserForm from '../../../../../components/admin/UserForm';
import { useAddUser } from './useAddUser';
import styles from './styles';

export default function AddUserScreen({ navigation }) {
  const { handleSave } = useAddUser({ navigation });

  return (
    <SafeAreaView style={styles.container}>
      <UserForm onSubmit={handleSave} />
    </SafeAreaView>
  );
}
