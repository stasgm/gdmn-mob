import React, { useMemo, useCallback, useLayoutEffect } from 'react';
import { Text } from 'react-native';
import { v4 as uuid } from 'uuid';

import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';

import { globalStyles, BackButton } from '@lib/mobile-ui';
import { useSelector, docSelectors } from '@lib/store';

import { INamedEntity, ISettingsOption } from '@lib/types';

import { useSelector as useAppInventorySelector } from '../../store/index';
import { DocStackParamList, InventoryStackParamList } from '../../navigation/Root/types';
import { IInventoryLine, IInventoryDocument, IDocDocument, IDocLine } from '../../store/types';
import { ScanBarcode, ScanBarcodeReader } from '../../components';

const ScanBarcodeScreen = () => {
  const docId = useRoute<RouteProp<DocStackParamList, 'ScanBarcode'>>().params?.docId;
  const navigation = useNavigation();
  const settings = useSelector((state) => state.settings?.data);

  const weightSettingsWeightCode = (settings.weightCode as ISettingsOption<string>) || '';
  const weightSettingsCountCode = (settings.countCode as ISettingsOption<number>).data || 0;
  const weightSettingsCountWeight = (settings.countWeight as ISettingsOption<number>).data || 0;
  const isScanerReader = settings.scannerUse?.data;

  const model = useAppInventorySelector((state) => state.appInventory.model);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
    });
  }, [navigation]);

  const handleSaveScannedItem = useCallback(
    (item: IDocLine) => {
      navigation.navigate('DocLine', {
        mode: 0,
        docId,
        item: item,
      });
    },
    [docId, navigation],
  );

  const handleShowRemains = useCallback(() => {
    navigation.navigate('SelectRemainsItem', { docId });
  }, [docId, navigation]);

  const document = useSelector((state) => state.documents.list).find((e) => e.id === docId) as IDocDocument | undefined;
  // const document = docSelectors
  //   .selectByDocType<IInventoryDocument>('inventory')
  //   ?.find((e) => e.id === docId) as IDocDocument;

  console.log('documents', document);
  const goods = useMemo(
    () => (document?.head?.toDepartment?.id ? model[document.head.toDepartment.id].goods : {}),
    [document?.head?.toDepartment?.id, model],
  );

  const getScannedObject = useCallback(
    (brc: string): IDocLine | undefined => {
      let charFrom = 0;
      let charTo = weightSettingsWeightCode.data.length;

      if (brc.substring(charFrom, charTo) !== weightSettingsWeightCode.data) {
        const remItem =
          goods?.[Object.keys(goods).find((item) => goods[item].barcode === brc || goods[item].id === 'unknown') || ''];
        // Находим товар из модели остатков по баркоду, если баркод не найден, ищем товар с id равным unknown и добавляем в позицию документа
        // Если таких товаров нет, то товар не найден

        if (!remItem) {
          return;
        }

        const { remains, ...good } = remItem;

        return {
          good: { id: good.id, name: good.name } as INamedEntity,
          id: uuid(),
          quantity: 1,
          price: remains?.length ? remains[0].price : 0,
          remains: remains?.length ? remains?.[0].q : 0,
          barcode: good.id === 'unknown' ? brc : good.barcode,
        };
      }

      charFrom = charTo;
      charTo = charFrom + weightSettingsCountCode;
      const code = Number(brc.substring(charFrom, charTo)).toString();

      charFrom = charTo;
      charTo = charFrom + weightSettingsCountWeight;

      const qty = Number(brc.substring(charFrom, charTo)) / 1000;

      const remItem = goods?.[Object.keys(goods).find((item) => goods[item].weightCode === code) || ''];

      if (!remItem) {
        return;
      }

      const { remains, ...good } = remItem;

      return {
        good: { id: good.id, name: good.name } as INamedEntity,
        id: uuid(),
        quantity: qty,
        price: remains?.length ? remains[0].price : 0,
        remains: remains?.length ? remains?.[0].q : 0,
        barcode: good.barcode,
      };
    },
    [goods, weightSettingsCountCode, weightSettingsCountWeight, weightSettingsWeightCode.data],
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
