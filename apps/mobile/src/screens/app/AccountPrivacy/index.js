import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAccountPrivacy } from './useAccountPrivacy';
import styles from './styles';

export default function AccountPrivacyScreen() {
  const {
    loading,
    saving,
    fullName,
    setFullName,
    phone,
    setPhone,
    goal,
    setGoal,
    newPassword,
    setNewPassword,
    handleSaveProfile,
    handleChangePassword,
  } = useAccountPrivacy();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>Privacidade da conta</Text>

      <Text style={styles.label}>Nome completo</Text>
      <TextInput
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
        placeholder="Seu nome"
      />

      <Text style={styles.label}>Telefone</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="(00) 00000-0000"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Objetivo</Text>
      <View style={styles.goalRow}>
        {[
          { value: 'lose_weight', label: 'Perder' },
          { value: 'maintain_weight', label: 'Manter' },
          { value: 'gain_weight', label: 'Ganhar' },
        ].map((g) => (
          <TouchableOpacity
            key={g.value}
            style={[
              styles.goalChip,
              goal === g.value && styles.goalChipActive,
            ]}
            onPress={() => setGoal(g.value)}
          >
            <Text
              style={[
                styles.goalChipText,
                goal === g.value && styles.goalChipTextActive,
              ]}
            >
              {g.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.saveButton, saving && { opacity: 0.7 }]}
        onPress={handleSaveProfile}
        disabled={saving}
      >
        <Feather name="save" size={18} color="#fff" />
        <Text style={styles.saveText}>
          {saving ? 'Salvando...' : 'Salvar dados'}
        </Text>
      </TouchableOpacity>

      <View style={styles.separator} />

      <Text style={styles.label}>Nova senha</Text>
      <TextInput
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="••••••••"
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.saveButton, saving && { opacity: 0.7 }]}
        onPress={handleChangePassword}
        disabled={saving}
      >
        <Feather name="lock" size={18} color="#fff" />
        <Text style={styles.saveText}>
          {saving ? 'Atualizando...' : 'Mudar senha'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
