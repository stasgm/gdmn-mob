import React, { useCallback, useLayoutEffect, useState } from 'react';
// import { Alert, Text } from 'react-native';

import { useNavigation, useIsFocused, useRoute, RouteProp } from '@react-navigation/native';

// import { globalStyles } from '@lib/mobile-ui';
import { useSelector, refSelectors, docSelectors, documentActions, useDispatch } from '@lib/store';

import { IDocumentType, IReference } from '@lib/types';

import { generateId } from '@lib/mobile-app';

import { StackNavigationProp } from '@react-navigation/stack';

import { AppActivityIndicator } from '@lib/mobile-ui';

import { Alert } from 'react-native';

import { OrderStackParamList } from '../../navigation/Root/types';
import { IOrderDocument, IOtvesDocument, ITempDocument } from '../../store/types';
import { navBackButton } from '../../components/navigateOptions';

import { tempType } from '../../utils/constants';

import { ICodeEntity } from '../../store/app/types';

import BarcodeDialog from '../../components/BarcodeDialog';

import { ScanBarcode } from './components/ScanBarcode';
import { ScanBarcodeReader } from './components/ScanBarcodeReader';

const ScanOrderScreen = () => {
  const docId = useRoute<RouteProp<OrderStackParamList, 'ScanOrder'>>().params?.id;
  console.log('id', docId);
  const navigation = useNavigation<StackNavigationProp<OrderStackParamList, 'ScanOrder'>>();
  const settings = useSelector((state) => state.settings?.data);

  const dispatch = useDispatch();

  const isScanerReader = settings.scannerUse?.data;

  const [visibleDialog, setVisibleDialog] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [error, setError] = useState(false);

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

  // const otvesType = refSelectors
  //   .selectByName<IReference<IDocumentType>>('documentType')
  //   ?.data.find((t) => t.name === 'otves');

  const otvesType = refSelectors
    .selectByName<IReference<IDocumentType>>('documentType')
    ?.data.find((t) => t.name === docId);

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
  const handleGetBarcode = useCallback(
    (brc: string) => {
      // const barc = getBarcode(brc);
      if (!otvesType) {
        return Alert.alert('Внимание!', 'Тип документа для заявок не найден.', [{ text: 'OK' }]);
      }

      const order = orders.find((item) => item.head.barcode === brc);

      if (order) {
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
        const otvesDoc: IOtvesDocument = {
          ...tempDoc,
          id: generateId(),
          documentType: otvesType,
          head: tempDoc.head,
          lines: [],
        };

        if (otvesList.find((i) => i.head.barcode === tempDoc.head.barcode)) {
          // dispatch(documentActions.removeDocument('08b6266e38'));

          return;
        }

        dispatch(documentActions.addDocument(tempDoc));
        dispatch(documentActions.addDocument(otvesDoc));

        navigation.navigate('TempView', {
          id: tempDoc.id,
        });

        setError(false);
        setVisibleDialog(false);
        setBarcode('');
      } else {
        setError(true);
      }
    },

    [depart, dispatch, navigation, orders, otvesList, otvesType],
  );

  const handleShowDialog = () => {
    setVisibleDialog(true);
  };

  const handleDismisDialog = () => {
    setVisibleDialog(false);
  };

  const handleSearchBarcode = () => {
    handleGetBarcode(barcode);
  };

  const handleDismissBarcode = () => {
    setVisibleDialog(false);
    setBarcode('');
    setError(false);
  };

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  return (
    <>
      {isScanerReader ? (
        <ScanBarcodeReader
          onSave={(item) => handleSaveScannedItem(item)}
          onShowRemains={handleShowDialog}
          getScannedObject={getScannedObject}
        />
      ) : (
        <ScanBarcode
          onSave={(item) => handleSaveScannedItem(item)}
          onShowRemains={handleShowDialog}
          getScannedObject={getScannedObject}
        />
      )}
      <BarcodeDialog
        visibleDialog={visibleDialog}
        onDismissDialog={handleDismisDialog}
        barcode={barcode}
        onChangeBarcode={setBarcode}
        onDismiss={handleDismissBarcode}
        onSearch={handleSearchBarcode}
        error={error}
      />
    </>
  );
};

export default ScanOrderScreen;
