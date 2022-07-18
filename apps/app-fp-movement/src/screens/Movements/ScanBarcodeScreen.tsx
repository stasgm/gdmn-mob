import React, { useCallback, useLayoutEffect, useState } from 'react';
import { View } from 'react-native';

import { useNavigation, RouteProp, useRoute, useIsFocused } from '@react-navigation/native';

import { AppActivityIndicator, globalStyles, SubTitle } from '@lib/mobile-ui';
import { useSelector, refSelectors, useDispatch, documentActions } from '@lib/store';

import { generateId } from '@lib/mobile-app';

import { StackNavigationProp } from '@react-navigation/stack';

import { MoveStackParamList } from '../../navigation/Root/types';
import { IMoveDocument } from '../../store/types';

import { IGood } from '../../store/app/types';
import { getBarcode } from '../../utils/helpers';
import { navBackButton } from '../../components/navigateOptions';

import { ScanBarcode, ScanBarcodeReader } from '../../components';

import BarcodeDialog from '../../components/BarcodeDialog';
import { IScanerObject } from '../../components/ScanBarcode/ScanBarcode';

import MoveTotal from './components/MoveTotal';

const ScanBarcodeScreen = () => {
  const docId = useRoute<RouteProp<MoveStackParamList, 'ScanBarcode'>>().params?.docId;
  const navigation = useNavigation<StackNavigationProp<MoveStackParamList, 'ScanBarcode'>>();
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

  const document = useSelector((state) => state.documents.list).find((item) => item.id === docId) as IMoveDocument;

  const goods = refSelectors.selectByName<IGood>('good').data;

  const [scanObject, setScanObject] = useState<IScanerObject>({ item: undefined, state: 'scan', barcode: '' });

  const getScannedObject = useCallback(
    (brc: string) => {
      if (!brc.match(/^-{0,1}\d+$/)) {
        return;
      }
      const barc = getBarcode(brc);

      const good = goods.find((item) => item.shcode === brc);

      if (!good) {
        setScanObject({ item: undefined, state: 'notFound', barcode: brc });
        return;
      }

      const line = document.lines.find((i) => i.barcode === barc.barcode);

      if (line) {
        setScanObject({ item: line, state: 'added', barcode: brc });
        return;
      }

      const newLine = {
        good: { id: good.id, name: good.name, shcode: good.shcode },
        id: generateId(),
        weight: barc.weight,
        barcode: barc.barcode,
        workDate: barc.workDate,
        numReceived: barc.numReceived,
      };

      dispatch(documentActions.addDocumentLine({ docId, line: newLine }));

      setScanObject({ item: newLine, state: 'scan', barcode: brc });
    },

    [dispatch, docId, document.lines, goods],
  );

  const handleClearScan = () => setScanObject({ item: undefined, state: 'scan', barcode: '' });

  const handleGetBarcode = useCallback(
    (brc: string) => {
      const barc = getBarcode(brc);

      const good = goods.find((item) => item.shcode === barc.shcode);

      if (good) {
        const barcodeItem = {
          good: { id: good.id, name: good.name, shcode: good.shcode },
          id: generateId(),
          weight: barc.weight,
          barcode: barc.barcode,
          workDate: barc.workDate,
          numReceived: barc.numReceived,
        };
        setError(false);
        navigation.navigate('MoveLine', {
          mode: 0,
          docId: docId,
          item: barcodeItem,
        });
        setVisibleDialog(false);
        setBarcode('');
      } else {
        setError(true);
      }
    },

    [goods, docId, navigation],
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

  if (!document) {
    return (
      <View style={globalStyles.container}>
        <SubTitle style={globalStyles.title}>Документ не найден</SubTitle>
      </View>
    );
  }

  return (
    <>
      {isScanerReader ? (
        <ScanBarcodeReader
          // onSave={(item) => handleSaveScannedItem(item)}
          onSearchBarcode={handleShowDialog}
          getScannedObject={getScannedObject}
          lines={document.lines}
        />
      ) : (
        <ScanBarcode
          onSearchBarcode={handleShowDialog}
          getScannedObject={getScannedObject}
          // lines={document.lines}
          scanObject={scanObject}
          clearScan={handleClearScan}
        />
      )}
      {document.lines?.length ? <MoveTotal lines={document.lines} scan={true} /> : null}
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

export default ScanBarcodeScreen;
