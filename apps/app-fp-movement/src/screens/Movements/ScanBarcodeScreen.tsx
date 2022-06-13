import React, { useCallback, useLayoutEffect } from 'react';
import { Text } from 'react-native';

import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';

import { globalStyles } from '@lib/mobile-ui';
import { useSelector, refSelectors } from '@lib/store';

import { generateId } from '@lib/mobile-app';

import { StackNavigationProp } from '@react-navigation/stack';

import { MovementStackParamList } from '../../navigation/Root/types';
import { IMovementLine, IMovementDocument } from '../../store/types';
import { ScanBarcode, ScanBarcodeReader } from '../../components';
import { IGood } from '../../store/app/types';
import { getBarcode } from '../../utils/helpers';
import { navBackButton } from '../../components/navigateOptions';

const ScanBarcodeScreen = () => {
  const docId = useRoute<RouteProp<MovementStackParamList, 'ScanBarcode'>>().params?.docId;
  const navigation = useNavigation<StackNavigationProp<MovementStackParamList, 'ScanBarcode'>>();
  const settings = useSelector((state) => state.settings?.data);

  const isScanerReader = settings.scannerUse?.data;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
    });
  }, [navigation]);

  const handleSaveScannedItem = useCallback(
    (item: IMovementLine) => {
      navigation.navigate('MovementLine', {
        mode: 0,
        docId,
        item: item,
      });
    },
    [docId, navigation],
  );

  const handleShowRemains = useCallback(() => {
    navigation.navigate('SelectGoodItem', { docId });
  }, [docId, navigation]);

  const document = useSelector((state) => state.documents.list).find((item) => item.id === docId) as IMovementDocument;

  const goods = refSelectors.selectByName<IGood>('good').data;

  const getScannedObject = useCallback(
    (brc: string): IMovementLine | undefined => {
      const barc = getBarcode(brc);

      const remItem = goods.find((item) => item.shcode === barc.shcode);
      // Находим товар из модели остатков по баркоду, если баркод не найден, то
      //   если выбор из остатков, то undefined,
      //   иначе подставляем unknownGood cо сканированным шк и добавляем в позицию документа
      if (!remItem) {
        return;
      }

      const a = {
        good: { id: remItem.id, name: remItem.name, shcode: remItem.shcode },
        id: generateId(),
        weight: barc.weight,
        barcode: barc.barcode,
        workDate: barc.workDate,
        numReceived: barc.numReceived,
      };
      console.log('a', a);
      console.log('brc', brc);
      return {
        good: { id: remItem.id, name: remItem.name, shcode: remItem.shcode },
        id: generateId(),
        weight: barc.weight,
        barcode: barc.barcode,
        workDate: barc.workDate,
        numReceived: barc.numReceived,
      };
    },

    [goods],
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
