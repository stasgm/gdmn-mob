import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { Text, Alert, View, StyleSheet } from 'react-native';

import { useNavigation, RouteProp, useRoute, useIsFocused } from '@react-navigation/native';

import { AppActivityIndicator, globalStyles, MediumText, navBackButton, ScanBarcode } from '@lib/mobile-ui';
import { refSelectors, docSelectors, useDispatch, documentActions, useSelector } from '@lib/store';

import { generateId, getDateString, round } from '@lib/mobile-hooks';

import { StackNavigationProp } from '@react-navigation/stack';

import { IScannedObject } from '@lib/client-types';

import { ShipmentStackParamList } from '../navigation/Root/types';
import { IShipmentLine, IShipmentDocument, barcodeSettings } from '../store/types';

import { IAddressStoreEntity, IGood, IRemains, IRemGood } from '../store/app/types';
import { getBarcode, getLineGood, getRemGoodListByContact } from '../utils/helpers';
import { useSelector as useFpSelector, fpMovementActions, useDispatch as useFpDispatch } from '../store/index';

import { barCodeTypes } from '../utils/constants';

const ScanGoodScreen = () => {
  const docId = useRoute<RouteProp<ShipmentStackParamList, 'ScanGood'>>().params?.docId;
  const navigation = useNavigation<StackNavigationProp<ShipmentStackParamList, 'ScanGood'>>();
  const isFocused = useIsFocused();

  const fpDispatch = useFpDispatch();
  const dispatch = useDispatch();

  const goods = refSelectors.selectByName<IGood>('good').data;
  const settings = useSelector((state) => state.settings?.data);

  const [scaner, setScaner] = useState<IScannedObject>({ state: 'init' });
  const [scannedObject, setScannedObject] = useState<IShipmentLine>();

  const goodBarcodeSettings = Object.entries(settings).reduce((prev: barcodeSettings, [idx, item]) => {
    if (item && item.group?.id !== 'base' && typeof item.data === 'number') {
      prev[idx] = item.data;
    }
    return prev;
  }, {});

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
    });
  }, [navigation]);

  const shipment = docSelectors.selectByDocId<IShipmentDocument>(docId);
  const shipmentLines = useMemo(
    () => shipment?.lines?.sort((a, b) => (b.sortOrder || 0) - (a.sortOrder || 0)),
    [shipment?.lines],
  );

  const tempOrder = useFpSelector((state) => state.fpMovement.list).find((i) => i.orderId === shipment?.head?.orderId);

  const minBarcodeLength = (settings.minBarcodeLength?.data as number) || 0;

  const departs = refSelectors.selectByName<IAddressStoreEntity>('depart')?.data;

  const docList = useSelector((state) => state.documents.list) as IShipmentDocument[];

  const remainsUse = Boolean(settings.remainsUse?.data);

  const remains = refSelectors.selectByName<IRemains>('remains')?.data[0];

  const goodRemains = useMemo<IRemGood[]>(() => {
    return shipment?.head?.fromDepart?.id && isFocused
      ? getRemGoodListByContact(goods, remains[shipment.head.fromDepart.id], docList, shipment.head.fromDepart.id)
      : [];
  }, [docList, goods, isFocused, remains, shipment?.head?.fromDepart?.id]);

  const handleGetScannedObject = useCallback(
    (brc: string) => {
      if (!brc.match(/^-{0,1}\d+$/)) {
        setScaner({ state: 'error', message: 'Штрих-код неверного формата' });
        return;
      }

      if (brc.length < minBarcodeLength) {
        setScaner({
          state: 'error',
          message: `Неверный формат штрих-кода \nДлина меньше ${minBarcodeLength} символов`,
        });
        return;
      }

      const barc = getBarcode(brc, goodBarcodeSettings);

      const lineGood = getLineGood(
        barc.shcode,
        barc.weight,
        goods,
        goodRemains,
        remainsUse && shipment?.documentType.name !== 'return' && shipment?.documentType.name !== 'inventory',
      );

      if (!lineGood.good) {
        setScaner({ state: 'error', message: 'Товар не найден' });
        return;
      }

      if (!lineGood.isRightWeight) {
        setScaner({ state: 'error', message: 'Вес товара превышает вес в остатках' });
        return;
      }

      const line = shipmentLines?.find((i) => i.barcode === barc.barcode);

      if (line) {
        setScaner({ state: 'error', message: 'Штрих-код уже добавлен' });
        return;
      }

      setScannedObject({
        good: lineGood.good,
        id: generateId(),
        weight: barc.weight,
        barcode: barc.barcode,
        workDate: barc.workDate,
        numReceived: barc.numReceived,
        quantPack: barc.quantPack,
        sortOrder: (shipmentLines?.length || 0) + 1,
      });

      setScaner({ state: 'found' });
    },

    [goodBarcodeSettings, goodRemains, goods, minBarcodeLength, remainsUse, shipment?.documentType.name, shipmentLines],
  );

  const handleSaveScannedItem = useCallback(() => {
    if (!scannedObject) {
      return;
    }

    const tempLine = tempOrder?.lines?.find((i) => scannedObject.good.id === i.good.id);

    if (tempLine && tempOrder) {
      const newTempLine = { ...tempLine, weight: round(tempLine.weight - scannedObject.weight, 3) };
      if (newTempLine.weight > 0) {
        fpDispatch(
          fpMovementActions.updateTempOrderLine({
            docId: tempOrder?.id,
            line: newTempLine,
          }),
        );
        dispatch(documentActions.addDocumentLine({ docId, line: scannedObject }));
        setScaner({ state: 'init' });
      } else if (newTempLine.weight === 0) {
        fpDispatch(
          fpMovementActions.updateTempOrderLine({
            docId: tempOrder?.id,
            line: newTempLine,
          }),
        );
        dispatch(documentActions.addDocumentLine({ docId, line: scannedObject }));
        setScaner({ state: 'init' });
      } else {
        Alert.alert('Данное количество превышает количество в заявке', 'Добавить позицию?', [
          {
            text: 'Да',
            onPress: () => {
              dispatch(documentActions.addDocumentLine({ docId, line: scannedObject }));
              fpDispatch(
                fpMovementActions.updateTempOrderLine({
                  docId: tempOrder?.id,
                  line: newTempLine,
                }),
              );
              setScaner({ state: 'init' });
            },
          },
          {
            text: 'Отмена',
          },
        ]);
      }
    } else if (shipment?.documentType.name === 'shipment' || shipment?.documentType.name === 'currShipment') {
      Alert.alert('Данный товар отсутствует в позициях заявки', 'Добавить позицию?', [
        {
          text: 'Да',
          onPress: () => {
            dispatch(documentActions.addDocumentLine({ docId, line: scannedObject }));
            setScaner({ state: 'init' });
          },
        },
        {
          text: 'Отмена',
        },
      ]);
    } else {
      const isFromAddressed = departs?.find((i) => i.id === shipment?.head.fromDepart?.id && i.isAddressStore);
      const isToAddressed = departs?.find((i) => i.id === shipment?.head.toDepart?.id && i.isAddressStore);
      if (
        shipment?.head.toDepart?.isAddressStore ||
        shipment?.head.fromDepart?.isAddressStore ||
        isFromAddressed ||
        isToAddressed
      ) {
        if (scannedObject.quantPack < goodBarcodeSettings.boxNumber) {
          Alert.alert('Внимание!', `Вес поддона не может быть меньше ${goodBarcodeSettings.boxNumber}!`, [
            { text: 'OK' },
          ]);
          setScaner({ state: 'init' });
          return;
        }
        navigation.navigate('SelectCell', { docId, item: scannedObject, mode: 0 });
      } else {
        dispatch(documentActions.addDocumentLine({ docId, line: scannedObject }));
      }
      setScaner({ state: 'init' });
    }
  }, [
    scannedObject,
    tempOrder,
    shipment?.documentType.name,
    shipment?.head.toDepart?.isAddressStore,
    shipment?.head.toDepart?.id,
    shipment?.head.fromDepart?.isAddressStore,
    shipment?.head.fromDepart?.id,
    fpDispatch,
    dispatch,
    docId,
    departs,
    goodBarcodeSettings.boxNumber,
    navigation,
  ]);

  const handleClearScaner = () => setScaner({ state: 'init' });

  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  if (!shipment) {
    return <Text style={globalStyles.title}>Документ не найден</Text>;
  }

  return (
    <ScanBarcode
      onSave={handleSaveScannedItem}
      onGetScannedObject={handleGetScannedObject}
      onClearScannedObject={handleClearScaner}
      scaner={scaner}
      barCodeTypes={barCodeTypes}
    >
      {scannedObject ? (
        <View style={localStyles.itemInfo}>
          <MediumText style={localStyles.text}>{scannedObject.good.name}</MediumText>
          <MediumText style={globalStyles.lightText}>№ партии: {scannedObject.numReceived || ''}</MediumText>
          <MediumText style={globalStyles.lightText}>
            Дата производства: {getDateString(scannedObject.workDate)}
          </MediumText>
          <MediumText style={globalStyles.lightText}>Вес: {scannedObject.weight} кг.</MediumText>
        </View>
      ) : undefined}
    </ScanBarcode>
  );
};

export default ScanGoodScreen;

const localStyles = StyleSheet.create({
  itemInfo: {
    flexShrink: 1,
    paddingRight: 10,
  },
  text: {
    color: '#fff',
    textTransform: 'uppercase',
  },
});
