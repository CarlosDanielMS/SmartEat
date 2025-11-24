// ... imports ...
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './src/context/AuthContext';

function RootNavigator() {
  // Agora estamos pegando o userToken (que vem do Supabase)
  const { userToken, userRole, isLoading, hasCompletedOnboarding } = useAuth();

  if (isLoading) {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // SE TIVER TOKEN -> VAI PARA O DASHBOARD (AppNavigator)
  if (userToken) {
    if (userRole === 'admin') {
      return <AdminNavigator />;
    }
    return <AppNavigator />;
  } 
  
  // SE NÃO, VERIFICA SE JÁ FEZ O QUIZ
  else if (hasCompletedOnboarding) {
    return <AuthNavigator />;
  } 
  
  // SE FOR NOVO, VAI PARA O QUIZ
  else {
    return <OnboardingNavigator />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}