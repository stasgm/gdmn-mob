import React, { useCallback, useLayoutEffect } from 'react';
import { Text } from 'react-native';
import { v4 as uuid } from 'uuid';

import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';

import { globalStyles, BackButton } from '@lib/mobile-ui';
import { useSelector, docSelectors, useDispatch, documentActions } from '@lib/store';

import { MovementStackParamList } from '../../navigation/Root/types';
import { IMovementLine, IMovementDocument } from '../../store/types';
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

  const bcMovement = docSelectors.selectByDocType<IMovementDocument>('bcMovement')?.find((e) => e.id === docId);

  const barcodes = bcMovement?.lines;

  const handleSaveScannedItem = useCallback(
    (line: IMovementLine) => {
      dispatch(documentActions.addDocumentLine({ docId, line }));
    },
    [dispatch, docId],
  );

  const document = docSelectors
    .selectByDocType<IMovementDocument>('bcMovement')
    ?.find((e) => e.id === docId) as IMovementDocument;

  const getScannedObject = useCallback(
    (brc: string): IMovementLine | undefined => {
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
    <ScanBarcodeReader onSave={(item) => handleSaveScannedItem(item)} getScannedObject={getScannedObject} />
  ) : (
    <ScanBarcode onSave={(item) => handleSaveScannedItem(item)} getScannedObject={getScannedObject} />
  );
};

export default ScanBarcodeScreen;
