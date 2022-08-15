import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTheme } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import { View, TouchableOpacity, Text, Vibration } from 'react-native';
import { IconButton } from 'react-native-paper';

import { AppActivityIndicator, globalStyles, LargeText, useCameraPermission } from '@lib/mobile-ui';

import { ONE_SECOND_IN_MS } from '../../utils/constants';

import styles from './styles';

interface IProps {
  onSave: (data: string) => void;
  onCancel: () => void;
}

const ScanDataMatrix = ({ onSave, onCancel }: IProps) => {
  const { colors } = useTheme();
  const viewStyle = useMemo(() => [styles.content, { backgroundColor: colors.card }], [colors.card]);

  const [flashMode, setFlashMode] = useState(false);
  const [vibroMode, setVibroMode] = useState(false);
  const [scanned, setScanned] = useState(false);

  const [barcode, setBarcode] = useState('');

  const hasPermission = useCameraPermission();

  const handleBarCodeScanned = useCallback(
    (data: string) => {
      vibroMode && Vibration.vibrate(ONE_SECOND_IN_MS);
      setScanned(true);
      setBarcode(data);
    },
    [vibroMode],
  );

  useEffect(() => {
    vibroMode && Vibration.vibrate(ONE_SECOND_IN_MS);
  }, [vibroMode]);

  if (hasPermission === null) {
    return (
      <>
        <IconButton icon="arrow-left" size={30} style={styles.transparent} onPress={onCancel} />
        <View style={globalStyles.container}>
          <View style={globalStyles.containerCenter}>
            <LargeText>Запрос на использование камеры</LargeText>
            <AppActivityIndicator style={{}} />
          </View>
        </View>
      </>
    );
  }

  if (hasPermission === false) {
    return (
      <>
        <IconButton icon="arrow-left" size={30} style={styles.transparent} onPress={onCancel} />
        <View style={globalStyles.container}>
          <View style={globalStyles.containerCenter}>
            <LargeText>Нет доступа к камере</LargeText>
          </View>
        </View>
      </>
    );
  }

  return (
    <View style={viewStyle}>
      <Camera
        key={`${scanned}${barcode}`}
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
          <View style={[styles.scannerContainer, styles.notScannedContainer]}>
            <View style={styles.notScannedHeader}>
              <View style={styles.notScannedFrame}>
                <View style={[styles.border, styles.borderTop, styles.borderLeft]} />
                <View style={[styles.border, styles.borderTop, styles.borderRight]} />
              </View>
              <View style={styles.notScannedFrame}>
                <View style={[styles.border, styles.borderBottom, styles.borderLeft]} />
                <View style={[styles.border, styles.borderBottom, styles.borderRight]} />
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.scannerContainer}>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={[styles.buttons, styles.btnReScan]} onPress={() => setScanned(false)}>
                <IconButton icon={'barcode-scan'} color={'#FFF'} size={30} />
                <Text style={styles.text}>Пересканировать</Text>
              </TouchableOpacity>
            </View>
            {scanned && barcode && (
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[styles.buttons, styles.btnFind]}
                  onPress={() => {
                    onSave(barcode);
                    setScanned(false);
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
