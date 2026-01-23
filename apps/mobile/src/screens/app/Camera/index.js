import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { CameraView } from 'expo-camera';
import { Feather } from '@expo/vector-icons';
import { styles } from './styles';
import { useCamera } from './useCamera';

export default function CameraScreen({ navigation }) {
  const {
    permission,
    requestPermission,
    photo,
    facing,
    cameraRef,
    isActive,
    toggleCameraFacing,
    takePicture,
    retakePicture,
    savePicture
  } = useCamera(navigation);

  if (!permission) {
    return <View />; // Carregando permissões
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Precisamos da sua permissão para usar a câmera.</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Conceder Permissão</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- Tela de Prévia da Foto ---
  if (photo) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photo.uri }} style={styles.previewImage} />
        <View style={styles.previewControls}>
          <TouchableOpacity onPress={retakePicture} style={[styles.controlBtn, styles.retakeBtn]}>
            <Feather name="refresh-ccw" size={24} color="#fff" />
            <Text style={styles.btnLabel}>Refazer</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={savePicture} style={[styles.controlBtn, styles.saveBtn]}>
            <Feather name="check" size={32} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // --- Tela da Câmera ---
  return (
    <View style={styles.container}>
      {isActive && (
        <CameraView 
          style={styles.camera} 
          facing={facing} 
          ref={cameraRef}
        >
            {/* Overlay Superior (Botões de Fechar/Flash/Inverter) */}
            <View style={styles.topControls}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <Feather name="x" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleCameraFacing} style={styles.iconButton}>
                    <Feather name="refresh-cw" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Overlay Inferior (Botão de Captura) */}
            <View style={styles.bottomControls}>
                <TouchableOpacity onPress={takePicture} style={styles.captureBtnOuter}>
                    <View style={styles.captureBtnInner} />
                </TouchableOpacity>
            </View>
        </CameraView>
      )}
    </View>
  );
}