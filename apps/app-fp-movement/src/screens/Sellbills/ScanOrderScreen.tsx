import React, { useCallback, useLayoutEffect, useState } from 'react';

import { useNavigation, useIsFocused, useRoute, RouteProp } from '@react-navigation/native';

import { useSelector, refSelectors, docSelectors, documentActions, useDispatch } from '@lib/store';

import { IDocumentType, IReference } from '@lib/types';

import { generateId } from '@lib/mobile-app';

import { StackNavigationProp } from '@react-navigation/stack';

import { AppActivityIndicator } from '@lib/mobile-ui';

import { Alert } from 'react-native';

import { SellbillStackParamList } from '../../navigation/Root/types';
import { IOrderDocument, ISellbillDocument, ITempDocument } from '../../store/types';
import { navBackButton } from '../../components/navigateOptions';

import { tempType } from '../../utils/constants';

import { ICodeEntity, IOrder } from '../../store/app/types';

import BarcodeDialog from '../../components/BarcodeDialog';

import { actions as orderActions } from '../../store/app/actions';

import { ScanBarcode } from './components/ScanBarcode';
import { ScanBarcodeReader } from './components/ScanBarcodeReader';

const ScanOrderScreen = () => {
  const docTypeId = useRoute<RouteProp<SellbillStackParamList, 'ScanOrder'>>().params?.id;

  const navigation = useNavigation<StackNavigationProp<SellbillStackParamList, 'ScanOrder'>>();
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

  const orders = docSelectors.selectByDocType<IOrderDocument>('order');

  const sellbills = docSelectors.selectByDocType<ISellbillDocument>('otves');

  const sellbillType = refSelectors
    .selectByName<IReference<IDocumentType>>('documentType')
    ?.data.find((t) => t.name === docTypeId);

  const handleSaveScannedItem = useCallback(
    (item: ISellbillDocument) => {
      if (!sellbillType) {
        return;
      }
      const sellbillDoc: ISellbillDocument = {
        ...item,
        lines: [],
      };
      console.log('otvesDoc', sellbillDoc);

      const order = orders.find((i) => i.id === item.head.orderId)!;

      const newOrder: IOrder = {
        id: order.id,
        lines: order.lines,
      };

      dispatch(orderActions.addOrder(newOrder));

      if (sellbills.find((i) => i.head.barcode === item.head.barcode)) {
        return;
      }

      dispatch(documentActions.addDocument(sellbillDoc));

      navigation.navigate('SellbillView', {
        id: item.id,
      });
    },
    [sellbillType, orders, dispatch, sellbills, navigation],
  );

  const depart = useSelector((state) => state.auth.user?.settings?.depart?.data) as ICodeEntity;

  const getScannedObject = useCallback(
    (brc: string): ISellbillDocument | undefined => {
      const order = orders.find((item) => item.head.barcode === brc);

      if (!order) {
        return;
      }

      if (!sellbillType) {
        return;
      }

      const sellbillDoc: ISellbillDocument = {
        id: generateId(),
        documentType: sellbillType,
        number: order.number,
        documentDate: new Date().toISOString(),
        status: 'DRAFT',
        head: {
          barcode: order.head.barcode,
          contact: order.head.contact,
          depart: depart,
          outlet: order.head.outlet,
          onDate: order.head.onDate,
          orderId: order.id,
        },
        lines: [],
        creationDate: new Date().toISOString(),
        editionDate: new Date().toISOString(),
      };

      return sellbillDoc;
    },
    [depart, orders, sellbillType],
  );

  const handleGetBarcode = useCallback(
    (brc: string) => {
      if (!sellbillType) {
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
        const otvesDoc: ISellbillDocument = {
          ...tempDoc,
          id: generateId(),
          documentType: sellbillType,
          head: tempDoc.head,
          lines: [],
        };

        if (sellbills.find((i) => i.head.barcode === tempDoc.head.barcode)) {
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

    [depart, dispatch, navigation, orders, sellbillType, sellbills],
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
