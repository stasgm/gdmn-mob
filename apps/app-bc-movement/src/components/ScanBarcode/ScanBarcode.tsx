import React, { useState, useEffect, useMemo } from 'react';
import { View, TouchableOpacity, Vibration, Text } from 'react-native';
import { IconButton } from 'react-native-paper';
import { CameraView, useCameraPermissions } from 'expo-camera';

import { useIsFocused, useTheme } from '@react-navigation/native';

import { globalStyles } from '@lib/mobile-ui';

import { IMovementLine } from '../../store/types';
import { ONE_SECOND_IN_MS } from '../../utils/constants';

import styles from './styles';

interface IProps {
  onSave: (item: IMovementLine) => void;
  getScannedObject: (brc: string) => IMovementLine | undefined;
}

const ScanBarcode = ({ onSave, getScannedObject }: IProps) => {
  const isFocused = useIsFocused();

  const [flashMode, setFlashMode] = useState(false);
  const [vibroMode, setVibroMode] = useState(false);
  const [scanned, setScanned] = useState(false);
  const { colors } = useTheme();

  const [barcode, setBarcode] = useState('');
  const [itemLine, setItemLine] = useState<IMovementLine | undefined>(undefined);
  const [permission] = useCameraPermissions();
  const hasPermission = useMemo(() => {
    return permission?.status === 'granted';
  }, [permission]);

  const handleBarCodeScanned = (data: string) => {
    setScanned(true);
    setBarcode(data);
  };

  useEffect(() => {
    vibroMode && Vibration.vibrate(ONE_SECOND_IN_MS);
  }, [vibroMode]);

  useEffect(() => {
    if (!scanned) {
      return;
    }

    if (!barcode && scanned) {
      setItemLine(undefined);
      return;
    }

    vibroMode && Vibration.vibrate(ONE_SECOND_IN_MS);

    const scannedObj: IMovementLine | undefined = getScannedObject(barcode);
    if (scannedObj !== undefined) {
      setItemLine(scannedObj);
    }
  }, [barcode, scanned, vibroMode, getScannedObject]);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text style={globalStyles.title}>Нет доступа к камере</Text>;
  }

  return (
    isFocused && (
      <View style={[styles.content]}>
        <CameraView
          active={isFocused}
          flash={flashMode ? 'on' : 'off'}
          barcodeScannerSettings={{
            barcodeTypes: ['ean13', 'ean8', 'code128'],
          }}
          // autofocus={isFocused ? 'on' : 'off'}
          onBarcodeScanned={({ data }: { data: string }) => !scanned && handleBarCodeScanned(data)}
          style={[styles.camera, { backgroundColor: colors.card }]}
        >
          <View style={styles.header}>
            <IconButton
              icon={flashMode ? 'flash' : 'flash-off'}
              iconColor={'#FFF'}
              style={styles.transparent}
              onPress={() => setFlashMode(!flashMode)}
            />
            <IconButton
              icon={vibroMode ? 'vibrate' : 'vibrate-off'}
              iconColor={'#FFF'}
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
                <TouchableOpacity
                  style={[styles.buttons, styles.btnReScan]}
                  onPress={() => {
                    setScanned(false);
                    setItemLine(undefined);
                  }}
                >
                  <IconButton icon="barcode-scan" iconColor={'#FFF'} size={30} />
                  <Text style={styles.text}>Пересканировать</Text>
                </TouchableOpacity>
              </View>
              {scanned && itemLine?.barcode === '-1' && (
                <View style={styles.infoContainer}>
                  <View style={[styles.buttons, styles.btnNotFind]}>
                    <IconButton icon={'information-outline'} iconColor={'#FFF'} size={30} />
                    <View>
                      <Text style={styles.error}>{'Данный штрихкод уже существует'}</Text>
                    </View>
                  </View>
                </View>
              )}
              {scanned && itemLine && itemLine?.barcode !== '-1' && (
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    style={[styles.buttons, styles.btnFind]}
                    onPress={() => {
                      onSave(itemLine);
                      setScanned(false);
                      setItemLine(undefined);
                    }}
                  >
                    <IconButton icon={'checkbox-marked-circle-outline'} iconColor={'#FFF'} size={30} />
                    <View>
                      <Text style={styles.text}>{barcode}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
          {!scanned && (
            <View style={styles.footer}>
              <>
                <IconButton icon={'barcode-scan'} iconColor={'#FFF'} size={40} />
                <Text style={styles.text}>Наведите рамку на штрихкод</Text>
              </>
            </View>
          )}
        </CameraView>
      </View>
    )
  );
};

export default ScanBarcode;
