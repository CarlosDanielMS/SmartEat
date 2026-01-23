import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from '../styles';

export const ProfileHeader = ({ avatarSource, handlePickImage, fullName, email, roleLabel, loading }) => (
  <View style={styles.header}>
    <View style={styles.avatarContainer}>
      <Image source={avatarSource} style={styles.avatar} />
      <TouchableOpacity
        style={styles.editAvatarButton}
        onPress={handlePickImage}
      >
        <Feather name="camera" size={16} color="#fff" />
      </TouchableOpacity>
    </View>
    <Text style={styles.userName}>
      {loading ? 'Carregando...' : fullName}
    </Text>
    <Text style={styles.userEmail}>{email}</Text>
    <View style={styles.roleBadge}>
      <Text style={styles.roleText}>{roleLabel}</Text>
    </View>
  </View>
);
