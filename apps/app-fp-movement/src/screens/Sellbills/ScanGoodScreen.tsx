import React, { useCallback, useLayoutEffect, useState } from 'react';
import { Text } from 'react-native';

import { useNavigation, RouteProp, useRoute, useIsFocused } from '@react-navigation/native';

import { AppActivityIndicator, globalStyles } from '@lib/mobile-ui';
import { useSelector, refSelectors } from '@lib/store';

import { generateId } from '@lib/mobile-app';

import { StackNavigationProp } from '@react-navigation/stack';

import { SellbillStackParamList } from '../../navigation/Root/types';
import { ISellbillLine, ISellbillDocument } from '../../store/types';

import { IGood } from '../../store/app/types';
import { getBarcode } from '../../utils/helpers';
import { navBackButton } from '../../components/navigateOptions';

import { ScanBarcode, ScanBarcodeReader } from '../../components';

import BarcodeDialog from '../../components/BarcodeDialog';

const ScanGoodScreen = () => {
  const docId = useRoute<RouteProp<SellbillStackParamList, 'ScanGood'>>().params?.docId;
  const tempId = useRoute<RouteProp<SellbillStackParamList, 'ScanGood'>>().params?.tempId;
  const navigation = useNavigation<StackNavigationProp<SellbillStackParamList, 'ScanGood'>>();
  const settings = useSelector((state) => state.settings?.data);

  const isScanerReader = settings.scannerUse?.data;

  const [visibleDialog, setVisibleDialog] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [error, setError] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
    });
  }, [navigation]);

  const handleSaveScannedItem = useCallback(
    (item: ISellbillLine) => {
      navigation.navigate('SellbillLine', {
        mode: 0,
        docId,
        item: item,
        tempId,
      });
    },
    [docId, navigation, tempId],
  );

  const document = useSelector((state) => state.documents.list).find((item) => item.id === docId) as ISellbillDocument;

  const goods = refSelectors.selectByName<IGood>('good').data;

  const getScannedObject = useCallback(
    (brc: string): ISellbillLine | undefined => {
      const barc = getBarcode(brc);

      const good = goods.find((item) => item.shcode === barc.shcode);
      // Находим товар из модели остатков по баркоду, если баркод не найден, то
      //   если выбор из остатков, то undefined,
      //   иначе подставляем unknownGood cо сканированным шк и добавляем в позицию документа
      if (!good) {
        return;
      }

      return {
        good: { id: good.id, name: good.name, shcode: good.shcode },
        id: generateId(),
        weight: barc.weight,
        barcode: barc.barcode,
        workDate: barc.workDate,
        numReceived: barc.numReceived,
        quantPack: barc.quantPack,
      };
    },

    [goods],
  );

  const handleGetBarcode = useCallback(
    (brc: string) => {
      const barc = getBarcode(brc);

      const good = goods.find((item) => item.shcode === barc.shcode);

      if (good) {
        const barcodeItem: ISellbillLine = {
          good: { id: good.id, name: good.name, shcode: good.shcode },
          id: generateId(),
          weight: barc.weight,
          barcode: barc.barcode,
          workDate: barc.workDate,
          numReceived: barc.numReceived,
          quantPack: barc.quantPack,
        };
        setError(false);
        navigation.navigate('SellbillLine', {
          mode: 0,
          docId: docId,
          item: barcodeItem,
          tempId: tempId,
        });
        setVisibleDialog(false);
        setBarcode('');
      } else {
        setError(true);
      }
    },

    [goods, navigation, docId, tempId],
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
    return <Text style={globalStyles.title}>Документ не найден</Text>;
  }

  return (
    <>
      {isScanerReader ? (
        <ScanBarcodeReader
          onSave={(item) => handleSaveScannedItem(item)}
          onSearchBarcode={handleShowDialog}
          getScannedObject={getScannedObject}
        />
      ) : (
        <ScanBarcode
          onSave={(item) => handleSaveScannedItem(item)}
          onSearchBarcode={handleShowDialog}
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

export default ScanGoodScreen;
