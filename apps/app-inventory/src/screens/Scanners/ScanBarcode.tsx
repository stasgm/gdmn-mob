/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, TouchableOpacity, Vibration } from 'react-native';
import { v4 as uuid } from 'uuid';
import { Text, IconButton } from 'react-native-paper';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';

import { useNavigation, useTheme, RouteProp, useRoute } from '@react-navigation/native';

import styles from '@lib/mobile-ui/src/styles/global';
import { scanStyle } from '@lib/mobile-ui/src/styles/scanStyle';
import { ScanButton } from '@lib/mobile-ui';
import { refSelectors, useSelector, docSelectors } from '@lib/store';

import { INamedEntity, Settings, ISettingsOption } from '@lib/types';

import { useSelector as useAppInventorySelector } from '../../store/index';

import { InventorysStackParamList } from '../../navigation/Root/types';
import { IRem, IGood, IInventoryLine, IInventoryDocument, IModelData, IMDGoodRemain, IGoodGroup } from '../../store/types';

const oneSecund = 1000;

export const ScanBarcodeScreen = () => {
  const docId = useRoute<RouteProp<InventorysStackParamList, 'ScanBarcode'>>().params?.docId;
  const navigation = useNavigation();

  const document = docSelectors.selectByDocType<IInventoryDocument>('inventory')?.find((e) => e.id === docId);
  const { model } = useAppInventorySelector((state) => state.appInventory);
  const groups = refSelectors.selectByName<IGoodGroup>('goodGroup').data;
  const groupsModel = model[document?.head?.contact?.id || ''] || {};
  // const goods = groupsModel[];

  const goods1 = refSelectors.selectByName<IGood>('good');
  // const good = groupsModel[goods.id];

  //const remainsData = model[document?.];// as IModelData<IMDGoodRemain>;
  //const goods = remainsData?.[document?.head?.fromcontactId]?.goods;

  console.log('groupsModel', groupsModel);

  const { data: settings } = useSelector((state) => state.settings);

  const weightSettingsWeightCode = (settings.weightCode as ISettingsOption<string>) || '';
  const weightSettingsCountCode = (settings.countCode as ISettingsOption<number>).data || 0;
  const weightSettingsCountWeight = (settings.countWeight as ISettingsOption<number>).data || 0;

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [flashMode, setFlashMode] = useState(false);
  const [vibroMode, setVibroMode] = useState(false);
  const [scanned, setScanned] = useState(false);
  const { colors } = useTheme();

  const [barcode, setBarcode] = useState('');
  const [itemLine, setItemLine] = useState<IInventoryLine>();

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

  /* useEffect(() => {
    if (!scanned) {
      return;
    }

    if (!barcode && scanned) {
      setItemLine(undefined);
      return;
    } */

    //const getScannedObject = (brc: string): IInventoryLine | undefined => {

     /*  let charFrom = 0;
      let charTo = weightSettingsWeightCode.data.length;

      if (brc.substring(charFrom, charTo) !== weightSettingsWeightCode.data) {
        const remItem = goods?.find((item: number) => goods[item].barcode === brc);

        if (!remItem) {
          return;
        }

        const { remains, ...good } = remItem; */



      /* const good = goods1?.find((e) => e.barcode === brc);
      if (!good) {
        return;
      } else {
        return {
          good: { id: good.id, name: good.name } as INamedEntity,
          id: uuid(),
          quantity: 1,
          price: 10,
          remains: 0,
          barcode: good.barcode,
        };
      }
    };
    */
//////////////
/* const getScannedObject = (brc: string): ScannedObject => {
  let charFrom = 0;

  let charTo = weightCodeSettings?.weightCode.length;

  if (brc.substring(charFrom, charTo) !== weightCodeSettings?.weightCode) {
    const remItem = goods?.[Object.keys(goods).find((item) => goods[item].barcode === brc)];

    if (!remItem) {
      return;
    }

    const { remains, ...good } = remItem;

    return {
      goodkey: good.id,
      ...good,
      quantity: 1,
      price: remains.length ? remains[0].price : 0,
      remains: remains.length ? remains?.[0].q : 0,
    };

    // return goodObj ? { ...goodObj, quantity: 1 } : undefined;
  }

  charFrom = charTo;
  charTo = charFrom + weightCodeSettings?.code;
  const code = Number(barcode.substring(charFrom, charTo)).toString();

  charFrom = charTo;
  charTo = charFrom + weightCodeSettings?.weight;

  const qty = Number(barcode.substring(charFrom, charTo)) / 1000;

  const remItem = goods?.[Object.keys(goods).find((item) => goods[item].weightCode === code)];

  if (!remItem) {
    return;
  }

  const { remains, ...good } = remItem;

  return {
    goodkey: good.id,
    ...good,
    quantity: qty,
    price: remains.length ? remains[0].price : 0,
    remains: remains.length ? remains?.[0].q : 0,
  };
}; */
 //////////////
    vibroMode && Vibration.vibrate(oneSecund);

    /* const scannedObj: IInventoryLine | undefined = getScannedObject(barcode);
    if (scannedObj !== undefined) {
      setItemLine(scannedObj);
    } */
} //, [barcode, scanned, vibroMode]);

  /* if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text style={styles.title}>Нет доступа к камере</Text>;
  }
 */
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
            onPress={() => setFlashMode(!flashMode)} //navigation.navigate('RemainsList', { docId: document?.id })
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
            {scanned && !itemLine && (
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
            {scanned && itemLine && (
              <View style={scanStyle.buttonsContainer}>
                <TouchableOpacity
                  style={[scanStyle.buttons, { backgroundColor: '#4380D3' }]}
                  onPress={() => {
                    console.log('#itemLine', itemLine);
                    navigation.navigate('InventoryLine', {
                      mode: 0,
                      docId,
                      item: itemLine,
                    });
                  }}
                >
                  <IconButton icon={'checkbox-marked-circle-outline'} color={'#FFF'} size={30} />
                  <View style={scanStyle.goodInfo}>
                    <Text style={scanStyle.goodName} numberOfLines={3}>
                      {itemLine?.good.name}
                    </Text>
                    <Text style={scanStyle.barcode}>
                      цена: {itemLine?.price || 0}, остаток: {itemLine?.remains}, кол-во: {itemLine?.quantity}
                    </Text>
                    <Text style={scanStyle.barcode}>{itemLine?.barcode}</Text>
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
