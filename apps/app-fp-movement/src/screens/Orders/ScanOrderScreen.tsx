import React, { useCallback, useLayoutEffect } from 'react';
// import { Alert, Text } from 'react-native';

import { useNavigation, useIsFocused } from '@react-navigation/native';

// import { globalStyles } from '@lib/mobile-ui';
import { useSelector, refSelectors, docSelectors, documentActions, useDispatch } from '@lib/store';

import { IDocumentType, IReference } from '@lib/types';

import { generateId } from '@lib/mobile-app';

import { StackNavigationProp } from '@react-navigation/stack';

import { AppActivityIndicator } from '@lib/mobile-ui';

import { OrderStackParamList } from '../../navigation/Root/types';
import { IOrderDocument, IOtvesDocument, ITempDocument } from '../../store/types';
import { navBackButton } from '../../components/navigateOptions';

import { tempType } from '../../utils/constants';

import { ICodeEntity } from '../../store/app/types';

import { ScanBarcode } from './components/ScanBarcode';
import { ScanBarcodeReader } from './components/ScanBarcodeReader';

const ScanOrderScreen = () => {
  // const docId = useRoute<RouteProp<OrderStackParamList, 'ScanOrder'>>().params?.docId;
  const navigation = useNavigation<StackNavigationProp<OrderStackParamList, 'ScanOrder'>>();
  const settings = useSelector((state) => state.settings?.data);

  const dispatch = useDispatch();

  const isScanerReader = settings.scannerUse?.data;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
    });
  }, [navigation]);

  // const document = useSelector((state) => state.documents.list).find((item) => item.id === docId) as IOrderDocument;

  const orders = docSelectors.selectByDocType<IOrderDocument>('order');
  // const tempList = docSelectors.selectByDocType<ITempDocument>('temp');
  const otvesList = docSelectors.selectByDocType<IOtvesDocument>('otves');

  // const tempType = refSelectors
  //   .selectByName<IReference<IDocumentType>>('documentType')
  //   ?.data.find((t) => t.name === 'move');

  const otvesType = refSelectors
    .selectByName<IReference<IDocumentType>>('documentType')
    ?.data.find((t) => t.name === 'otves');

  const handleSaveScannedItem = useCallback(
    (item: ITempDocument) => {
      if (!otvesType) {
        return;
      }
      const otvesDoc: IOtvesDocument = {
        ...item,
        id: generateId(),
        documentType: otvesType,
        head: item.head,
        lines: [],
      };
      console.log('otvesDoc', otvesDoc);

      if (otvesList.find((i) => i.head.barcode === item.head.barcode)) {
        return;
      }

      dispatch(documentActions.addDocument(item));
      dispatch(documentActions.addDocument(otvesDoc));

      navigation.navigate('TempView', {
        id: item.id,
      });
    },
    [otvesType, otvesList, dispatch, navigation],
  );

  const handleShowRemains = useCallback(() => {
    navigation.navigate('SelectRemainsItem');
  }, [navigation]);

  const depart = useSelector((state) => state.auth.user?.settings?.depart?.data) as ICodeEntity;

  const getScannedObject = useCallback(
    (brc: string): ITempDocument | undefined => {
      const order = orders.find((item) => item.head.barcode === brc);

      if (!order) {
        return;
      }

      // if (!tempType) {
      //   return;
      // }

      const tempDoc: ITempDocument = {
        id: generateId(),
        documentType: tempType,
        number: order.number,
        documentDate: new Date().toISOString(),
        status: 'DRAFT',
        head: {
          // comment: order.head.
          barcode: order.head.barcode,
          contact: order.head.contact,
          depart: depart,
          outlet: order.head.outlet,
          onDate: order.head.onDate,
          orderId: order.id,
        },
        lines: order.lines,
        creationDate: new Date().toISOString(),
        editionDate: new Date().toISOString(),
      };

      console.log('tempDoc', tempDoc);

      // dispatch(documentActions.addDocument(tempDoc));
      return tempDoc;
      // navigation.navigate('MovementView', { id });
    },
    [depart, orders],
  );

  // if (!document) {
  //   return <Text style={globalStyles.title}>Документ не найден</Text>;
  // }

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

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
