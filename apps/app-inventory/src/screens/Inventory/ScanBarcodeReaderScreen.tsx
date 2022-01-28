import React, { useMemo, useCallback, useLayoutEffect } from 'react';
import { v4 as uuid } from 'uuid';

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { INamedEntity, ISettingsOption } from '@lib/types';
import { useSelector, docSelectors } from '@lib/store';

import { BackButton } from '@lib/mobile-ui';

import { useSelector as useAppInventorySelector } from '../../store/index';
import { InventoryStackParamList } from '../../navigation/Root/types';
import { IInventoryLine, IInventoryDocument } from '../../store/types';
import { ScanBarcodeReader } from '../../components/Scanners/ScanBarcodeReader';

export const ScanBarcodeReaderScreen = () => {
  const docId = useRoute<RouteProp<InventoryStackParamList, 'ScanBarcodeReader'>>().params?.docId;
  const navigation = useNavigation();
  const { data: settings } = useSelector((state) => state.settings);
  const weightSettingsWeightCode = (settings.weightCode as ISettingsOption<string>) || '';
  const weightSettingsCountCode = (settings.countCode as ISettingsOption<number>).data || 0;
  const weightSettingsCountWeight = (settings.countWeight as ISettingsOption<number>).data || 0;

  const model = useAppInventorySelector((state) => state.appInventory.model);

  const document = docSelectors
    .selectByDocType<IInventoryDocument>('inventory')
    ?.find((e) => e.id === docId) as IInventoryDocument;

  const goods = useMemo(
    () => (document?.head?.department?.id ? model[document.head.department.id].goods : {}),
    [document?.head?.department?.id, model],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
    });
  }, [navigation]);

  const getScannedObject = (brc: string): IInventoryLine | undefined => {
    let charFrom = 0;
    let charTo = weightSettingsWeightCode.data.length;

    if (brc.substring(charFrom, charTo) !== weightSettingsWeightCode.data) {
      const remItem = goods?.[Object.keys(goods).find((item) => goods[item].barcode === brc) || ''];

      if (!remItem) {
        return;
      }

      const { remains, ...good } = remItem;

      return {
        good: { id: good.id, name: good.name } as INamedEntity,
        id: uuid(),
        quantity: 1,
        price: remains!.length ? remains![0].price : 0,
        remains: remains!.length ? remains![0].q : 0,
        barcode: good.barcode,
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
  };

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

  return (
    <ScanBarcodeReader
      onSave={(item) => handleSaveScannedItem(item)}
      onShowRemains={handleShowRemains}
      getScannedObject={getScannedObject}
    />
  );
};
