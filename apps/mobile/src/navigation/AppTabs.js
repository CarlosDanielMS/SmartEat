// apps/mobile/src/navigation/AppTabs.js
import { useAuth } from '../context/AuthContext';

// Dentro do componente
const { userRole } = useAuth();

// Adicionar tab de Admin condicionalmente
{userRole === 'admin' && (
  <Tab.Screen name="Admin" component={AdminDashboard} />
)}
