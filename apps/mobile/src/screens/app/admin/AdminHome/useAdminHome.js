import { useAuth } from '../../../../context/AuthContext';

export function useAdminHome() {
  const { signOut } = useAuth();

  // Como estamos no Modo Teste, vamos "chumbar" os valores
  const stats = {
    totalUsers: 15,
    totalFoods: 42,
    totalAllergens: 5,
    totalClassifications: 4,
  };

  return {
    signOut,
    stats,
  };
}
