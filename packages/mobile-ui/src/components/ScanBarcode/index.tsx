import React, { useState, useEffect, useMemo, ReactNode } from 'react';
import { View, TouchableOpacity, Vibration, Text } from 'react-native';
import { IconButton } from 'react-native-paper';
import { Camera, FlashMode, AutoFocus, WhiteBalance } from 'expo-camera';

import { useTheme } from '@react-navigation/native';

import { IScannedObject } from '@lib/client-types';

import useCameraPermission from '../../hooks/useCameraPermission';

import globalStyles from '../../styles/global';

import { LargeText } from '../AppText';

import { AppActivityIndicator } from '../AppActivityIndicator';

import AppDialog from '../AppDialog';

import styles from './styles';

const ONE_SECOND_IN_MS = 1000;

interface IProps {
  scaner: IScannedObject;
  onSave?: () => void;
  onGetScannedObject: (brc: string) => void;
  onClearScannedObject: () => void;
  barCodeTypes: string[];
  children?: ReactNode;
}

const ScanBarcode = ({ scaner, onSave, onGetScannedObject, onClearScannedObject, barCodeTypes, children }: IProps) => {
  const [flashMode, setFlashMode] = useState(false);
  const [vibroMode, setVibroMode] = useState(false);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const scanned = scaner.state !== 'init' && !visibleDialog;

  const { colors } = useTheme();

  const cameraStyle = useMemo(() => [styles.camera, { backgroundColor: colors.card }], [colors.card]);

  const [barcode, setBarcode] = useState('');
  const permission = useCameraPermission();

  useEffect(() => {
    vibroMode && Vibration.vibrate(ONE_SECOND_IN_MS);
  }, [vibroMode]);

  useEffect(() => {
    if (scanned) {
      vibroMode && Vibration.vibrate(ONE_SECOND_IN_MS);
    }
  }, [scanned, vibroMode]);

  useEffect(() => {
    if (scaner.state === 'found' && visibleDialog) {
      setVisibleDialog(false);
    }
  }, [scaner, visibleDialog]);

  const handleBarCodeScanned = (data: string) => {
    const brc = data.replace(']C1', '');
    setBarcode(brc);
    onGetScannedObject(brc);
  };

  const handleHideDialog = () => {
    setVisibleDialog(false);
    setBarcode('');
    onClearScannedObject();
  };

  const handlePressOkDialog = () => onGetScannedObject(barcode);

  const handleShowDialog = () => {
    setVisibleDialog(true);
    setBarcode('');
    onClearScannedObject();
  };

  const handleSave = () => {
    onSave && onSave();
  };

  const handleChangeText = (text: string) => {
    setBarcode(text);
    if (!text) {
      onClearScannedObject();
    }
  };

  if (!permission) {
    return (
      <View style={globalStyles.container}>
        <View style={globalStyles.containerCenter}>
          <LargeText>Запрос на использование камеры</LargeText>
          <AppActivityIndicator style={{}} />
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={globalStyles.container}>
        <View style={globalStyles.containerCenter}>
          <LargeText>Нет доступа к камере</LargeText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.content}>
      <Camera
        key={`${scaner.state}`}
        flashMode={flashMode ? FlashMode.torch : FlashMode.off}
        barCodeScannerSettings={barCodeTypes ? { barCodeTypes } : undefined}
        autoFocus={AutoFocus.on}
        whiteBalance={WhiteBalance.auto}
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
            onPress={handleShowDialog}
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
              <TouchableOpacity style={[styles.buttons, styles.btnReScan]} onPress={onClearScannedObject}>
                <IconButton icon="barcode-scan" color={'#FFF'} size={30} />
                <Text style={styles.text}>Пересканировать</Text>
              </TouchableOpacity>
            </View>
            {scaner.message ? (
              <View style={styles.infoContainer}>
                <View style={[styles.buttons, styles.btnNotFind]}>
                  <IconButton icon={'information-outline'} color={'#FFF'} size={30} />
                  <View>
                    <Text style={styles.text}>{barcode}</Text>
                    <Text style={styles.text}>{scaner.message}</Text>
                  </View>
                </View>
              </View>
            ) : children ? (
              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={[styles.buttons, styles.btnFind]} onPress={handleSave}>
                  <IconButton icon={'checkbox-marked-circle-outline'} color={'#FFF'} size={30} />
                  {children}
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        )}
        {!scanned && (
          <View style={styles.footer}>
            <IconButton icon={'barcode-scan'} color={'#FFF'} size={40} />
            <Text style={styles.text}>Наведите рамку на штрихкод</Text>
          </View>
        )}
      </Camera>
      <AppDialog
        title="Введите штрих-код"
        visible={visibleDialog}
        text={barcode}
        onChangeText={handleChangeText}
        onCancel={handleHideDialog}
        onOk={handlePressOkDialog}
        okLabel={'Найти'}
        errorMessage={scaner.message}
      />
    </View>
  );
};

export default ScanBarcode;
