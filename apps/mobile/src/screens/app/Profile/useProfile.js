import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabase';

export function useProfile() {
  const { user, userRole, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pickedImage, setPickedImage] = useState(null);

  const loadProfile = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Erro ao carregar perfil:', error);
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error('Erro inesperado ao carregar perfil:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  const handlePickImage = async () => {
    try {
      const { status, canAskAgain } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('📸 Permissão galeria:', status, 'canAskAgain:', canAskAgain);

      if (status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Ative o acesso às fotos nas configurações do sistema.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      console.log('📸 Resultado picker:', result);

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setPickedImage(uri);
      }
    } catch (e) {
      console.error('Erro ao abrir galeria:', e);
      Alert.alert('Erro', 'Não foi possível abrir a galeria de fotos.');
    }
  };

  const fullName =
    profile?.full_name ||
    `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() ||
    'Usuário';
  const email = user?.email || profile?.email || 'sem email';
  const phone = profile?.phone || '(não informado)';

  const roleLabel =
    userRole === 'admin'
      ? 'Administrador'
      : profile?.plan === 'premium'
      ? 'Membro Premium'
      : 'Membro';

  const avatarSource = pickedImage
    ? { uri: pickedImage }
    : require('../../../../assets/icon.png');

  return {
    user,
    userRole,
    signOut,
    profile,
    loading,
    pickedImage,
    loadProfile,
    handlePickImage,
    fullName,
    email,
    phone,
    roleLabel,
    avatarSource,
  };
}
