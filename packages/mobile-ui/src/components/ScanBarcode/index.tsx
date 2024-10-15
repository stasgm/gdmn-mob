import React, { useState, useEffect, useMemo, ReactNode } from 'react';
import { View, TouchableOpacity, Vibration, Text } from 'react-native';
import { IconButton } from 'react-native-paper';
import { CameraView, BarcodeType } from 'expo-camera';

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
  onGetScannedObject: (brc: string, typeOk?: boolean) => void;
  onClearScannedObject: () => void;
  barcodeTypes?: BarcodeType[];
  children?: ReactNode;
  onSearch?: () => void;
  isLeftButton?: boolean;
  onCancel?: () => void;
  showExtraButton?: boolean;
  extraButtonName?: string;
  extraButtonIcon?: string;
  onPressExtraButton?: () => void;
}

const ScanBarcode = ({
  scaner,
  onSave,
  onGetScannedObject,
  onClearScannedObject,
  barcodeTypes = [],
  children,
  onSearch,
  isLeftButton,
  onCancel,
  showExtraButton = false,
  extraButtonName,
  extraButtonIcon,
  onPressExtraButton,
}: IProps) => {
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

  const handleBarCodeScanned = (data: string, typeOk?: boolean) => {
    const brc = data.replace(']C1', '');
    setBarcode(brc);
    onGetScannedObject(brc, typeOk);
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

  const handlePressExtraButton = () => {
    onPressExtraButton && onPressExtraButton();
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
      {!scanned ? (
        <CameraView
          active={!scanned}
          enableTorch={flashMode}
          barcodeScannerSettings={{
            barcodeTypes,
          }}
          // autofocus={isActiveCamera ? 'on' : 'off'}
          onBarcodeScanned={({ data, type }: { data: string; type: string }) => {
            !scanned &&
              // Временно. Тип штрих-кода на андроиде передается числом
              // handleBarCodeScanned(data, barcodeTypes.length ? barcodeTypes.indexOf(type as BarcodeType) >= 0 : true);
              handleBarCodeScanned(data, true);
          }}
          style={cameraStyle}
        >
          <View style={styles.header}>
            {isLeftButton ? (
              <IconButton
                icon="arrow-left"
                iconColor={'#FFF'}
                size={30}
                style={styles.transparent}
                onPress={onCancel}
              />
            ) : null}
            <IconButton
              icon={flashMode ? 'flash' : 'flash-off'}
              size={30}
              iconColor={'#FFF'}
              style={styles.transparent}
              onPress={() => setFlashMode(!flashMode)}
            />
            <IconButton
              icon={vibroMode ? 'vibrate' : 'vibrate-off'}
              size={30}
              iconColor={'#FFF'}
              style={styles.transparent}
              onPress={() => setVibroMode(!vibroMode)}
            />
            <IconButton
              icon={'feature-search-outline'}
              size={30}
              iconColor={'#FFF'}
              style={styles.transparent}
              onPress={onSearch ? onSearch : handleShowDialog}
            />
          </View>
          <>
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
          </>
          <View style={styles.footer}>
            <IconButton icon={'barcode-scan'} iconColor={'#FFF'} size={40} />
            <Text style={styles.text}>Наведите рамку на штрихкод</Text>
            <Text style={[styles.text, { fontSize: 14 }]}>{`Типы штрих-кодов: ${
              barcodeTypes.length ? barcodeTypes.toString() : 'не указано.'
            }`}</Text>
          </View>
        </CameraView>
      ) : (
        <View style={[styles.scannerContainer, { backgroundColor: colors.background }]}>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={[styles.buttons, styles.btnReScan]} onPress={onClearScannedObject}>
              <IconButton icon="barcode-scan" iconColor={'#FFF'} size={30} />
              <Text style={styles.text}>Пересканировать</Text>
            </TouchableOpacity>
          </View>
          {scaner.message ? (
            <View style={styles.infoContainer}>
              <View style={[styles.buttons, styles.btnNotFind]}>
                <IconButton icon={'information-outline'} iconColor={'#FFF'} size={30} />
                <View>
                  <Text style={styles.text}>{barcode}</Text>
                  <Text style={styles.text}>{scaner.message}</Text>
                </View>
              </View>
            </View>
          ) : children ? (
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.buttons, scaner.state === 'error' ? styles.btnNotFind : styles.btnFind]}
                onPress={handleSave}
              >
                <IconButton icon={'checkbox-marked-circle-outline'} iconColor={'#FFF'} size={30} />
                {children}
              </TouchableOpacity>
            </View>
          ) : null}
          {showExtraButton && (
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={[styles.buttons, styles.btnFind]} onPress={handlePressExtraButton}>
                <IconButton icon={extraButtonIcon || 'checkbox-marked-circle-outline'} iconColor={'#FFF'} size={30} />
                <Text style={styles.text}>{extraButtonName || ''}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
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
