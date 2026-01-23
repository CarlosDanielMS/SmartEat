import { useState, useEffect, useRef, useCallback } from 'react';
import { Alert } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useFocusEffect } from '@react-navigation/native';

export function useCamera(navigation) {
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [photo, setPhoto] = useState(null);
  const [facing, setFacing] = useState('back'); // 'front' ou 'back'
  const cameraRef = useRef(null);
  const [isActive, setIsActive] = useState(false); // Controla se a câmera está ativa

  // Ativa a câmera apenas quando a tela está em foco
  useFocusEffect(
    useCallback(() => {
      setIsActive(true);
      return () => setIsActive(false);
    }, [])
  );

  useEffect(() => {
    (async () => {
      if (!permission) await requestPermission();
      if (!mediaPermission) await requestMediaPermission();
    })();
  }, [permission, requestPermission, mediaPermission, requestMediaPermission]);

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
      } catch {
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
        navigation.navigate('Home'); 

      } catch (e) {
        console.error(e);
        Alert.alert("Erro", "Falha ao salvar a foto.");
      }
    }
  };

  return {
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
  };
}