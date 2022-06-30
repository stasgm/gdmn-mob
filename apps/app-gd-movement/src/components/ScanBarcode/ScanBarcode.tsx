import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, TouchableOpacity, Vibration, Text, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { IconButton } from 'react-native-paper';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';

import { useFocusEffect, useIsFocused, useTheme } from '@react-navigation/native';

import { globalStyles } from '@lib/mobile-ui';

import { IMovementLine } from '../../store/types';
import { ONE_SECOND_IN_MS } from '../../utils/constants';

import styles from './styles';

interface IProps {
  onSave: (item: IMovementLine) => void;
  onShowRemains: () => void;
  getScannedObject: (brc: string) => IMovementLine | undefined;
}

const ScanBarcode = ({ onSave, onShowRemains, getScannedObject }: IProps) => {
  const isFocused = useIsFocused();
  const ref = useRef<TextInput>(null);

  console.log('isFocused', isFocused);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [flashMode, setFlashMode] = useState(false);
  const [vibroMode, setVibroMode] = useState(false);
  const [scanned, setScanned] = useState(false);

  console.log('scanned', scanned);

  const { colors } = useTheme();

  const cameraStyle = useMemo(() => [styles.camera, { backgroundColor: colors.card }], [colors.card]);

  const [barcode, setBarcode] = useState('');
  const [itemLine, setItemLine] = useState<IMovementLine | undefined>(undefined);

  console.log('barcode', barcode);
  useEffect(() => {
    const permission = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    permission();
  }, []);

  const handleBarCodeScanned = (data: string) => {
    setScanned(true);
    setBarcode(data);
  };

  useEffect(() => {
    vibroMode && Vibration.vibrate(ONE_SECOND_IN_MS);
  }, [vibroMode]);

  useFocusEffect(
    React.useCallback(() => {
      if (!scanned && ref?.current) {
        ref?.current &&
          setTimeout(() => {
            ref.current?.focus();
            ref.current?.clear();
          }, ONE_SECOND_IN_MS);
      }
    }, [scanned, ref]),
  );

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

  return isFocused ? (
    <View style={[styles.content]}>
      <Camera
        flashMode={flashMode ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off}
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.ean13, BarCodeScanner.Constants.BarCodeType.ean8],
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
            onPress={onShowRemains}
          />
        </View>
        {!scanned ? (
          <View style={[styles.scannerContainer, styles.notScannedContainer]}>
            {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <TextInput
                style={styles.scanFocus}
                autoFocus={true}
                ref={ref}
                showSoftInputOnFocus={false}
                onChangeText={(text) => handleBarCodeScanned(text)}
              />
            </TouchableWithoutFeedback> */}
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
                  setBarcode('');
                }}
              >
                <IconButton icon="barcode-scan" color={'#FFF'} size={30} />
                <Text style={styles.text}>Пересканировать</Text>
              </TouchableOpacity>
            </View>
            {scanned && !itemLine && (
              <View style={styles.infoContainer}>
                <View style={[styles.buttons, styles.btnNotFind]}>
                  <IconButton icon={'information-outline'} color={'#FFF'} size={30} />
                  <View>
                    <Text style={styles.text}>{barcode}</Text>
                    <Text style={styles.text}>{'Товар не найден'}</Text>
                  </View>
                </View>
              </View>
            )}
            {scanned && itemLine && (
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[styles.buttons, itemLine.good.id === 'unknown' ? styles.btnUnknown : styles.btnFind]}
                  onPress={() => {
                    onSave(itemLine);
                    setScanned(false);
                    setItemLine(undefined);
                  }}
                >
                  <IconButton icon={'checkbox-marked-circle-outline'} color={'#FFF'} size={30} />
                  <View style={styles.goodInfo}>
                    <Text style={styles.goodName} numberOfLines={3}>
                      {itemLine?.good.name}
                    </Text>
                    <Text style={styles.barcode}>{itemLine?.barcode}</Text>
                    <Text style={styles.barcode}>
                      цена: {itemLine?.price || 0} р., остаток: {itemLine?.remains}
                    </Text>
                    <Text style={styles.barcode}>количество: {itemLine?.quantity}</Text>
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
  ) : (
    <></>
  );
};

export default ScanBarcode;
