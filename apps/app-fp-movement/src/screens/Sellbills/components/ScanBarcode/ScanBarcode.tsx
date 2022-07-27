import React, { useState, useEffect, useMemo, ReactNode } from 'react';
import { View, TouchableOpacity, Vibration, Text } from 'react-native';
import { IconButton } from 'react-native-paper';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';

import { useTheme } from '@react-navigation/native';

import { IOrderDocument } from '../../../../store/types';
import { ONE_SECOND_IN_MS } from '../../../../utils/constants';

import styles from './styles';

interface IProps {
  onSave: (item: IOrderDocument) => void;
  onShowSearchDialog: () => void;
  getScannedObject: (brc: string) => void;
  scannedObject: IOrderDocument | undefined;
  errorMessage?: string;
  children?: ReactNode;
}

const ScanBarcode = ({
  onSave,
  onShowSearchDialog,
  getScannedObject,
  scannedObject,
  errorMessage,
  children,
}: IProps) => {
  const [flashMode, setFlashMode] = useState(false);
  const [vibroMode, setVibroMode] = useState(false);
  const [scanned, setScanned] = useState(false);

  const { colors } = useTheme();

  const cameraStyle = useMemo(() => [styles.camera, { backgroundColor: colors.card }], [colors.card]);

  const [barcode, setBarcode] = useState('');

  const handleBarCodeScanned = (data: string) => {
    const brc = data.replace(']C1', '');
    setScanned(true);
    setBarcode(brc);
    getScannedObject(brc);
  };

  useEffect(() => {
    vibroMode && Vibration.vibrate(ONE_SECOND_IN_MS);
  }, [vibroMode]);

  useEffect(() => {
    if (scannedObject || errorMessage) {
      setScanned(true);
    }
  }, [errorMessage, scannedObject]);

  return (
    <View style={styles.content}>
      <Camera
        key={`${scanned}${barcode}`}
        flashMode={flashMode ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off}
        barCodeScannerSettings={{
          barCodeTypes: [
            BarCodeScanner.Constants.BarCodeType.code128,
            BarCodeScanner.Constants.BarCodeType.ean13,
            BarCodeScanner.Constants.BarCodeType.ean8,
          ],
        }}
        autoFocus="on"
        whiteBalance="auto"
        onBarCodeScanned={({ data }: { data: string }) => !scanned && handleBarCodeScanned(data)}
        style={cameraStyle}
      >
        <View style={styles.header}>
          <IconButton
            icon={flashMode ? 'flash' : 'flash-off'}
            size={30}
            color={'#FFF'}
            style={styles.transparent}
            onPress={() => setFlashMode(!flashMode)}
          />
          <IconButton
            icon={vibroMode ? 'vibrate' : 'vibrate-off'}
            size={30}
            color={'#FFF'}
            style={styles.transparent}
            onPress={() => setVibroMode(!vibroMode)}
          />
          <IconButton
            icon={'feature-search-outline'}
            size={30}
            color={'#FFF'}
            style={styles.transparent}
            onPress={() => {
              setScanned(false);
              onShowSearchDialog();
            }}
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
                  // setItemLine(undefined);
                }}
              >
                <IconButton icon="barcode-scan" color={'#FFF'} size={30} />
                <Text style={styles.text}>Пересканировать</Text>
              </TouchableOpacity>
            </View>
            {errorMessage ? (
              <View style={styles.infoContainer}>
                <View style={[styles.buttons, styles.btnNotFind]}>
                  <IconButton icon={'information-outline'} color={'#FFF'} size={30} />
                  <View>
                    <Text style={styles.text}>{barcode}</Text>
                    <Text style={styles.text}>{errorMessage}</Text>
                  </View>
                </View>
              </View>
            ) : (
              scannedObject && (
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    style={[styles.buttons, styles.btnFind]}
                    onPress={() => {
                      onSave(scannedObject);
                      setScanned(false);
                      // setItemLine(undefined);
                    }}
                  >
                    <IconButton icon={'checkbox-marked-circle-outline'} color={'#FFF'} size={30} />
                    {children}
                  </TouchableOpacity>
                </View>
              )
            )}
          </View>
        )}
        {!scanned && (
          <View style={styles.footer}>
            <IconButton icon={'barcode-scan'} color={'#FFF'} size={40} />
            <Text style={styles.text}>Наведите рамку на штрихкод</Text>
          </View>
        )}
      </Camera>
    </View>
  );
};

export default ScanBarcode;
