import { Alert, Linking } from 'react-native';

export function useSupport() {
  const supportEmail = 'suporte@omnidiet.com'; 

  const handleEmail = () => {
    const subject = encodeURIComponent('Ajuda com o OmniDiet');
    const body = encodeURIComponent('Olá, preciso de ajuda com...');
    const url = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Erro', 'Não foi possível abrir o aplicativo de email.')
    );
  };

  return {
    handleEmail,
  };
}
