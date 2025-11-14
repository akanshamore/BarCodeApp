/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {StatusBar, StyleSheet, Text, useColorScheme, View, Button } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import { useEffect } from 'react';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const device = useCameraDevice('back')
  const { hasPermission, requestPermission } = useCameraPermission()

    const codeScanner = useCodeScanner({
  codeTypes: ['qr', 'ean-13'],
  onCodeScanned: (codes) => {
    console.log(`Scanned ${codes.length} codes!`)
  }
})
  
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  console.log('device', device, 'hasPermission', hasPermission);

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Bar Code Scanner</Text>
        <Text>Camera permission required</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Bar Code Scanner</Text>
        <Text>No camera device found</Text>
      </View>
    );
  }



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bar Code Scanner</Text>
      <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} codeScanner={codeScanner}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});

export default App;
