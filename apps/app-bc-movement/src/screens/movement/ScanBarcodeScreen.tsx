import React, { useMemo, useCallback, useLayoutEffect } from 'react';
import { Text, Alert } from 'react-native';
import { v4 as uuid } from 'uuid';

import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';

import { globalStyles, BackButton } from '@lib/mobile-ui';
import { useSelector, docSelectors, useDispatch, documentActions } from '@lib/store';

import { INamedEntity, ISettingsOption } from '@lib/types';

import { useSelector as useAppMovementSelector } from '../../store/index';
import { MovementStackParamList } from '../../navigation/Root/types';
import { IInventoryLine, IInventoryDocument, IBarcode, IMovementDocument } from '../../store/types';
import { ScanBarcode, ScanBarcodeReader } from '../../components';

const ScanBarcodeScreen = () => {
  const dispatch = useDispatch();
  const docId = useRoute<RouteProp<MovementStackParamList, 'ScanBarcode'>>().params?.docId;
  const navigation = useNavigation();
  const settings = useSelector((state) => state.settings?.data);

  const isScanerReader = settings.scannerUse?.data;

  const model = useAppMovementSelector((state) => state.appMovement.model);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
    });
  }, [navigation]);

  const inventory = docSelectors.selectByDocType<IMovementDocument>('inventory')?.find((e) => e.id === docId);

  const barcodes = inventory?.lines;

  console.log('barc', barcodes);

  // const handleSaveScannedItem = useCallback(
  //   (item: IInventoryLine) => {
  //     navigation.navigate('InventoryLine', {
  //       mode: 0,
  //       docId,
  //       item: item,
  //     });
  //   },
  //   [docId, navigation],
  // );

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

  const goods = useMemo(
    () => (document?.head?.department?.id ? model[document.head.department.id].goods : {}),
    [document?.head?.department?.id, model],
  );

  const getScannedObject = useCallback(
    (brc: string): IBarcode | undefined => {
      //     // let charFrom = 0;
      //     // let charTo = weightSettingsWeightCode.data.length;

      //     // if (brc.substring(charFrom, charTo) !== weightSettingsWeightCode.data) {
      //     //   const remItem =
      //     //     goods?.[Object.keys(goods).find((item) => goods[item].barcode === brc || goods[item].id === 'unknown') || ''];
      //     //   // Находим товар из модели остатков по баркоду, если баркод не найден, ищем товар с id равным unknown и добавляем в позицию документа
      //     //   // Если таких товаров нет, то товар не найден

      //     //   if (!remItem) {
      //     //     return;
      //     //   }

      //     //   const { remains, ...good } = remItem;

      //     //   return {
      //     //     good: { id: good.id, name: good.name } as INamedEntity,
      //     //     id: uuid(),
      //     //     quantity: 1,
      //     //     price: remains?.length ? remains[0].price : 0,
      //     //     remains: remains?.length ? remains?.[0].q : 0,
      //     //     barcode: good.id === 'unknown' ? brc : good.barcode,
      //     //   };
      //     // }

      //     // charFrom = charTo;
      //     // charTo = charFrom; // + weightSettingsCountCode;
      //     // const code = Number(brc.substring(charFrom, charTo)).toString();

      //     // charFrom = charTo;
      //     // charTo = charFrom; // + weightSettingsCountWeight;

      //     // const qty = Number(brc.substring(charFrom, charTo)) / 1000;

      //     // const remItem = goods?.[Object.keys(goods).find((item) => goods[item].weightCode === code) || ''];

      //     // if (!remItem) {
      //     //   return;
      //     // }

      //     // const { remains, ...good } = remItem;
      if (barcodes?.find((item) => item.barcode === brc)) {
        Alert.alert('Ошибка!', 'Данный штрихкод уже в документе', [{ text: 'OK' }]);
        return {
          barcode: '1',
          id: uuid(),
        };
      } else {
        console.log('111');
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
