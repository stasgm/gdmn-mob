import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { View } from 'react-native';

import { useNavigation, RouteProp, useRoute, useIsFocused } from '@react-navigation/native';

import { AppActivityIndicator, globalStyles, LargeText, navBackButton, ScanBarcode } from '@lib/mobile-ui';
import { useSelector, refSelectors } from '@lib/store';

import { IDocumentType, ISettingsOption } from '@lib/types';

import { generateId } from '@lib/mobile-hooks';

import { StackNavigationProp } from '@react-navigation/stack';

import { IScannedObject } from '@lib/client-types';

import { DocStackParamList } from '../../navigation/Root/types';
import { IMovementLine, IMovementDocument } from '../../store/types';
import { IGood, IMGoodData, IMGoodRemain, IRemains } from '../../store/app/types';
import { getBrc, getRemGoodByContact } from '../../utils/helpers';
import { IBarcodeTypes, unknownGood } from '../../utils/constants';
import { useSelector as useInvSelector } from '../../store';

const ScanBarcodeScreen = () => {
  const docId = useRoute<RouteProp<DocStackParamList, 'ScanBarcode'>>().params?.docId;
  const navigation = useNavigation<StackNavigationProp<DocStackParamList, 'ScanBarcode'>>();
  const settings = useSelector((state) => state.settings?.data);

  const showZeroRemains = settings?.showZeroRemains?.data;
  const isInputQuantity = settings?.quantityInput?.data;

  const prefixGtin = (settings.prefixGtin as ISettingsOption<string>)?.data || '';
  const weightSettingsWeightCode = (settings.weightCode as ISettingsOption<string>) || '';
  const weightSettingsCountCode = (settings.countCode as ISettingsOption<number>)?.data || 0;
  const weightSettingsCountWeight = (settings.countWeight as ISettingsOption<number>)?.data || 0;
  const barcodeTypes =
    (settings.barcodeTypes as ISettingsOption<Array<IBarcodeTypes>>)?.data
      ?.filter((t) => t.selected)
      .map((t) => t.type) || [];

  const unknownGoods = useInvSelector((state) => state.appInventory.unknownGoods);

  const [scaner, setScaner] = useState<IScannedObject>({ state: 'init' });
  const handleClearScaner = () => setScaner({ state: 'init' });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
    });
  }, [navigation]);

  const handleShowRemains = useCallback(() => {
    navigation.navigate('SelectRemainsItem', { docId });
  }, [docId, navigation]);

  const document = useSelector((state) => state.documents.list).find((item) => item.id === docId) as IMovementDocument;

  const goods = refSelectors.selectByName<IGood>('good')?.data;
  const remains = refSelectors.selectByName<IRemains>('remains')?.data[0];

  const documentTypes = refSelectors.selectByName<IDocumentType>('documentType')?.data;
  const documentType = useMemo(
    () => documentTypes?.find((d) => d.id === document?.documentType.id),
    [document?.documentType.id, documentTypes],
  );

  const contactId = useMemo(
    () =>
      documentType?.remainsField === 'fromContact' ? document?.head?.fromContact?.id : document?.head?.toContact?.id,
    [document?.head?.fromContact?.id, document?.head?.toContact?.id, documentType?.remainsField],
  );

  const noZeroRemains = useMemo(
    () => !!documentType?.isControlRemains && !showZeroRemains && !!documentType?.isRemains,
    [documentType?.isControlRemains, documentType?.isRemains, showZeroRemains],
  );

  const goodRemains = useMemo<IMGoodData<IMGoodRemain>>(
    () =>
      contactId
        ? getRemGoodByContact(
            goods.concat(unknownGoods.map((item) => item.good)),
            remains[contactId],
            documentType?.isRemains,
            noZeroRemains,
          )
        : {},
    [contactId, documentType?.isRemains, goods, noZeroRemains, remains, unknownGoods],
  );

  const getScannedObject = useCallback(
    (brc: string, typeOk = true) => {
      if (!brc) {
        return;
      }

      if (!typeOk) {
        setScaner({
          state: 'error',
          message: 'Неверный тип штрихкода',
        });
        return;
      }

      let charFrom = 0;
      let charTo = weightSettingsWeightCode.data.length;

      if (brc.slice(0, 2) === prefixGtin || brc.substring(charFrom, charTo) !== weightSettingsWeightCode.data) {
        const remItem =
          getBrc(brc, prefixGtin, goodRemains) ||
          (documentType?.isRemains ? undefined : { good: { ...unknownGood, barcode: brc } });

        // Находим товар из модели остатков по баркоду, если баркод не найден, то
        //   если выбор из остатков, то undefined,
        //   иначе подставляем unknownGood cо сканированным шк и добавляем в позицию документа

        if (!remItem) {
          setScaner({ state: 'error', message: 'Товар не найден' });
          return;
        }
        const scannedObject: IMovementLine = {
          good: { id: remItem.good.id, name: remItem.good.name },
          id: generateId(),
          quantity: isInputQuantity ? 1 : 0,
          price: remItem.remains?.length ? remItem.remains[0].price : 0,
          buyingPrice: remItem.remains?.length ? remItem.remains[0].buyingPrice : 0,
          remains: remItem.remains?.length ? remItem.remains?.[0].q : 0,
          barcode: remItem.good.barcode,
          sortOrder: (document?.lines?.[0]?.sortOrder || 0) + 1,
          alias: remItem.good.alias || '',
          weightCode: remItem.good.weightCode?.trim() || '',
        };

        if (scannedObject) {
          navigation.navigate('DocLine', {
            mode: 0,
            docId,
            item: scannedObject,
          });
          setScaner({ state: 'init' });
        } else {
          setScaner({ state: 'error' });
        }
      } else {
        charFrom = charTo;
        charTo = charFrom + weightSettingsCountCode;
        const code = Number(brc.substring(charFrom, charTo)).toString();

        charFrom = charTo;
        charTo = charFrom + weightSettingsCountWeight;

        const qty = Number(brc.substring(charFrom, charTo)) / 1000;

        const remItem =
          Object.values(goodRemains)?.find((item: IMGoodRemain) => item.good.weightCode?.trim() === code) ||
          (documentType?.isRemains ? undefined : { good: { ...unknownGood, barcode: brc } });

        if (!remItem) {
          setScaner({ state: 'error', message: 'Товар не найден' });
          return;
        }

        const scannedObject: IMovementLine = {
          good: { id: remItem.good.id, name: remItem.good.name },
          id: generateId(),
          quantity: qty,
          price: remItem.remains?.length ? remItem.remains[0].price : 0,
          buyingPrice: remItem.remains?.length ? remItem.remains[0].buyingPrice : 0,
          remains: remItem.remains?.length ? remItem.remains?.[0].q : 0,
          barcode: remItem.good.barcode,
          sortOrder: (document?.lines?.[0]?.sortOrder || 0) + 1,
          alias: remItem.good.alias || '',
          weightCode: remItem.good.weightCode?.trim() || '',
        };

        if (scannedObject) {
          navigation.navigate('DocLine', {
            mode: 0,
            docId,
            item: scannedObject,
          });
          setScaner({ state: 'init' });
        } else {
          setScaner({ state: 'error' });
        }
      }
    },
    [
      docId,
      document?.lines,
      documentType?.isRemains,
      goodRemains,
      isInputQuantity,
      navigation,
      prefixGtin,
      weightSettingsCountCode,
      weightSettingsCountWeight,
      weightSettingsWeightCode.data,
    ],
  );

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  if (!document) {
    return (
      <View style={[globalStyles.container, globalStyles.alignItemsCenter]}>
        <LargeText>Документ не найден</LargeText>
      </View>
    );
  }

  return (
    <ScanBarcode
      onGetScannedObject={getScannedObject}
      onClearScannedObject={handleClearScaner}
      scaner={scaner}
      barcodeTypes={barcodeTypes}
      onSearch={handleShowRemains}
    />
  );
};

export default ScanBarcodeScreen;
