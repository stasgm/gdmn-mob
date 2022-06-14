import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { Text } from 'react-native';

import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';

import { globalStyles } from '@lib/mobile-ui';
import { useSelector, refSelectors, docSelectors, documentActions, useDispatch } from '@lib/store';

import { IDocumentType, INamedEntity, IReference, ISettingsOption } from '@lib/types';

import { generateId } from '@lib/mobile-app';

import { StackNavigationProp } from '@react-navigation/stack';

import { OrderStackParamList } from '../../navigation/Root/types';
import { IMovementLine, IOrderDocument, IOrderLine, IOtvesDocument, ITempDocument } from '../../store/types';
import { IGood } from '../../store/app/types';
import { getNextDocNumber } from '../../utils/helpers';
import { unknownGood } from '../../utils/constants';
import { navBackButton } from '../../components/navigateOptions';

import { ScanBarcode } from './components/ScanBarcode';
import { ScanBarcodeReader } from './components/ScanBarcodeReader';

const ScanOrderScreen = () => {
  const docId = useRoute<RouteProp<OrderStackParamList, 'ScanOrder'>>().params?.docId;
  const navigation = useNavigation<StackNavigationProp<OrderStackParamList, 'ScanOrder'>>();
  const settings = useSelector((state) => state.settings?.data);

  const dispatch = useDispatch();

  const isScanerReader = settings.scannerUse?.data;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
    });
  }, [navigation]);

  const document = useSelector((state) => state.documents.list).find((item) => item.id === docId) as IOrderDocument;

  const orders = docSelectors.selectByDocType<IOrderDocument>('order');
  const temps = docSelectors.selectByDocType<ITempDocument>('temp');
  const otvess = docSelectors.selectByDocType<IOtvesDocument>('otves');

  console.log('orders', orders);

  const goods = refSelectors.selectByName<IGood>('good').data;

  const tempType = refSelectors
    .selectByName<IReference<IDocumentType>>('documentType')
    ?.data.find((t) => t.name === 'temp');

  const otvesType = refSelectors
    .selectByName<IReference<IDocumentType>>('documentType')
    ?.data.find((t) => t.name === 'otves');

  const handleSaveScannedItem = useCallback(
    (item: ITempDocument) => {
      const otvesDoc: IOtvesDocument = {
        ...item,
        documentType: otvesType,
        lines: [],
      };
      navigation.navigate('OrderView', {
        id: item.id,
      });
      dispatch(documentActions.addDocument(item));
      dispatch(documentActions.addDocument(otvesDoc));
    },
    [otvesType, navigation, dispatch],
  );

  const handleShowRemains = useCallback(() => {
    navigation.navigate('SelectRemainsItem', { docId });
  }, [docId, navigation]);

  const getScannedObject = useCallback(
    (brc: string): ITempDocument | undefined => {
      console.log('brc', brc);
      const order = orders.find((item) => item.head.barcode === brc);

      if (!order) {
        return;
      }

      const tempDoc: ITempDocument = {
        id: generateId(),
        documentType: tempType,
        number: getNextDocNumber(temps),
        documentDate: new Date().toISOString(),
        status: 'DRAFT',
        head: {
          // comment: order.head.
          barcode: order.head.barcode,
          contact: order.head.contact,
          //  depart: ,
          outlet: order.head.outlet,
        },
        lines: order.lines,
        creationDate: new Date().toISOString(),
        editionDate: new Date().toISOString(),
      };

      // dispatch(documentActions.addDocument(tempDoc));
      return tempDoc;
      // navigation.navigate('MovementView', { id });
    },
    [dispatch, orders, tempType, temps],
  );

  // if (!document) {
  //   return <Text style={globalStyles.title}>Документ не найден</Text>;
  // }

  return isScanerReader ? (
    <ScanBarcodeReader
      onSave={(item) => handleSaveScannedItem(item)}
      onShowRemains={handleShowRemains}
      getScannedObject={getScannedObject}
    />
  ) : (
    <ScanBarcode
      onSave={(item) => handleSaveScannedItem(item)}
      onShowRemains={handleShowRemains}
      getScannedObject={getScannedObject}
    />
  );
};

export default ScanOrderScreen;
