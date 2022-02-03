import React, { useState, useEffect } from 'react';
import { useTheme } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import { View, TouchableOpacity, Text, Vibration } from 'react-native';
import { IconButton } from 'react-native-paper';

import { globalStyles } from '@lib/mobile-ui';
import styles from './styles';
import { ONE_SECOND_IN_MS } from '../../utils/constants';

interface IProps {
  onSave: (data: string) => void;
  onCancel: () => void;
}

const ScanDataMatrix = ({ onSave, onCancel }: IProps) => {
  const { colors } = useTheme();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [flashMode, setFlashMode] = useState(false);
  const [vibroMode, setVibroMode] = useState(false);
  const [scanned, setScanned] = useState(false);

  const [barcode, setBarcode] = useState('');

  useEffect(() => {
    const permission = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    permission();
  }, []);

  const handleBarCodeScanned = (data: string) => {
    vibroMode && Vibration.vibrate(ONE_SECOND_IN_MS);
    setScanned(true);
    setBarcode(data);
  };

  useEffect(() => {
    vibroMode && Vibration.vibrate(ONE_SECOND_IN_MS);
  }, [vibroMode]);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text style={globalStyles.title}>Нет доступа к камере</Text>;
  }

  return (
    <View style={[styles.content, { backgroundColor: colors.card }]}>
      <Camera
        flashMode={flashMode ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off}
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.datamatrix],
        }}
        autoFocus="on"
        whiteBalance="auto"
        onBarCodeScanned={({ data }: { data: string }) => !scanned && handleBarCodeScanned(data)}
        style={styles.camera}
      >
        <View style={styles.header}>
          <IconButton icon="arrow-left" color={'#FFF'} size={30} style={styles.transparent} onPress={onCancel} />
          <IconButton
            icon={flashMode ? 'flash' : 'flash-off'}
            color={'#FFF'}
            style={styles.transparent}
            onPress={() => setFlashMode(!flashMode)}
          />
          <IconButton
            icon={vibroMode ? 'vibrate' : 'vibrate-off'}
            color={'#FFF'}
            style={styles.transparent}
            onPress={() => setVibroMode(!vibroMode)}
          />
        </View>
        {!scanned ? (
          <View style={[styles.scannerContainer, { alignItems: 'center' }]}>
            <View
              style={{
                width: '70%',
                height: '50%',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={[styles.border, styles.borderTop, styles.borderLeft]} />
                <View style={[styles.border, styles.borderTop, styles.borderRight]} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={[styles.border, styles.borderBottom, styles.borderLeft]} />
                <View style={[styles.border, styles.borderBottom, styles.borderRight]} />
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.scannerContainer}>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.buttons, { backgroundColor: '#FFCA00' }]}
                onPress={() => setScanned(false)}
              >
                <IconButton icon={'barcode-scan'} color={'#FFF'} size={30} />
                <Text style={styles.text}>Пересканировать</Text>
              </TouchableOpacity>
            </View>
            {scanned && barcode && (
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[styles.buttons, { backgroundColor: '#4380D3' }]}
                  onPress={() => {
                    onSave(barcode);
                  }}
                >
                  <IconButton icon={'checkbox-marked-circle-outline'} color={'#FFF'} size={30} />
                  <View style={styles.goodInfo}>
                    <Text style={styles.barcode}>{barcode}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        {!scanned && (
          <View style={styles.footer}>
            <>
              <IconButton icon={'barcode-scan'} color={'#FFF'} size={40} />
              <Text style={styles.text}>Наведите рамку на штрихкод</Text>
            </>
          </View>
        )}
      </Camera>
    </View>
  );
};

export default ScanDataMatrix;

// const localStyles = StyleSheet.create({
//   barcode: {
//     color: '#fff',
//     fontSize: 16,
//     opacity: 0.5,
//   },
//   border: {
//     height: 50,
//     width: 50,
//   },
//   borderBottom: {
//     borderBottomColor: '#FF8',
//     borderBottomWidth: 2,
//   },
//   borderLeft: {
//     borderLeftColor: '#FF8',
//     borderLeftWidth: 2,
//   },
//   borderRight: {
//     borderRightColor: '#FF8',
//     borderRightWidth: 2,
//   },
//   borderTop: {
//     borderTopColor: '#FF8',
//     borderTopWidth: 2,
//   },
//   buttons: {
//     alignItems: 'center',
//     borderRadius: 10,
//     elevation: 8,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     minHeight: 100,
//   },
//   buttonsContainer: {
//     margin: 10,
//   },
//   camera: {
//     flex: 1,
//     flexGrow: 1,
//   },
//   content: {
//     flex: 1,
//     paddingTop: StatusBar.currentHeight ?? 0,
//   },
//   footer: {
//     alignItems: 'center',
//     backgroundColor: '#0008',
//     height: 100,
//     justifyContent: 'center',
//   },
//   goodInfo: {
//     flexShrink: 1,
//     paddingRight: 10,
//   },
//   goodName: {
//     color: '#fff',
//     fontSize: 18,
//     textTransform: 'uppercase',
//   },
//   header: {
//     alignItems: 'center',
//     backgroundColor: '#0008',
//     flexDirection: 'row',
//     height: 70,
//     justifyContent: 'space-between',
//     paddingHorizontal: 10,
//     paddingTop: 30,
//   },
//   infoContainer: {
//     height: 100,
//     padding: 10,
//     // justifyContent: 'center',
//   },
//   scannerContainer: {
//     flex: 1,
//     flexGrow: 1,
//     justifyContent: 'center',
//   },
//   text: {
//     color: '#fff',
//     fontSize: 18,
//     textTransform: 'uppercase',
//   },
//   transparent: {
//     backgroundColor: 'transparent',
//   },
//   notScannedContainer: {
//     alignItems: 'center',
//   },
//   notScannedHeader: {
//     width: '70%',
//     height: '50%',
//     flexDirection: 'column',
//     justifyContent: 'space-between',
//   },
//   notScannedFrame: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   btnReScan: {
//     backgroundColor: '#D9B227',
//   },
//   btnNotFind: {
//     backgroundColor: '#CC3C4D',
//   },
//   btnFind: {
//     backgroundColor: '#4380D3',
//   },
//   btnUnknown: {
//     backgroundColor: '#CC3C4D',
//   },
// });
