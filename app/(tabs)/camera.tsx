import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import Button from '@/components/Button';
import { Camera, FlipCamera, Image as ImageIcon } from 'lucide-react-native';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [flashMode, setFlashMode] = useState<'off' | 'on'>('off');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const router = useRouter();
  let cameraRef: React.RefObject<CameraView> = React.useRef(null);

  if (!permission) {
    // Camera permissions are still loading
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting camera permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Camera access needed</Text>
        <Text style={styles.text}>
          We need camera access to capture photos of artwork you discover.
        </Text>
        <Button 
          title="Grant Permission" 
          onPress={requestPermission} 
          style={styles.button} 
        />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        // Compress the image to reduce file size
        const compressedImage = await ImageManipulator.manipulateAsync(
          photo.uri,
          [], // no transformations
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );
        setCapturedImage(compressedImage.uri);
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to capture image');
      }
    }
  };

  const selectFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled) {
        setCapturedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const handleUsePhoto = () => {
    if (capturedImage) {
      router.push({
        pathname: '/artwork/new',
        params: { imageUri: capturedImage }
      });
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={styles.container}>
      {capturedImage ? (
        // Show preview of captured image
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: capturedImage }}
            style={styles.previewImage}
            resizeMode="contain"
          />
          <View style={styles.previewActions}>
            <Button
              title="Retake"
              onPress={handleRetake}
              type="outline"
              style={styles.actionButton}
            />
            <Button
              title="Use Photo"
              onPress={handleUsePhoto}
              style={styles.actionButton}
            />
          </View>
        </View>
      ) : (
        // Show camera view
        <>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
            flashMode={flashMode}
          >
            <View style={styles.controls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={toggleCameraFacing}
              >
                <FlipCamera size={24} color="white" />
              </TouchableOpacity>
            </View>
          </CameraView>
          <View style={styles.bottomControls}>
            <TouchableOpacity
              style={styles.galleryButton}
              onPress={selectFromGallery}
            >
              <ImageIcon size={28} color={Colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureButtonInner}>
                <Camera size={28} color={Colors.primary[600]} />
              </View>
            </TouchableOpacity>
            <View style={styles.spacer} />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    top: 60,
    right: Spacing.md,
    flexDirection: 'row',
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.background,
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.primary[600],
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacer: {
    width: 50,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.gray[600],
    textAlign: 'center',
    marginHorizontal: Spacing.xl,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  button: {
    marginTop: Spacing.xl,
    marginHorizontal: Spacing.xl,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray[900],
  },
  previewImage: {
    width: '100%',
    height: '80%',
  },
  previewActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: Spacing.xl,
    backgroundColor: Colors.background,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: Spacing.sm,
  },
});