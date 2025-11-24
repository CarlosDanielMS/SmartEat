import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Alert,
  Dimensions
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera'; // <-- Atualizado para nova API
import * as MediaLibrary from 'expo-media-library';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function CameraScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [photo, setPhoto] = useState(null);
  const [facing, setFacing] = useState('back'); // 'front' ou 'back'
  const cameraRef = useRef(null);
  const [isActive, setIsActive] = useState(false); // Controla se a câmera está ativa

  // Ativa a câmera apenas quando a tela está em foco
  useFocusEffect(
    React.useCallback(() => {
      setIsActive(true);
      return () => setIsActive(false);
    }, [])
  );

  useEffect(() => {
    (async () => {
      if (!permission) await requestPermission();
      if (!mediaPermission) await requestMediaPermission();
    })();
  }, []);

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

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photoData = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          skipProcessing: true, // Mais rápido
        });
        setPhoto(photoData);
        setIsActive(false); // Pausa a câmera
      } catch (e) {
        Alert.alert("Erro", "Não foi possível tirar a foto.");
      }
    }
  };

  const retakePicture = () => {
    setPhoto(null);
    setIsActive(true);
  };

  const savePicture = async () => {
    if (photo) {
      try {
        // Salvar na galeria (opcional, para persistência)
        if (mediaPermission?.granted) {
            await MediaLibrary.saveToLibraryAsync(photo.uri);
        }
        
        // Aqui você enviaria a foto para sua API de reconhecimento de alimentos
        Alert.alert("Foto Salva!", "Em breve: Análise de IA do alimento.");
        
        // Reseta e volta
        setPhoto(null);
        navigation.navigate('HomeTab'); 

      } catch (e) {
        console.error(e);
        Alert.alert("Erro", "Falha ao salvar a foto.");
      }
    }
  };

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  camera: {
    flex: 1,
  },
  // Controles da Câmera
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    marginTop: 40, // Safe area
  },
  bottomControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureBtnOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  captureBtnInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
  },
  // Preview Styles
  previewImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  previewControls: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  controlBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    padding: 15,
  },
  retakeBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 80,
    height: 80,
  },
  saveBtn: {
    backgroundColor: '#00C853',
    width: 80,
    height: 80,
  },
  btnLabel: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  }
});