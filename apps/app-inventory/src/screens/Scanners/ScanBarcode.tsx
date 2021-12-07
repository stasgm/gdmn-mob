/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, Vibration } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';

import { useNavigation, useTheme, RouteProp, useRoute } from '@react-navigation/native';

import styles from '@lib/mobile-ui/src/styles/global';
import { scanStyle } from '@lib/mobile-ui/src/styles/scanStyle';
import { ScanButton } from '@lib/mobile-ui';
import { refSelectors } from '@lib/store';

import { InventorysStackParamList } from '../../navigation/Root/types';
import { IRem, IGood, IInventoryLine } from '../../store/types';

//IMDGoodRemain  IModelData  IWeightCodeSettings
const oneSecund = 1000;

type ScannedObject = IRem & { quantity: number } & { good: IGood };

export const ScanBarcodeScreen = () => {
  const docId = useRoute<RouteProp<InventorysStackParamList, 'ScanBarcode'>>().params?.docId;
  const navigation = useNavigation();

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [flashMode, setFlashMode] = useState(false);
  const [vibroMode, setVibroMode] = useState(false);
  const [scanned, setScanned] = useState(false);
  const { colors } = useTheme();

  const [barcode, setBarcode] = useState('');
  const [goodItem, setGoodItem] = useState<ScannedObject>();
  const [itemLine, setItemLine] = useState<IInventoryLine>();

  const goods = refSelectors.selectByName<IGood>('good')?.data;

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

  const handleScannerGood = useCallback(() => {
    navigation.navigate('InventoryEdit');
  }, [navigation]);

  useEffect(() => {
    vibroMode && Vibration.vibrate(oneSecund);
  }, [vibroMode]);

  useEffect(() => {
    if (!scanned) {
      return;
    }

    if (!barcode && scanned) {
      setGoodItem(undefined);
      setItemLine(undefined);
      return;
    }

    const IInventoryLineObject = (goodItemLine: ScannedObject | undefined): IInventoryLine | undefined => {
      if (!goodItemLine) {
        return;
      } else {
        return {
          good: goodItemLine.good,
          id: goodItemLine.id,
          quantity: goodItemLine.quantity,
          price: goodItemLine.price,
          remains: goodItemLine.remains,
        };
      }
    };

    const getScannedObject = (brc: string): ScannedObject | undefined => {
      const good = goods?.find((e) => e.barcode === brc);
      if (!good) {
        return;
      } else {
        return {
          ...good,
          good: good,
          quantity: 1,
          price: 0,
          remains: 0,
        };
      }
    };

    vibroMode && Vibration.vibrate(oneSecund);

    const scannedObj: ScannedObject | undefined = getScannedObject(barcode);
    setGoodItem(scannedObj);

    if (scannedObj !== undefined) {
      const IInventoryLineObj = IInventoryLineObject(scannedObj);
      setItemLine(IInventoryLineObj);
    }
  }, [barcode, goods, scanned, vibroMode]);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text style={styles.title}>Нет доступа к камере</Text>;
  }

  return (
    <View style={[scanStyle.content, { backgroundColor: colors.card }]}>
      <Camera
        flashMode={flashMode ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off}
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.ean13, BarCodeScanner.Constants.BarCodeType.ean8],
        }}
        autoFocus="on"
        whiteBalance="auto"
        onBarCodeScanned={({ data }: { data: string }) => !scanned && handleBarCodeScanned(data)}
        style={scanStyle.camera}
      >
        <View style={scanStyle.header}>
          <IconButton
            icon="arrow-left"
            color={'#FFF'}
            size={30}
            style={scanStyle.transparent}
            onPress={() => navigation.goBack()}
          />
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
            onPress={() => setFlashMode(!flashMode)}
          />
        </View>
        {!scanned ? (
          <View style={[scanStyle.scannerContainer, { alignItems: 'center' }]}>
            <View
              style={{
                width: '70%',
                height: '50%',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={[scanStyle.border, scanStyle.borderTop, scanStyle.borderLeft]} />
                <View style={[scanStyle.border, scanStyle.borderTop, scanStyle.borderRight]} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={[scanStyle.border, scanStyle.borderBottom, scanStyle.borderLeft]} />
                <View style={[scanStyle.border, scanStyle.borderBottom, scanStyle.borderRight]} />
              </View>
            </View>
          </View>
        ) : (
          <View style={scanStyle.scannerContainer}>
            <View style={scanStyle.buttonsContainer}>
              <TouchableOpacity
                style={[scanStyle.buttons, { backgroundColor: '#FFCA00' }]}
                onPress={() => setScanned(false)}
              >
                <ScanButton onPress={handleScannerGood} />
                <Text style={scanStyle.text}>Пересканировать</Text>
              </TouchableOpacity>
            </View>
            {scanned && !goodItem && (
              <View style={scanStyle.infoContainer}>
                <View style={[scanStyle.buttons, { backgroundColor: '#CC3C4D' }]}>
                  <IconButton icon={'information-outline'} color={'#FFF'} size={30} />
                  <View>
                    <Text style={scanStyle.text}>{barcode}</Text>
                    <Text style={scanStyle.text}>{'Товар не найден'}</Text>
                  </View>
                </View>
              </View>
            )}
            {scanned && goodItem && (
              //const item: numder = 10;

              <View style={scanStyle.buttonsContainer}>
                <TouchableOpacity
                  style={[scanStyle.buttons, { backgroundColor: '#4380D3' }]}
                  onPress={() => {
                    navigation.navigate('InventoryLineEdit', {
                      mode: 0,
                      docId,
                      item: itemLine,
                    });
                  }}
                >
                  <IconButton icon={'checkbox-marked-circle-outline'} color={'#FFF'} size={30} />
                  <View style={scanStyle.goodInfo}>
                    <Text style={scanStyle.goodName} numberOfLines={3}>
                      {goodItem?.name}
                    </Text>
                    <Text style={scanStyle.barcode}>
                      цена: {goodItem?.price || 0}, остаток: {goodItem?.remains}, кол-во: {goodItem?.quantity}
                    </Text>
                    <Text style={scanStyle.barcode}>{goodItem?.barcode}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        {!scanned && (
          <View style={scanStyle.footer}>
            <>
              <ScanButton onPress={handleScannerGood} />
              <Text style={scanStyle.text}>Наведите рамку на штрихкод</Text>
            </>
          </View>
        )}
      </Camera>
    </View>
  );
};
