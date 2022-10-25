import React, { useCallback, useLayoutEffect } from 'react';
import { Text } from 'react-native';

import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';

import { globalStyles, navBackButton } from '@lib/mobile-ui';
import { useSelector, docSelectors, useDispatch, documentActions } from '@lib/store';

import { generateId } from '@lib/mobile-hooks';

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
      headerLeft: navBackButton,
    });
  }, [navigation]);

  const document = docSelectors.selectByDocId<IMovementDocument>(docId);

  const barcodes = document?.lines;

  const handleSaveScannedItem = useCallback(
    (line: IMovementLine) => {
      dispatch(documentActions.addDocumentLine({ docId, line }));
    },
    [dispatch, docId],
  );

  const getScannedObject = useCallback(
    (barcode: string): IMovementLine | undefined => {
      const id = generateId();
      if (barcodes?.find((item) => item.barcode === barcode)) {
        return {
          barcode: '-1',
          id,
        };
      } else {
        return {
          barcode,
          id,
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
