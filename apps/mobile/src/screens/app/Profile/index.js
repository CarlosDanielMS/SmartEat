import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { styles } from './styles';
import { useProfile } from './useProfile';
import { InfoItem } from './components/InfoItem';
import { ActionButton } from './components/ActionButton';
import { ProfileHeader } from './components/ProfileHeader';

export default function ProfileScreen({ navigation }) {
  const {
    signOut,
    profile,
    loading,
    handlePickImage,
    fullName,
    email,
    phone,
    roleLabel,
    avatarSource,
  } = useProfile();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          avatarSource={avatarSource}
          handlePickImage={handlePickImage}
          fullName={fullName}
          email={email}
          roleLabel={roleLabel}
          loading={loading}
        />

        {/* Informações Pessoais */}
        <Text style={styles.sectionTitle}>Informações Pessoais</Text>
        <View style={styles.card}>
          <InfoItem label="Nome Completo" value={fullName} icon="user" />
          <View style={styles.divider} />
          <InfoItem label="Email" value={email} icon="mail" />
          <View style={styles.divider} />
          <InfoItem label="Telefone" value={phone} icon="phone" />
          <View style={styles.divider} />
          <InfoItem
            label="Objetivo"
            value={
              profile?.quiz_data?.['2'] === 'lose_weight'
                ? 'Perder peso'
                : profile?.quiz_data?.['2'] === 'gain_weight'
                ? 'Ganhar peso'
                : 'Manter peso'
            }
            icon="target"
          />
        </View>

        {/* Configurações e Suporte */}
        <Text style={styles.sectionTitle}>Configurações e Suporte</Text>
        <View style={styles.card}>
          <ActionButton
            label="Privacidade da Conta"
            icon="lock"
            onPress={() => navigation.navigate('AccountPrivacy')}
          />
          <View style={styles.divider} />
          <ActionButton
            label="Sua Atividade"
            icon="activity"
            onPress={() => navigation.navigate('Activity')}
          />
          <View style={styles.divider} />
          <ActionButton
            label="Ajuda e Suporte"
            icon="help-circle"
            onPress={() => navigation.navigate('Support')}
          />
          <View style={styles.divider} />
          <ActionButton
            label="Sobre o App"
            icon="info"
            onPress={() => navigation.navigate('About')}
          />
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <Feather name="log-out" size={20} color="#FF5252" />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Versão 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
