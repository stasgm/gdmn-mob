import React, { useCallback, useLayoutEffect, useState } from 'react';
import { Text } from 'react-native';

import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';

import { globalStyles, BackButton } from '@lib/mobile-ui';
import { useSelector, docSelectors, refSelectors } from '@lib/store';

import { IDepartment, INamedEntity, ISettingsOption } from '@lib/types';

import { generateId } from '@lib/mobile-app';

import { InventoryStackParamList } from '../../navigation/Root/types';
import { IInventoryLine, IInventoryDocument } from '../../store/types';
import { ScanBarcode, ScanBarcodeReader } from '../../components';
import { IGood, IMGoodData, IMGoodRemain, IRemains } from '../../store/app/types';
import { getRemGoodByContact } from '../../utils/helpers';

const ScanBarcodeScreen = () => {
  const docId = useRoute<RouteProp<InventoryStackParamList, 'ScanBarcode'>>().params?.docId;
  const navigation = useNavigation() as any;
  const settings = useSelector((state) => state.settings?.data);

  const weightSettingsWeightCode = (settings.weightCode as ISettingsOption<string>) || '';
  const weightSettingsCountCode = (settings.countCode as ISettingsOption<number>).data || 0;
  const weightSettingsCountWeight = (settings.countWeight as ISettingsOption<number>).data || 0;
  const isScanerReader = settings.scannerUse?.data;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
    });
  }, [navigation]);

  const handleSaveScannedItem = useCallback(
    (item: IInventoryLine) => {
      navigation.navigate('InventoryLine', {
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

  const document = docSelectors.selectByDocId<IInventoryDocument>(docId);

  const goods = refSelectors.selectByName<IGood>('good').data;
  const contacts = refSelectors.selectByName<IDepartment>('department').data;
  const remains = refSelectors.selectByName<IRemains>('remains')?.data[0];

  const [goodRemains] = useState<IMGoodData<IMGoodRemain>>(() =>
    document?.head?.department?.id
      ? getRemGoodByContact(contacts, goods, remains, document?.head?.department.id, true)
      : {},
  );

  const getScannedObject = useCallback(
    (brc: string): IInventoryLine | undefined => {
      let charFrom = 0;
      let charTo = weightSettingsWeightCode.data.length;

      if (brc.substring(charFrom, charTo) !== weightSettingsWeightCode.data) {
        const remItem = goodRemains[brc] || goodRemains.unknown;
        // Находим товар из модели остатков по баркоду, если баркод не найден, ищем товар с id равным unknown и добавляем в позицию документа
        // Если таких товаров нет, то товар не найден

        if (!remItem) {
          return;
        }

        return {
          good: { id: remItem.good.id, name: remItem.good.name } as INamedEntity,
          id: generateId(),
          quantity: 1,
          price: remItem.remains?.length ? remItem.remains[0].price : 0,
          remains: remItem.remains?.length ? remItem.remains?.[0].q : 0,
          barcode: remItem.good.barcode === 'unknown' ? brc : remItem.good.barcode,
        };
      }

      charFrom = charTo;
      charTo = charFrom + weightSettingsCountCode;
      const code = Number(brc.substring(charFrom, charTo)).toString();

      charFrom = charTo;
      charTo = charFrom + weightSettingsCountWeight;

      const qty = Number(brc.substring(charFrom, charTo)) / 1000;

      const remItem = Object.values(goodRemains)?.find((item: IMGoodRemain) => item.good.weightCode === code);

      if (!remItem) {
        return;
      }

      return {
        good: { id: remItem.good.id, name: remItem.good.name } as INamedEntity,
        id: generateId(),
        quantity: qty,
        price: remItem.remains?.length ? remItem.remains[0].price : 0,
        remains: remItem.remains?.length ? remItem.remains?.[0].q : 0,
        barcode: remItem.good.barcode,
      };
    },
    [goodRemains, weightSettingsCountCode, weightSettingsCountWeight, weightSettingsWeightCode.data],
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
