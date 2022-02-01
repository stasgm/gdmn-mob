import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Vibration, Text } from 'react-native';
import { IconButton } from 'react-native-paper';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';

import { useIsFocused, useTheme } from '@react-navigation/native';

import { globalStyles as styles } from '@lib/mobile-ui';

import { IInventoryLine } from '../../store/types';
import { ONE_SECOND_IN_MS } from '../../utils/constants';

import { scanStyle } from './scanStyle';

interface IProps {
  onSave: (item: IInventoryLine) => void;
  onShowRemains: () => void;
  getScannedObject: (brc: string) => IInventoryLine | undefined;
}

export const ScanBarcode = ({ onSave, onShowRemains, getScannedObject }: IProps) => {
  const isFocused = useIsFocused();

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [flashMode, setFlashMode] = useState(false);
  const [vibroMode, setVibroMode] = useState(false);
  const [scanned, setScanned] = useState(false);
  const { colors } = useTheme();

  const [barcode, setBarcode] = useState('');
  const [itemLine, setItemLine] = useState<IInventoryLine | undefined>(undefined);

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

  useEffect(() => {
    if (!scanned) {
      return;
    }

    if (!barcode && scanned) {
      setItemLine(undefined);
      return;
    }

    vibroMode && Vibration.vibrate(ONE_SECOND_IN_MS);

    const scannedObj: IInventoryLine | undefined = getScannedObject(barcode);
    if (scannedObj !== undefined) {
      setItemLine(scannedObj);
    }
  }, [barcode, scanned, vibroMode, getScannedObject]);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text style={styles.title}>Нет доступа к камере</Text>;
  }

  return isFocused ? (
    <View style={[scanStyle.content]}>
      <Camera
        flashMode={flashMode ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off}
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.ean13, BarCodeScanner.Constants.BarCodeType.ean8],
        }}
        autoFocus="on"
        whiteBalance="auto"
        onBarCodeScanned={({ data }: { data: string }) => !scanned && handleBarCodeScanned(data)}
        style={[scanStyle.camera, { backgroundColor: colors.card }]}
      >
        <View style={scanStyle.header}>
          <IconButton
            icon={flashMode ? 'flash' : 'flash-off'}
            color={'#FFF'}
            style={scanStyle.transparent}
            onPress={() => setFlashMode(!flashMode)}
          />
          <IconButton
            icon={vibroMode ? 'vibrate' : 'vibrate-off'}
            color={'#FFF'}
            style={scanStyle.transparent}
            onPress={() => setVibroMode(!vibroMode)}
          />
          <IconButton
            icon={'feature-search-outline'}
            color={'#FFF'}
            style={scanStyle.transparent}
            onPress={onShowRemains}
          />
        </View>
        {!scanned ? (
          <View style={[scanStyle.scannerContainer, scanStyle.notScannedContainer]}>
            <View style={scanStyle.notScannedHeader}>
              <View style={scanStyle.notScannedFrame}>
                <View style={[scanStyle.border, scanStyle.borderTop, scanStyle.borderLeft]} />
                <View style={[scanStyle.border, scanStyle.borderTop, scanStyle.borderRight]} />
              </View>
              <View style={scanStyle.notScannedFrame}>
                <View style={[scanStyle.border, scanStyle.borderBottom, scanStyle.borderLeft]} />
                <View style={[scanStyle.border, scanStyle.borderBottom, scanStyle.borderRight]} />
              </View>
            </View>
          </View>
        ) : (
          <View style={scanStyle.scannerContainer}>
            <View style={scanStyle.buttonsContainer}>
              <TouchableOpacity
                style={[scanStyle.buttons, scanStyle.btnReScan]}
                onPress={() => {
                  setScanned(false);
                  setItemLine(undefined);
                }}
              >
                <IconButton icon="barcode-scan" color={'#FFF'} size={30} />
                <Text style={scanStyle.text}>Пересканировать</Text>
              </TouchableOpacity>
            </View>
            {scanned && !itemLine && (
              <View style={scanStyle.infoContainer}>
                <View style={[scanStyle.buttons, scanStyle.btnNotFind]}>
                  <IconButton icon={'information-outline'} color={'#FFF'} size={30} />
                  <View>
                    <Text style={scanStyle.text}>{barcode}</Text>
                    <Text style={scanStyle.text}>{'Товар не найден'}</Text>
                  </View>
                </View>
              </View>
            )}
            {scanned && itemLine && (
              <View style={scanStyle.buttonsContainer}>
                <TouchableOpacity
                  style={[scanStyle.buttons, itemLine.good.id === 'unknown' ? scanStyle.btnUnknown : scanStyle.btnFind]}
                  onPress={() => {
                    onSave(itemLine);
                    setScanned(false);
                    setItemLine(undefined);
                  }}
                >
                  <IconButton icon={'checkbox-marked-circle-outline'} color={'#FFF'} size={30} />
                  <View style={scanStyle.goodInfo}>
                    <Text style={scanStyle.goodName} numberOfLines={3}>
                      {itemLine?.good.name}
                    </Text>
                    <Text style={scanStyle.barcode}>{itemLine?.barcode}</Text>
                    <Text style={scanStyle.barcode}>
                      цена: {itemLine?.price || 0} р., остаток: {itemLine?.remains}
                    </Text>
                    <Text style={scanStyle.barcode}>количество: {itemLine?.quantity}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        {!scanned && (
          <View style={scanStyle.footer}>
            <>
              <IconButton icon={'barcode-scan'} color={'#FFF'} size={40} />
              <Text style={scanStyle.text}>Наведите рамку на штрихкод</Text>
            </>
          </View>
        )}
      </Camera>
    </View>
  ) : (
    <></>
  );
};
