import React, { useCallback, useLayoutEffect, useState } from 'react';

import { useNavigation, useIsFocused, useRoute, RouteProp, StackActions } from '@react-navigation/native';

import { useSelector, refSelectors, docSelectors, documentActions, useDispatch } from '@lib/store';

import { IDocumentType } from '@lib/types';

import { generateId } from '@lib/mobile-hooks';

import { StackNavigationProp } from '@react-navigation/stack';

import {
  AppActivityIndicator,
  globalStyles,
  LargeText,
  navBackButton,
  ScanBarcode,
  ScanBarcodeReader,
} from '@lib/mobile-ui';

import { View, Text, StyleSheet } from 'react-native';

import { IScannedObject } from '@lib/client-types';

import { CurrShipmentStackParamList, ShipmentStackParamList } from '../../navigation/Root/types';
import { IOrderDocument, IShipmentDocument, ITempDocument } from '../../store/types';

import { ICodeEntity } from '../../store/app/types';

import { actions as fpActions } from '../../store/app/actions';
import { useSelector as useFpSelector } from '../../store/index';

import { barCodeTypes } from '../../utils/constants';

const ScanOrderScreen = () => {
  const { docTypeId, isShipment } = useRoute<RouteProp<ShipmentStackParamList, 'ScanOrder'>>().params;

  const navigation = useNavigation<StackNavigationProp<ShipmentStackParamList, 'ScanOrder'>>();
  const navigationCurr = useNavigation<StackNavigationProp<CurrShipmentStackParamList, 'ScanOrder'>>();

  const settings = useSelector((state) => state.settings?.data);

  const dispatch = useDispatch();

  const isScanerReader = settings.scannerUse?.data;

  useLayoutEffect(() => {
    isShipment
      ? navigation.setOptions({
          headerLeft: navBackButton,
        })
      : navigationCurr.setOptions({
          headerLeft: navBackButton,
        });
  }, [isShipment, navigation, navigationCurr]);

  const orders = docSelectors.selectByDocType<IOrderDocument>('order');

  const shipments = useSelector((state) =>
    state.documents?.list.filter((i) => i.documentType?.name === 'shipment' || i.documentType?.name === 'currShipment'),
  ) as IShipmentDocument[];

  const shipmentType = refSelectors.selectByName<IDocumentType>('documentType')?.data.find((t) => t.name === docTypeId);

  const defaultDepart = useSelector((state) => state.auth.user?.settings?.depart?.data) as ICodeEntity;

  const tempOrders = useFpSelector((state) => state.fpMovement.list);

  const [scannedObject, setScannedObject] = useState<IOrderDocument>();

  const handleSaveScannedItem = useCallback(() => {
    if (!scannedObject) {
      return;
    }

    const shipment = shipments.find((i) => i.head.orderId === scannedObject.id);

    if (shipment) {
      isShipment
        ? navigation.dispatch(
            StackActions.replace('ShipmentView', {
              id: shipment.id,
              isShipment,
            }),
          )
        : navigationCurr.dispatch(
            StackActions.replace('ShipmentView', {
              id: shipment.id,
              isShipment,
            }),
          );
      return;
    }

    const tempOrder = tempOrders.find((i) => i.orderId === scannedObject.head.orderId);
    if (!tempOrder) {
      const newTempOrder: ITempDocument = {
        id: generateId(),
        orderId: scannedObject.id,
        lines: scannedObject.lines,
      };

      dispatch(fpActions.addTempOrder(newTempOrder));
    }

    const depart = defaultDepart || scannedObject.head.depart;

    const shipmentDoc: IShipmentDocument = {
      id: generateId(),
      documentType: shipmentType!,
      number: scannedObject.number,
      documentDate: new Date().toISOString(),
      status: 'DRAFT',
      head: {
        barcode: scannedObject.head.barcode,
        contact: scannedObject.head.contact,
        fromDepart: depart,
        outlet: scannedObject.head.outlet,
        onDate: scannedObject.head.onDate,
        orderId: scannedObject.id,
      },
      lines: [],
      creationDate: new Date().toISOString(),
      editionDate: new Date().toISOString(),
    };

    dispatch(documentActions.addDocument(shipmentDoc));

    if (depart) {
      isShipment
        ? navigation.dispatch(
            StackActions.replace('ShipmentView', {
              id: shipmentDoc.id,
              isShipment,
            }),
          )
        : navigationCurr.dispatch(
            StackActions.replace('ShipmentView', {
              id: shipmentDoc.id,
              isShipment,
            }),
          );
    } else {
      isShipment
        ? navigation.dispatch(
            StackActions.replace('ShipmentEdit', {
              id: shipmentDoc.id,
              isShipment,
            }),
          )
        : navigationCurr.dispatch(
            StackActions.replace('ShipmentEdit', {
              id: shipmentDoc.id,
              isShipment,
            }),
          );
    }
  }, [
    scannedObject,
    shipments,
    tempOrders,
    defaultDepart,
    shipmentType,
    dispatch,
    isShipment,
    navigation,
    navigationCurr,
  ]);

  const [scaner, setScaner] = useState<IScannedObject>({ state: 'init' });

  const handleGetScannedObject = useCallback(
    (brc: string) => {
      if (!brc.match(/^-{0,1}\d+$/)) {
        setScaner({ state: 'error', message: 'Штрих-код неверного формата' });
        return;
      }

      const order = orders.find((item) => item.head.barcode === brc);
      if (order) {
        const shipment = shipments.find((i) => i.head.orderId === order.id);

        if (shipment) {
          setScaner({ state: 'error', message: 'Заявка уже добавлена' });
        } else {
          setScannedObject(order);
          setScaner({ state: 'found' });
        }
      } else {
        setScaner({ state: 'error', message: 'Заявка не найдена' });
      }
    },
    [orders, shipments],
  );

  const handleClearScaner = () => setScaner({ state: 'init' });

  const ScanItem = useCallback(
    () =>
      scannedObject ? (
        <View style={localStyles.itemInfo}>
          <Text style={localStyles.barcode}>{scannedObject.head.barcode}</Text>
          <Text style={localStyles.itemName} numberOfLines={3}>
            {scannedObject.head.outlet.name}
          </Text>
        </View>
      ) : null,
    [scannedObject],
  );

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  if (!shipmentType) {
    return (
      <View style={globalStyles.container}>
        <View style={globalStyles.containerCenter}>
          <LargeText>Тип документа для отвесов не найден</LargeText>
        </View>
      </View>
    );
  }

  return (
    <>
      {isScanerReader ? (
        <ScanBarcodeReader
          onSave={handleSaveScannedItem}
          onGetScannedObject={handleGetScannedObject}
          onClearScannedObject={handleClearScaner}
          scaner={scaner}
        >
          <ScanItem />
        </ScanBarcodeReader>
      ) : (
        <ScanBarcode
          onSave={handleSaveScannedItem}
          onGetScannedObject={handleGetScannedObject}
          onClearScannedObject={handleClearScaner}
          scaner={scaner}
          barCodeTypes={barCodeTypes}
        >
          <ScanItem />
        </ScanBarcode>
      )}
    </>
  );
};

export default ScanOrderScreen;

const localStyles = StyleSheet.create({
  itemInfo: {
    flexShrink: 1,
    paddingRight: 10,
  },
  itemName: {
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
