import { useRef } from 'react';
import { Alert, Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Camera,
  CameraRuntimeError,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';

export interface ICameraScannerProps {
  setIsCameraShown: (value: boolean) => void;
  onReadCode: (value: string) => void;
}

export const CameraScanner = ({
  setIsCameraShown,
  onReadCode,
}: ICameraScannerProps) => {

const device = useCameraDevice('back');
const camera = useRef<Camera>(null);

 if (device == null) {
    Alert.alert('Error!', 'Camera could not be started');
  }

const onError = (error: CameraRuntimeError) => {
    Alert.alert('Error!', error.message);
  }

const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      if (codes.length > 0) {
        if (codes[0].value) {
          setTimeout(() => setCodeScanned(codes[0]?.value), 500);
        }
      }
      return;
    },
  });

return (
     <SafeAreaView style={styles.safeArea}>
        <Modal presentationStyle="fullScreen" animationType="slide">
          <Camera
            ref={camera}
            onError={onError}
            photo={false}
            style={styles.fullScreenCamera}
            device={device}
            codeScanner={codeScanner}
          />
        </Modal>
      </SafeAreaView>
)}


export const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  fullScreenCamera: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flex: 1,
    zIndex: 100,
  },
});