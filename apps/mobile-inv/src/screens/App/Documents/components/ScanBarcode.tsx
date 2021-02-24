/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react-native/no-inline-styles */
import { useTheme } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar, Vibration } from 'react-native';
import { Text, IconButton } from 'react-native-paper';

import { IGood } from '../../../../../../common';
import { IRem, IRemains, IWeightCodeSettings } from '../../../../../../common/base';
import { DocumentStackParamList } from '../../../../navigation/DocumentsNavigator';
import { useAppStore } from '../../../../store';
import styles from '../../../../styles/global';

const ONE_SECOND_IN_MS = 1000;

type Props = StackScreenProps<DocumentStackParamList, 'ScanBarcode'>;

type ScannedObject = IRem & { quantity: number };

const ScanBarcodeScreen = ({ route, navigation }: Props) => {
  const { colors } = useTheme();
  const [hasPermission, setHasPermission] = useState(null);
  const [flashMode, setFlashMode] = useState(false);
  const [vibroMode, setVibroMode] = useState(false);
  const [scanned, setScanned] = useState(false);
  const { state } = useAppStore();

  const [barcode, setBarcode] = useState('');
  const [goodItem, setGoodItem] = useState<ScannedObject>(undefined);

  const docId = route.params?.docId;

  const document = useMemo(() => state.documents?.find((item: { id: number }) => item.id === docId), [
    docId,
    state.documents,
  ]);

  const goods = useMemo(() => state.references?.goods?.data as IGood[], [state.references?.goods?.data]);

  const weightCodeSettings = useMemo(() => (state.companySettings?.weightSettings as unknown) as IWeightCodeSettings, [
    state.companySettings?.weightSettings,
  ]);

  const remains = useMemo(
    () =>
      ((state.references?.remains?.data as unknown) as IRemains[])?.find(
        (rem) => rem.contactId === document?.head?.fromcontactId,
      )?.data || [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.references?.remains?.data],
  );

  //список остатков + поля из справочника тмц
  const goodRemains = useMemo(() => {
    console.log('111');
    return remains?.map((item) => ({
      ...goods.find((good) => good.id === item.goodId),
      price: item.price,
      remains: item.q,
    }));
  }, [goods, remains]);

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
      setGoodItem(undefined);
      return;
    }

    const getScannedObject = (brc: string): ScannedObject => {
      let goodObj: IRem;
      let charFrom = 0;

      let charTo = weightCodeSettings?.weightCode.length;
      if (brc.substring(charFrom, charTo) !== weightCodeSettings?.weightCode) {
        goodObj = goodRemains?.find((item) => item.barcode === brc);
        return goodObj ? { ...goodObj, quantity: 1 } : undefined;
      }

      charFrom = charTo;
      charTo = charFrom + weightCodeSettings?.code;
      const code = Number(barcode.substring(charFrom, charTo)).toString();

      charFrom = charTo;
      charTo = charFrom + weightCodeSettings?.weight;

      const qty = Number(barcode.substring(charFrom, charTo)) / 1000;

      goodObj = goodRemains?.find((item) => item.weightCode === code);
      return goodObj ? { ...goodObj, quantity: qty } : undefined;
    };

    vibroMode && Vibration.vibrate(ONE_SECOND_IN_MS);

    const scannedObj: ScannedObject = getScannedObject(barcode);

    setGoodItem(scannedObj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barcode, scanned, goodRemains]);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text style={styles.title}>Нет доступа к камере</Text>;
  }

  return (
    <View style={[localStyles.content, { backgroundColor: colors.card }]}>
      <Camera
        flashMode={flashMode ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off}
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.ean13],
        }}
        autoFocus="on"
        whiteBalance="auto"
        onBarCodeScanned={({ data }: { data: string }) => !scanned && handleBarCodeScanned(data)}
        style={localStyles.camera}
      >
        <View style={localStyles.header}>
          <IconButton
            icon="arrow-left"
            color={'#FFF'}
            size={30}
            style={localStyles.transparent}
            onPress={() => navigation.goBack()}
          />
          <IconButton
            icon={flashMode ? 'flash' : 'flash-off'}
            color={'#FFF'}
            style={localStyles.transparent}
            onPress={() => setFlashMode(!flashMode)}
          />
          <IconButton
            icon={vibroMode ? 'vibrate' : 'vibrate-off'}
            color={'#FFF'}
            style={localStyles.transparent}
            onPress={() => setVibroMode(!vibroMode)}
          />
          <IconButton
            icon={'feature-search-outline'}
            color={'#FFF'}
            style={localStyles.transparent}
            onPress={() => navigation.navigate('RemainsList', { docId: document?.id })}
          />
        </View>
        {!scanned ? (
          <View style={[localStyles.scannerContainer, { alignItems: 'center' }]}>
            <View
              style={{
                width: '70%',
                height: '50%',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={[localStyles.border, localStyles.borderTop, localStyles.borderLeft]} />
                <View style={[localStyles.border, localStyles.borderTop, localStyles.borderRight]} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={[localStyles.border, localStyles.borderBottom, localStyles.borderLeft]} />
                <View style={[localStyles.border, localStyles.borderBottom, localStyles.borderRight]} />
              </View>
            </View>
          </View>
        ) : (
          <View style={localStyles.scannerContainer}>
            <View style={localStyles.buttonsContainer}>
              <TouchableOpacity
                style={[localStyles.buttons, { backgroundColor: '#FFCA00' }]}
                onPress={() => setScanned(false)}
              >
                <IconButton icon={'barcode-scan'} color={'#FFF'} size={30} />
                <Text style={localStyles.text}>Пересканировать</Text>
              </TouchableOpacity>
            </View>
            {scanned && !goodItem && (
              <View style={localStyles.infoContainer}>
                <View style={[localStyles.buttons, { backgroundColor: '#CC3C4D' }]}>
                  <IconButton icon={'information-outline'} color={'#FFF'} size={30} />
                  <View>
                    <Text style={localStyles.text}>{barcode}</Text>
                    <Text style={localStyles.text}>{'Товар не найден'}</Text>
                  </View>
                </View>
              </View>
            )}
            {scanned && goodItem && (
              <View style={localStyles.buttonsContainer}>
                <TouchableOpacity
                  style={[localStyles.buttons, { backgroundColor: '#4380D3' }]}
                  onPress={() => {
                    navigation.navigate('DocumentLineEdit', {
                      prodId: goodItem.id,
                      docId,
                      price: goodItem.price,
                      remains: goodItem.remains,
                      quantity: goodItem.quantity,
                    });
                  }}
                >
                  <IconButton icon={'checkbox-marked-circle-outline'} color={'#FFF'} size={30} />
                  <View style={localStyles.goodInfo}>
                    <Text style={localStyles.goodName} numberOfLines={3}>
                      {goodItem?.name}
                    </Text>
                    <Text style={localStyles.barcode}>
                      цена: {goodItem?.price || 0}, кол-во: {goodItem?.quantity}
                    </Text>
                    <Text style={localStyles.barcode}>{goodItem?.barcode}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        {!scanned && (
          <View style={localStyles.footer}>
            <>
              <IconButton icon={'barcode-scan'} color={'#FFF'} size={40} />
              <Text style={localStyles.text}>Наведите рамку на штрихкод</Text>
            </>
          </View>
        )}
      </Camera>
    </View>
  );
};

export { ScanBarcodeScreen };

const localStyles = StyleSheet.create({
  barcode: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.5,
  },
  border: {
    height: 50,
    width: 50,
  },
  borderBottom: {
    borderBottomColor: '#FF8',
    borderBottomWidth: 2,
  },
  borderLeft: {
    borderLeftColor: '#FF8',
    borderLeftWidth: 2,
  },
  borderRight: {
    borderRightColor: '#FF8',
    borderRightWidth: 2,
  },
  borderTop: {
    borderTopColor: '#FF8',
    borderTopWidth: 2,
  },
  buttons: {
    alignItems: 'center',
    borderRadius: 10,
    elevation: 8,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonsContainer: {
    minHeight: 100,
    padding: 10,
  },
  camera: {
    flex: 1,
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingTop: StatusBar.currentHeight ?? 0,
  },
  footer: {
    alignItems: 'center',
    backgroundColor: '#0008',
    height: 100,
    justifyContent: 'center',
  },
  goodInfo: {
    // marginHorizontal: 10,
  },
  goodName: {
    color: '#fff',
    fontSize: 18,
    textTransform: 'uppercase',
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#0008',
    flexDirection: 'row',
    height: 70,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 30,
  },
  infoContainer: {
    height: 100,
    padding: 10,
    // justifyContent: 'center',
  },
  scannerContainer: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 18,
    textTransform: 'uppercase',
  },
  transparent: {
    backgroundColor: 'transparent',
  },
});
