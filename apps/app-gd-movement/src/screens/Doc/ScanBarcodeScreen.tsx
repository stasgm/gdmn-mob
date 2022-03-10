import React, { useMemo, useCallback, useLayoutEffect } from 'react';
import { Text } from 'react-native';
import { v4 as uuid } from 'uuid';

import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';

import { globalStyles, BackButton } from '@lib/mobile-ui';
import { refSelectors, useSelector } from '@lib/store';

import { IDepartment, INamedEntity, ISettingsOption } from '@lib/types';

import { DocStackParamList } from '../../navigation/Root/types';
import { IDocDocument, IDocLine } from '../../store/types';
import { ScanBarcode, ScanBarcodeReader } from '../../components';
import { IGood, IMGoodData, IMGoodRemain, IRemainsNew } from '../../store/app/types';
import { getRemGoodByContact } from '../../utils/helpers';

const ScanBarcodeScreen = () => {
  const docId = useRoute<RouteProp<DocStackParamList, 'ScanBarcode'>>().params?.docId;
  const navigation = useNavigation();
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

  const goodss = refSelectors.selectByName<IGood>('good').data;
  const contacts = refSelectors.selectByName<IDepartment>(document?.head?.fromContactType?.id || 'department').data;
  const remains = refSelectors.selectByName<IRemainsNew>('remain').data;

  const goods: IMGoodData<IMGoodRemain> = useMemo(() => {
    if (!document?.head?.fromContact) {
      return {};
    }

    const goodRem: IMGoodData<IMGoodRemain> = getRemGoodByContact(
      contacts,
      goodss,
      remains,
      document.head.fromContact?.id,
    );

    return goodRem;
  }, [document?.head?.fromContact, contacts, goodss, remains]);

  const getScannedObject = useCallback(
    (brc: string): IDocLine | undefined => {
      let charFrom = 0;
      let charTo = weightSettingsWeightCode.data.length;

      if (brc.substring(charFrom, charTo) !== weightSettingsWeightCode.data) {
        const remItem = goods[brc] || goods.unknown;
        // Находим товар из модели остатков по баркоду, если баркод не найден, ищем товар с id равным unknown и добавляем в позицию документа
        // Если таких товаров нет, то товар не найден

        if (!remItem) {
          return;
        }

        return {
          good: { id: remItem.good.id, name: remItem.good.name } as INamedEntity,
          id: uuid(),
          quantity: 1,
          price: remItem.remains?.length ? remItem.remains[0].price : 0,
          buyingPrice: remItem.remains?.length ? remItem.remains[0].buyingPrice : 0,
          remains: remItem.remains?.length ? remItem.remains?.[0].q : 0,
          barcode: remItem.good.id === 'unknown' ? brc : remItem.good.barcode,
        };
      }

      charFrom = charTo;
      charTo = charFrom + weightSettingsCountCode;
      const code = Number(brc.substring(charFrom, charTo)).toString();

      charFrom = charTo;
      charTo = charFrom + weightSettingsCountWeight;

      const qty = Number(brc.substring(charFrom, charTo)) / 1000;

      const remItem = Object.values(goods)?.find((item: IMGoodRemain) => item.good.weightCode === code);

      if (!remItem) {
        return;
      }

      return {
        good: { id: remItem.good.id, name: remItem.good.name } as INamedEntity,
        id: uuid(),
        quantity: qty,
        price: remItem.remains?.length ? remItem.remains[0].price : 0,
        buyingPrice: remItem.remains?.length ? remItem.remains[0].buyingPrice : 0,
        remains: remItem.remains?.length ? remItem.remains?.[0].q : 0,
        barcode: remItem.good.barcode,
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
