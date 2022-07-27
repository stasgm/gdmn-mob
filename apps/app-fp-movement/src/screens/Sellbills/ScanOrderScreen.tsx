import React, { useCallback, useLayoutEffect, useState } from 'react';

import { useNavigation, useIsFocused, useRoute, RouteProp, StackActions } from '@react-navigation/native';

import { useSelector, refSelectors, docSelectors, documentActions, useDispatch } from '@lib/store';

import { IDocumentType } from '@lib/types';

import { generateId } from '@lib/mobile-app';

import { StackNavigationProp } from '@react-navigation/stack';

import { AppActivityIndicator, AppDialog, globalStyles, LargeText } from '@lib/mobile-ui';

import { View, Text } from 'react-native';

import { SellbillStackParamList } from '../../navigation/Root/types';
import { IOrderDocument, ISellbillDocument, ITempDocument } from '../../store/types';
import { navBackButton } from '../../components/navigateOptions';

import { ICodeEntity } from '../../store/app/types';

import { actions as fpActions } from '../../store/app/actions';
import { useSelector as useFpSelector } from '../../store/index';

import { ScanBarcode } from './components/ScanBarcode';
import { ScanBarcodeReader } from './components/ScanBarcodeReader';
import styles from './components/ScanBarcode/styles';

const ScanOrderScreen = () => {
  const docTypeId = useRoute<RouteProp<SellbillStackParamList, 'ScanOrder'>>().params?.id;

  const navigation = useNavigation<StackNavigationProp<SellbillStackParamList, 'ScanOrder'>>();
  const settings = useSelector((state) => state.settings?.data);

  const dispatch = useDispatch();

  const isScanerReader = settings.scannerUse?.data;

  const [visibleDialog, setVisibleDialog] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
    });
  }, [navigation]);

  const orders = docSelectors.selectByDocType<IOrderDocument>('order');

  const shipments = docSelectors.selectByDocType<ISellbillDocument>('shipment');

  const shipmentType = refSelectors.selectByName<IDocumentType>('documentType')?.data.find((t) => t.name === docTypeId);

  const depart = useSelector((state) => state.auth.user?.settings?.depart?.data) as ICodeEntity;

  const tempOrders = useFpSelector((state) => state.fpMovement.list);

  const [scannedObject, setScannedObject] = useState<IOrderDocument>();

  const handleSaveScannedItem = useCallback(
    (item: IOrderDocument) => {
      const shipment = shipments.find((i) => i.head.orderId === item.id);

      if (shipment) {
        navigation.dispatch(
          StackActions.replace('SellbillView', {
            id: shipment.id,
          }),
        );
        return;
      }

      const tempOrder = tempOrders.find((i) => i.orderId === item.head.orderId);
      if (!tempOrder) {
        const newTempOrder: ITempDocument = {
          id: generateId(),
          orderId: item.id,
          lines: item.lines,
        };

        dispatch(fpActions.addTempOrder(newTempOrder));
      }

      const sellbillDoc: ISellbillDocument = {
        id: generateId(),
        documentType: shipmentType!,
        number: item.number,
        documentDate: new Date().toISOString(),
        status: 'DRAFT',
        head: {
          barcode: item.head.barcode,
          contact: item.head.contact,
          depart: depart,
          outlet: item.head.outlet,
          onDate: item.head.onDate,
          orderId: item.id,
        },
        lines: [],
        creationDate: new Date().toISOString(),
        editionDate: new Date().toISOString(),
      };

      dispatch(documentActions.addDocument(sellbillDoc));

      navigation.dispatch(
        StackActions.replace('SellbillView', {
          id: sellbillDoc.id,
        }),
      );
    },
    [shipments, tempOrders, dispatch, shipmentType, depart, navigation],
  );

  const getScannedObject = useCallback(
    (brc: string) => {
      setErrorMessage('');
      if (!brc.match(/^-{0,1}\d+$/)) {
        if (!visibleDialog) {
          setScannedObject(undefined);
        }
        setErrorMessage('Штрих-код неверного формата');
        return;
      }

      const order = orders.find((item) => item.head.barcode === brc);
      if (order) {
        const shipment = shipments.find((i) => i.head.orderId === order.id);

        if (shipment) {
          navigation.dispatch(
            StackActions.replace('SellbillView', {
              id: shipment.id,
            }),
          );
        } else {
          setScannedObject(order);
        }
      } else {
        setErrorMessage('Заявка не найдена');
        return;
      }

      if (visibleDialog) {
        setVisibleDialog(false);
      }
    },
    [navigation, orders, shipments, visibleDialog],
  );

  const handleShowDialog = () => {
    setVisibleDialog(true);
    setBarcode('');
    setScannedObject(undefined);
  };

  const handleHideDialog = () => {
    setVisibleDialog(false);
    setBarcode('');
    setScannedObject(undefined);
    setErrorMessage('');
  };

  const ScanItem = useCallback(
    () => (
      <View style={styles.itemInfo}>
        <Text style={styles.barcode}>{scannedObject?.head.barcode}</Text>
        <Text style={[styles.itemName]} numberOfLines={3}>
          {scannedObject?.head.outlet.name}
        </Text>
      </View>
    ),
    [scannedObject?.head.barcode, scannedObject?.head.outlet.name],
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
          onSave={(item) => handleSaveScannedItem(item)}
          onShowSearchDialog={handleShowDialog}
          getScannedObject={getScannedObject}
          scannedObject={scannedObject}
          errorMessage={!visibleDialog ? errorMessage : ''}
        >
          <ScanItem />
        </ScanBarcodeReader>
      ) : (
        <ScanBarcode
          onSave={(item) => handleSaveScannedItem(item)}
          onShowSearchDialog={handleShowDialog}
          getScannedObject={getScannedObject}
          scannedObject={scannedObject}
          errorMessage={!visibleDialog ? errorMessage : ''}
        >
          <ScanItem />
        </ScanBarcode>
      )}
      <AppDialog
        visible={visibleDialog}
        text={barcode}
        onChangeText={setBarcode}
        onCancel={handleHideDialog}
        onOk={() => getScannedObject(barcode)}
        okLabel={'Найти'}
        errorMessage={errorMessage}
      />
    </>
  );
};

export default ScanOrderScreen;
