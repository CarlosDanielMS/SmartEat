import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Linking 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { MOCK_USERS } from '../../data/adminMockData';

// Componente de Item de Informação
const InfoItem = ({ label, value, icon }) => (
  <View style={styles.infoItem}>
    <View style={styles.iconContainer}>
      <Feather name={icon} size={20} color="#007AFF" />
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

// Componente de Botão de Ação/Configuração
const ActionButton = ({ label, icon, onPress, color = '#333' }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <View style={styles.actionContent}>
      <Feather name={icon} size={20} color={color} style={{ marginRight: 15 }} />
      <Text style={[styles.actionLabel, { color }]}>{label}</Text>
    </View>
    <Feather name="chevron-right" size={20} color="#ccc" />
  </TouchableOpacity>
);

export default function ProfileScreen({ navigation }) {
  const { userRole, signOut } = useAuth();

  // Em um app real, pegaríamos o usuário logado do contexto ou API.
  // Aqui, vamos pegar o primeiro usuário do mock para simular (ou o admin se for admin).
  const userData = userRole === 'admin' 
    ? MOCK_USERS.find(u => u.level === 5) 
    : MOCK_USERS.find(u => u.level === 1);

  // Fallback se não achar
  const user = userData || {
    first_name: 'Usuário',
    last_name: 'Teste',
    email: 'usuario@teste.com',
    phone: '(00) 00000-0000',
    photo: 'https://placehold.co/150x150/png?text=User',
    level: 1
  };

  const handleHelp = () => {
    Alert.alert('Ajuda', 'Entre em contato com suporte@omnidiet.com');
  };

  const handlePrivacy = () => {
    Alert.alert('Privacidade', 'Aqui você pode gerenciar quem vê seus dados.');
  };

  const handleAbout = () => {
    Alert.alert('Sobre', 'OmniDiet App v1.0.0\nDesenvolvido com React Native.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Cabeçalho do Perfil */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image 
              source={user.photo ? { uri: user.photo } : require('../../../assets/images/icon.png')} 
              style={styles.avatar} 
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Feather name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user.first_name} {user.last_name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>
              {user.level === 5 ? 'Administrador' : 'Membro Premium'}
            </Text>
          </View>
        </View>

        {/* Seção de Informações Pessoais */}
        <Text style={styles.sectionTitle}>Informações Pessoais</Text>
        <View style={styles.card}>
          <InfoItem label="Nome Completo" value={`${user.first_name} ${user.last_name}`} icon="user" />
          <View style={styles.divider} />
          <InfoItem label="Email" value={user.email} icon="mail" />
          <View style={styles.divider} />
          <InfoItem label="Telefone" value={user.phone} icon="phone" />
          <View style={styles.divider} />
          <InfoItem label="Idade" value="30 anos" icon="calendar" /> 
        </View>

        {/* Seção de Configurações e Suporte */}
        <Text style={styles.sectionTitle}>Configurações e Suporte</Text>
        <View style={styles.card}>
          <ActionButton label="Privacidade da Conta" icon="lock" onPress={handlePrivacy} />
          <View style={styles.divider} />
          <ActionButton label="Sua Atividade" icon="activity" onPress={() => {}} />
          <View style={styles.divider} />
          <ActionButton label="Ajuda e Suporte" icon="help-circle" onPress={handleHelp} />
          <View style={styles.divider} />
          <ActionButton label="Sobre o App" icon="info" onPress={handleAbout} />
        </View>

        {/* Botão de Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <Feather name="log-out" size={20} color="#FF5252" />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>Versão 1.0.0</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#F5F7FA',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  roleBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 5,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 60, // Indentação para alinhar com o texto
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  logoutText: {
    color: '#FF5252',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  versionText: {
    textAlign: 'center',
    color: '#ccc',
    fontSize: 12,
  }
});