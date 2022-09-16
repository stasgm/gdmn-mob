import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { Text, Alert, View, StyleSheet } from 'react-native';

import { useNavigation, RouteProp, useRoute, useIsFocused } from '@react-navigation/native';

import { AppActivityIndicator, globalStyles, MediumText, navBackButton, ScanBarcode } from '@lib/mobile-ui';
import { refSelectors, docSelectors, useDispatch, documentActions, useSelector } from '@lib/store';

import { generateId, getDateString, round } from '@lib/mobile-app';

import { StackNavigationProp } from '@react-navigation/stack';

import { IScannedObject } from '@lib/client-types';

import { ShipmentStackParamList } from '../../navigation/Root/types';
import { IShipmentLine, IShipmentDocument, barcodeSettings } from '../../store/types';

import { IGood } from '../../store/app/types';
import { getBarcode } from '../../utils/helpers';
import { useSelector as useFpSelector, fpMovementActions, useDispatch as useFpDispatch } from '../../store/index';

import { barCodeTypes } from '../../utils/constants';

const ScanGoodByShipmentScreen = () => {
  const docId = useRoute<RouteProp<ShipmentStackParamList, 'ScanGood'>>().params?.docId;
  const navigation = useNavigation<StackNavigationProp<ShipmentStackParamList, 'ScanGood'>>();

  const fpDispatch = useFpDispatch();
  const dispatch = useDispatch();

  const goods = refSelectors.selectByName<IGood>('good').data;
  const settings = useSelector((state) => state.settings?.data);

  const [scaner, setScaner] = useState<IScannedObject>({ state: 'init' });
  const [scannedObject, setScannedObject] = useState<IShipmentLine>();

  const goodBarcodeSettings = Object.entries(settings).reduce((prev: barcodeSettings, [idx, item]) => {
    if (item && item.group?.id !== '1' && typeof item.data === 'number') {
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

  const handleGetScannedObject = useCallback(
    (brc: string) => {
      if (!brc.match(/^-{0,1}\d+$/)) {
        setScaner({ state: 'error', message: 'Штрих-код неверного формата. Повторите сканирование!' });
        return;
      }

      const barc = getBarcode(brc, goodBarcodeSettings);

      const good = goods.find((item) => `0000${item.shcode}`.slice(-4) === barc.shcode);

      if (!good) {
        setScaner({ state: 'error', message: 'Товар не найден!' });
        return;
      }

      const line = shipmentLines?.find((i) => i.barcode === barc.barcode);

      if (line) {
        setScaner({ state: 'error', message: 'Данный штрих-код уже добавлен!' });
        return;
      }

      setScannedObject({
        good: { id: good.id, name: good.name, shcode: good.shcode },
        id: generateId(),
        weight: barc.weight,
        barcode: barc.barcode,
        workDate: barc.workDate,
        numReceived: barc.numReceived,
        quantPack: barc.quantPack,
        sortOrder: shipmentLines?.length + 1,
      });

      setScaner({ state: 'found' });
    },

    [goodBarcodeSettings, goods, shipmentLines],
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
    } else {
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
    }
  }, [scannedObject, tempOrder, fpDispatch, dispatch, docId]);

  const handleClearScaner = () => setScaner({ state: 'init' });

  const isFocused = useIsFocused();
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

export default ScanGoodByShipmentScreen;

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
