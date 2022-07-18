import React, { useState, useEffect, useMemo } from 'react';
import { View, TouchableOpacity, Vibration } from 'react-native';
import { IconButton } from 'react-native-paper';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';

import { useTheme } from '@react-navigation/native';

import { globalStyles, MediumText } from '@lib/mobile-ui';

import { getDateString } from '@lib/mobile-app';

import { IMoveLine } from '../../store/types';
import { ONE_SECOND_IN_MS } from '../../utils/constants';

// import MoveTotal from '../../screens/Movements/components/MoveTotal';

import styles from './styles';

export interface IScanerObject {
  item?: IMoveLine;
  barcode: string;
  state: 'scan' | 'added' | 'notFound';
}

interface IProps {
  onSearchBarcode: () => void;
  getScannedObject: (brc: string) => void;
  clearScan: () => void;
  scanObject: IScanerObject;
  // lines?: IMoveLine[];
}

const ScanBarcode = ({ onSearchBarcode, getScannedObject, scanObject, clearScan }: IProps) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [flashMode, setFlashMode] = useState(false);
  const [vibroMode, setVibroMode] = useState(false);

  const { colors } = useTheme();

  const cameraStyle = useMemo(() => [styles.camera, { backgroundColor: colors.card }], [colors.card]);
  //Для перерисовки компонента после добавления новой позиции
  const [key, setKey] = useState(1);

  useEffect(() => {
    const permission = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    permission();
  }, []);

  useEffect(() => {
    vibroMode && Vibration.vibrate(ONE_SECOND_IN_MS);
  }, [vibroMode]);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <MediumText style={globalStyles.title}>Нет доступа к камере</MediumText>;
  }

  const setScan = (brc: string) => {
    setKey(key + 1);
    vibroMode && Vibration.vibrate(ONE_SECOND_IN_MS);
    getScannedObject(brc);
  };

  return (
    <View style={[styles.content]} key={key}>
      <Camera
        flashMode={flashMode ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off}
        barCodeScannerSettings={{
          barCodeTypes: [
            BarCodeScanner.Constants.BarCodeType.code128,
            BarCodeScanner.Constants.BarCodeType.ean128,
            BarCodeScanner.Constants.BarCodeType.ean13,
            BarCodeScanner.Constants.BarCodeType.ean8,
          ],
        }}
        autoFocus="on"
        whiteBalance="auto"
        onBarCodeScanned={({ data }: { data: string }) => scanObject.state === 'scan' && setScan(data)}
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
            onPress={onSearchBarcode}
          />
        </View>
        {scanObject.item && (
          <View style={[{ backgroundColor: '#0008', padding: 10 }]}>
            {/* <MediumText style={styles.barcode}>Штрихкод: {scanObject.barcode}</MediumText> */}
            <MediumText style={styles.text}>{scanObject.item.good.name}</MediumText>
            <MediumText style={styles.textWhite}>№ партии: {scanObject.item.numReceived || ''}</MediumText>
            <MediumText style={styles.textWhite}>
              Дата производства: {getDateString(scanObject.item.workDate)}
            </MediumText>
            <MediumText style={styles.textWhite}>Вес: {scanObject.item.weight} кг.</MediumText>
          </View>
        )}
        {scanObject.state === 'scan' ? (
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
        ) : null}
        {scanObject.state === 'notFound' || scanObject.state === 'added' ? (
          <View style={styles.scannerContainer}>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={[styles.buttons, styles.btnReScan]} onPress={clearScan}>
                <IconButton icon="barcode-scan" color={'#FFF'} size={30} />
                <MediumText style={styles.text}>Пересканировать</MediumText>
              </TouchableOpacity>
            </View>
            <View style={styles.infoContainer}>
              <View style={[styles.buttons, styles.btnNotFind]}>
                <IconButton icon={'information-outline'} color={'#FFF'} size={30} />
                <View>
                  {/* <MediumText style={styles.text}>{scanObject.barcode}</MediumText> */}
                  <MediumText style={styles.text}>
                    {scanObject.state === 'notFound' ? 'Товар не найден' : 'Товар уже добавлен'}
                  </MediumText>
                </View>
              </View>
            </View>
          </View>
        ) : null}

        {scanObject.state === 'scan' && (
          <View style={styles.footer}>
            <IconButton icon={'barcode-scan'} color={'#FFF'} size={40} />
            <MediumText style={styles.text}>Наведите рамку на штрихкод</MediumText>
          </View>
        )}
        {/* {lines?.length ? <MoveTotal lines={lines} scan={true} /> : null} */}
      </Camera>
    </View>
  );
};

export default ScanBarcode;
