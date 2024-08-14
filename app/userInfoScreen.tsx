import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { useLocalSearchParams } from 'expo-router';

export default function UserInfoScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [scannerVisible, setScannerVisible] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`QR code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Information</Text>
      <Text style={styles.info}>Username: {username}</Text>

      <Button
        title={scannerVisible ? 'Hide QR Scanner' : 'Show QR Scanner'}
        onPress={() => {
          setScannerVisible(!scannerVisible);
          if (scannerVisible) {
            setScanned(false); // Reset the scanned state when hiding the scanner
          }
        }}
        color="#007BFF"
      />

      {scannerVisible && (
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'pdf417'], // Supported barcode formats
          }}
          style={StyleSheet.absoluteFillObject}
        />
      )}

      {scanned && (
        <Button
          title={'Tap to Scan Again'}
          onPress={() => setScanned(false)}
          color="#007BFF"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  info: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
});
