import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import { useNavigation, RouteProp, useRoute, useIsFocused } from '@react-navigation/native';

import {
  AppActivityIndicator,
  globalStyles,
  LargeText,
  navBackButton,
  ScanBarcode,
  ScanBarcodeReader,
} from '@lib/mobile-ui';
import { useSelector, refSelectors } from '@lib/store';

import { IDocumentType, ISettingsOption } from '@lib/types';

import { generateId } from '@lib/mobile-hooks';

import { StackNavigationProp } from '@react-navigation/stack';

import { IScannedObject } from '@lib/client-types';

import { DocStackParamList } from '../../navigation/Root/types';
import { IMovementLine, IMovementDocument } from '../../store/types';
import { IGood, IMGoodData, IMGoodRemain, IRemains } from '../../store/app/types';
import { getRemGoodByContact } from '../../utils/helpers';
import { IBarcodeTypes, unknownGood } from '../../utils/constants';
import { useSelector as useInvSelector } from '../../store';

const ScanBarcodeScreen = () => {
  const docId = useRoute<RouteProp<DocStackParamList, 'ScanBarcode'>>().params?.docId;
  const navigation = useNavigation<StackNavigationProp<DocStackParamList, 'ScanBarcode'>>();
  const settings = useSelector((state) => state.settings?.data);

  const weightSettingsWeightCode = (settings.weightCode as ISettingsOption<string>) || '';
  const weightSettingsCountCode = (settings.countCode as ISettingsOption<number>)?.data || 0;
  const weightSettingsCountWeight = (settings.countWeight as ISettingsOption<number>)?.data || 0;
  const barcodeTypes =
    (settings.barcodeTypes as ISettingsOption<Array<IBarcodeTypes>>)?.data
      ?.filter((t) => t.selected)
      .map((t) => t.type) || [];

  const isScanerReader = settings.scannerUse?.data;
  const isInputQuantity = settings.quantityInput?.data;
  const unknownGoods = useInvSelector((state) => state.appInventory.unknownGoods);

  const [scaner, setScaner] = useState<IScannedObject>({ state: 'init' });
  const [scannedObject, setScannedObject] = useState<IMovementLine>();
  const handleClearScaner = () => setScaner({ state: 'init' });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
    });
  }, [navigation]);

  const handleShowRemains = useCallback(() => {
    navigation.navigate('SelectRemainsItem', { docId });
  }, [docId, navigation]);

  const document = useSelector((state) => state.documents.list).find((item) => item.id === docId) as IMovementDocument;

  const goods = refSelectors.selectByName<IGood>('good')?.data;
  const remains = refSelectors.selectByName<IRemains>('remains')?.data[0];

  const documentTypes = refSelectors.selectByName<IDocumentType>('documentType')?.data;
  const documentType = useMemo(
    () => documentTypes?.find((d) => d.id === document?.documentType.id),
    [document?.documentType.id, documentTypes],
  );

  const contactId = useMemo(
    () =>
      documentType?.remainsField === 'fromContact' ? document?.head?.fromContact?.id : document?.head?.toContact?.id,
    [document?.head?.fromContact?.id, document?.head?.toContact?.id, documentType?.remainsField],
  );

  const goodRemains = useMemo<IMGoodData<IMGoodRemain>>(
    () =>
      contactId ? getRemGoodByContact(goods.concat(unknownGoods), remains[contactId], documentType?.isRemains) : {},
    [contactId, documentType?.isRemains, goods, remains, unknownGoods],
  );

  const getScannedObject = useCallback(
    (brc: string, typeOk = true) => {
      if (!brc) {
        return;
      }

      if (!typeOk) {
        setScaner({
          state: 'error',
          message: 'Неверный тип штрихкода',
        });
        return;
      }

      let charFrom = 0;
      let charTo = weightSettingsWeightCode.data.length;

      if (brc.substring(charFrom, charTo) !== weightSettingsWeightCode.data) {
        const remItem =
          goodRemains[brc] || (documentType?.isRemains ? undefined : { good: { ...unknownGood, barcode: brc } });

        // Находим товар из модели остатков по баркоду, если баркод не найден, то
        //   если выбор из остатков, то undefined,
        //   иначе подставляем unknownGood cо сканированным шк и добавляем в позицию документа

        if (!remItem) {
          setScaner({ state: 'error', message: 'Товар не найден' });
          return;
        }

        setScannedObject({
          good: { id: remItem.good.id, name: remItem.good.name },
          id: generateId(),
          quantity: isInputQuantity ? 1 : 0,
          price: remItem.remains?.length ? remItem.remains[0].price : 0,
          buyingPrice: remItem.remains?.length ? remItem.remains[0].buyingPrice : 0,
          remains: remItem.remains?.length ? remItem.remains?.[0].q : 0,
          barcode: remItem.good.barcode,
        });

        setScaner({ state: remItem.good.id === 'unknown' ? 'error' : 'found' });
      } else {
        charFrom = charTo;
        charTo = charFrom + weightSettingsCountCode;
        const code = Number(brc.substring(charFrom, charTo)).toString();

        charFrom = charTo;
        charTo = charFrom + weightSettingsCountWeight;

        const qty = Number(brc.substring(charFrom, charTo)) / 1000;

        const remItem =
          Object.values(goodRemains)?.find((item: IMGoodRemain) => item.good.weightCode === code) ||
          (documentType?.isRemains ? undefined : { good: { ...unknownGood, barcode: brc } });

        if (!remItem) {
          setScaner({ state: 'error', message: 'Товар не найден' });
          return;
        }

        setScannedObject({
          good: { id: remItem.good.id, name: remItem.good.name },
          id: generateId(),
          quantity: qty,
          price: remItem.remains?.length ? remItem.remains[0].price : 0,
          buyingPrice: remItem.remains?.length ? remItem.remains[0].buyingPrice : 0,
          remains: remItem.remains?.length ? remItem.remains?.[0].q : 0,
          barcode: remItem.good.barcode,
        });

        setScaner({ state: remItem.good.id === 'unknown' ? 'error' : 'found' });
      }
    },
    [
      documentType?.isRemains,
      goodRemains,
      isInputQuantity,
      weightSettingsCountCode,
      weightSettingsCountWeight,
      weightSettingsWeightCode.data,
    ],
  );

  const handleSaveScannedItem = useCallback(() => {
    if (!scannedObject) {
      return;
    }
    navigation.navigate('DocLine', {
      mode: 0,
      docId,
      item: scannedObject,
    });
    setScaner({ state: 'init' });
  }, [docId, navigation, scannedObject]);

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  if (!document) {
    return (
      <View style={[globalStyles.container, globalStyles.alignItemsCenter]}>
        <LargeText>Документ не найден</LargeText>
      </View>
    );
  }

  return isScanerReader ? (
    <ScanBarcodeReader
      onSave={handleSaveScannedItem}
      onGetScannedObject={getScannedObject}
      onClearScannedObject={handleClearScaner}
      scaner={scaner}
      onSearch={handleShowRemains}
    >
      {scannedObject ? (
        <View style={localStyles.itemInfo}>
          <View style={localStyles.goodInfo}>
            <Text style={localStyles.goodName} numberOfLines={3}>
              {scannedObject?.good.name}
            </Text>
            <Text style={localStyles.barcode}>{scannedObject?.barcode}</Text>
            <Text style={localStyles.barcode}>
              цена: {scannedObject?.price || 0} р., остаток: {scannedObject?.remains}
            </Text>
            <Text style={localStyles.barcode}>количество: {scannedObject?.quantity}</Text>
          </View>
        </View>
      ) : undefined}
    </ScanBarcodeReader>
  ) : (
    <ScanBarcode
      onSave={handleSaveScannedItem}
      onGetScannedObject={getScannedObject}
      onClearScannedObject={handleClearScaner}
      scaner={scaner}
      barCodeTypes={barcodeTypes}
      onSearch={handleShowRemains}
    >
      {scannedObject ? (
        <View style={localStyles.itemInfo}>
          <View style={localStyles.goodInfo}>
            <Text style={localStyles.goodName} numberOfLines={3}>
              {scannedObject?.good.name}
            </Text>
            <Text style={localStyles.barcode}>{scannedObject?.barcode}</Text>
            <Text style={localStyles.barcode}>
              цена: {scannedObject?.price || 0} р., остаток: {scannedObject?.remains}
            </Text>
            <Text style={localStyles.barcode}>количество: {scannedObject?.quantity}</Text>
          </View>
        </View>
      ) : undefined}
    </ScanBarcode>
  );
};

export default ScanBarcodeScreen;

const localStyles = StyleSheet.create({
  itemInfo: {
    flexShrink: 1,
    paddingRight: 10,
  },
  goodInfo: {
    flexShrink: 1,
    paddingRight: 10,
  },
  goodName: {
    color: '#fff',
    fontSize: 18,
    textTransform: 'uppercase',
  },
  barcode: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.5,
  },
});
