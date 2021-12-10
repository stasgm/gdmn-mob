/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Vibration,
  Keyboard,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import { v4 as uuid } from 'uuid';

import { useNavigation, useTheme, RouteProp, useRoute } from '@react-navigation/native';
import { INamedEntity, ISettingsOption } from '@lib/types';
import { useSelector, docSelectors } from '@lib/store';
import { scanReader } from '@lib/mobile-ui/src/styles/scanReader';

import { useSelector as useAppInventorySelector } from '../../../../store/index';
import { InventorysStackParamList } from '../../../../navigation/Root/types';
import { IInventoryLine, IInventoryDocument } from '../../../../store/types';

const oneSecund = 1000;

export const ScanBarcodeReaderScreen = () => {
  const ref = useRef<TextInput>(null);

  const docId = useRoute<RouteProp<InventorysStackParamList, 'ScanBarcode'>>().params?.docId;
  const navigation = useNavigation();
  const { data: settings } = useSelector((state) => state.settings);

  const weightSettingsWeightCode = (settings.weightCode as ISettingsOption<string>) || '';
  const weightSettingsCountCode = (settings.countCode as ISettingsOption<number>).data || 0;
  const weightSettingsCountWeight = (settings.countWeight as ISettingsOption<number>).data || 0;

  const [vibroMode, setVibroMode] = useState(false);
  const [scanned, setScanned] = useState(false);
  const { colors } = useTheme();

  const [barcode, setBarcode] = useState('');
  const [itemLine, setItemLine] = useState<IInventoryLine>();
  const model = useAppInventorySelector((state) => state.appInventory.model);

  const document = docSelectors
    .selectByDocType<IInventoryDocument>('inventory')
    ?.find((e) => e.id === docId) as IInventoryDocument;

  const goods = model[document?.head?.department?.id || ''].goods;

  const handleBarCodeScanned = (data: string) => {
    setScanned(true);
    setBarcode(data);
  };

  useEffect(() => {
    if (!scanned && ref?.current) {
      ref.current.focus();
      ref.current.clear();
    }
  }, [scanned, ref]);

  useEffect(() => {
    if (!scanned) {
      return;
    }

    if (!barcode && scanned) {
      setItemLine(undefined);
      return;
    }

    const getScannedObject = (brc: string): IInventoryLine | undefined => {
      let charFrom = 0;
      let charTo = weightSettingsWeightCode.data.length;

      if (brc.substring(charFrom, charTo) !== weightSettingsWeightCode.data) {
        const remItem = goods?.[Object.keys(goods).find((item) => goods[item].barcode === brc) || ''];

        if (!remItem) {
          return;
        }

        const { remains, ...good } = remItem;

        return {
          good: { id: good.id, name: good.name } as INamedEntity,
          id: uuid(),
          quantity: 1,
          price: remains!.length ? remains![0].price : 0,
          remains: remains!.length ? remains![0].q : 0,
          barcode: good.barcode,
        };
      }

      charFrom = charTo;
      charTo = charFrom + weightSettingsCountCode;
      const code = Number(barcode.substring(charFrom, charTo)).toString();

      charFrom = charTo;
      charTo = charFrom + weightSettingsCountWeight;

      const qty = Number(barcode.substring(charFrom, charTo)) / 1000;

      const remItem = goods?.[Object.keys(goods).find((item) => goods[item].weightCode === code) || ''];

      if (!remItem) {
        return;
      }

      const { remains, ...good } = remItem;

      return {
        good: { id: good.id, name: good.name } as INamedEntity,
        id: uuid(),
        quantity: qty,
        price: remains?.length ? remains[0].price : 0,
        remains: remains?.length ? remains?.[0].q : 0,
        barcode: good.barcode,
      };
    };

    vibroMode && Vibration.vibrate(oneSecund);

    const scannedObj: IInventoryLine | undefined = getScannedObject(barcode);
    if (scannedObj !== undefined) {
      setItemLine(scannedObj);
    }
  }, [
    barcode,
    scanned,
    goods,
    vibroMode,
    weightSettingsWeightCode,
    weightSettingsCountCode,
    weightSettingsCountWeight,
  ]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[scanReader.content, { backgroundColor: colors.card }]}
    >
      <View style={scanReader.camera}>
        <View style={scanReader.header}>
          <IconButton
            icon="arrow-left"
            color={'#FFF'}
            size={30}
            style={scanReader.transparent}
            onPress={() => navigation.goBack()}
          />
          <IconButton
            icon={vibroMode ? 'vibrate' : 'vibrate-off'}
            color={'#FFF'}
            style={scanReader.transparent}
            onPress={() => setVibroMode(!vibroMode)}
          />
          <IconButton
            icon={'feature-search-outline'}
            color={'#FFF'}
            style={scanReader.transparent}
            onPress={() => navigation.navigate('RemainsList', { docId: document?.id })}
          />
        </View>
        {!scanned ? (
          <View style={[scanReader.scannerContainer, { alignItems: 'center' }]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <TextInput
                style={{ width: 0 }}
                autoFocus={true}
                ref={ref}
                showSoftInputOnFocus={false}
                onChangeText={(text) => handleBarCodeScanned(text)}
              />
            </TouchableWithoutFeedback>
          </View>
        ) : (
          <View style={scanReader.scannerContainer}>
            <View style={scanReader.buttonsContainer}>
              <TouchableOpacity
                style={[scanReader.buttons, { backgroundColor: '#FFCA00' }]}
                onPress={() => setScanned(false)}
              >
                <IconButton icon={'barcode-scan'} color={'#FFF'} size={30} />
                <Text style={scanReader.text}>Пересканировать</Text>
              </TouchableOpacity>
            </View>
            {scanned && !itemLine && (
              <View style={scanReader.infoContainer}>
                <View style={[scanReader.buttons, { backgroundColor: '#CC3C4D' }]}>
                  <IconButton icon={'information-outline'} color={'#FFF'} size={30} />
                  <View>
                    <Text style={scanReader.text}>{barcode}</Text>
                    <Text style={scanReader.text}>{'Товар не найден'}</Text>
                  </View>
                </View>
              </View>
            )}
            {scanned && itemLine && (
              <View style={scanReader.buttonsContainer}>
                <TouchableOpacity
                  style={[scanReader.buttons, { backgroundColor: '#4380D3' }]}
                  onPress={() => {
                    navigation.navigate('InventoryLine', {
                      mode: 0,
                      docId,
                      item: itemLine,
                    });
                  }}
                >
                  <IconButton icon={'checkbox-marked-circle-outline'} color={'#FFF'} size={30} />
                  <View style={scanReader.goodInfo}>
                    <Text style={scanReader.goodName} numberOfLines={3}>
                      {itemLine?.good.name}
                    </Text>
                    <Text style={scanReader.barcode}>
                      цена: {itemLine?.price || 0}, кол-во: {itemLine?.quantity}
                    </Text>
                    <Text style={scanReader.barcode}>{itemLine?.barcode}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        {!scanned && (
          <View style={scanReader.footer}>
            <>
              <IconButton icon={'barcode-scan'} color={'#FFF'} size={40} />
              <Text style={scanReader.text}>Отсканируйте штрихкод</Text>
            </>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};
