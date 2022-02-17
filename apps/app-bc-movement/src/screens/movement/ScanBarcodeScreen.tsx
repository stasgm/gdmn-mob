import React, { useCallback, useLayoutEffect } from 'react';
import { Text } from 'react-native';
import { v4 as uuid } from 'uuid';

import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';

import { globalStyles, BackButton } from '@lib/mobile-ui';
import { useSelector, docSelectors, useDispatch, documentActions } from '@lib/store';

import { MovementStackParamList } from '../../navigation/Root/types';
import { IInventoryDocument, IBarcode, IMovementDocument } from '../../store/types';
import { ScanBarcode, ScanBarcodeReader } from '../../components';

const ScanBarcodeScreen = () => {
  const dispatch = useDispatch();
  const docId = useRoute<RouteProp<MovementStackParamList, 'ScanBarcode'>>().params?.docId;
  const navigation = useNavigation();
  const settings = useSelector((state) => state.settings?.data);

  const isScanerReader = settings.scannerUse?.data;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
    });
  }, [navigation]);

  const inventory = docSelectors.selectByDocType<IMovementDocument>('inventory')?.find((e) => e.id === docId);

  const barcodes = inventory?.lines;

  const handleSaveScannedItem = useCallback(
    (line: IBarcode) => {
      // const barcode = item;
      dispatch(documentActions.addDocumentLine({ docId, line }));
      console.log('line', line);
    },
    [dispatch, docId],
  );

  const handleShowRemains = useCallback(() => {
    navigation.navigate('ScanBarcode', { docId });
  }, [docId, navigation]);

  const document = docSelectors
    .selectByDocType<IInventoryDocument>('inventory')
    ?.find((e) => e.id === docId) as IInventoryDocument;

  const getScannedObject = useCallback(
    (brc: string): IBarcode | undefined => {
      if (barcodes?.find((item) => item.barcode === brc)) {
        return {
          barcode: '-1',
          id: uuid(),
        };
      } else {
        return {
          barcode: brc,
          id: uuid(),
        };
      }
    },
    [barcodes],
  );

  if (!document) {
    return <Text style={globalStyles.title}>Документ не найден</Text>;
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

export default ScanBarcodeScreen;
