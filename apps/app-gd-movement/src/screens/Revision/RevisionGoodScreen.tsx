import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { useNavigation, RouteProp, useRoute, useIsFocused } from '@react-navigation/native';

import { AppActivityIndicator, globalStyles, LargeText, navBackButton, ScanBarcode } from '@lib/mobile-ui';
import { docSelectors, useDispatch, documentActions, useSelector, appActions, refSelectors } from '@lib/store';

import { StackNavigationProp } from '@react-navigation/stack';

import { IScannedObject } from '@lib/client-types';

import { generateId } from '@lib/mobile-hooks';

import { INamedEntity } from '@lib/types';

import { RevisionStackParamList } from '../../navigation/Root/types';
import { IRevisionDocument, IRevisionLine } from '../../store/types';
import { IGood, IMGoodData, IMGoodRemain, IRemains } from '../../store/app/types';
import { getRemGoodByContact } from '../../utils/helpers';
import { unknownGood } from '../../utils/constants';

const RevisionGoodScreen = () => {
  const docId = useRoute<RouteProp<RevisionStackParamList, 'RevisionGood'>>().params?.docId;
  const navigation = useNavigation<StackNavigationProp<RevisionStackParamList, 'RevisionGood'>>();

  const dispatch = useDispatch();

  const [scaner, setScaner] = useState<IScannedObject>({ state: 'init' });
  const [scannedObject, setScannedObject] = useState<IRevisionLine>();

  const [isButtonBlocked, setIsButtonBlocked] = useState(false);

  useEffect(() => {
    return () => {
      dispatch(appActions.clearFormParams());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
    });
  }, [navigation]);

  const doc = docSelectors.selectByDocId<IRevisionDocument>(docId);
  const lines = useMemo(() => doc?.lines?.sort((a, b) => (b.sortOrder || 0) - (a.sortOrder || 0)), [doc?.lines]);

  const goods = refSelectors.selectByName<IGood>('good')?.data;

  const remains = refSelectors.selectByName<IRemains>('remains')?.data[0];

  const contactId = useMemo(() => doc?.head?.department?.id, [doc?.head?.department?.id]);

  const [goodRemains] = useState<IMGoodData<IMGoodRemain>>(() =>
    contactId ? getRemGoodByContact(goods, remains[contactId], true) : {},
  );

  const handleGetScannedObject = useCallback(
    (brc: string) => {
      // if (doc?.head.isBindGood && doc?.lines?.find((l) => l.barcode === brc)) {
      //   setScaner({
      //     state: 'error',
      //     message: 'Баркод  уже добавлен',
      //   });
      //   return;
      // }

      if (!doc) {
        return;
      }

      const scannedGood = {
        id: generateId(),
        barcode: brc,
      };

      const line = doc.lines.find((i) => i.barcode === brc);

      const remItem = goodRemains[brc];

      if (remItem) {
        setScaner({ state: line ? 'error' : 'found' });
        setScannedObject({
          ...scannedGood,
          good: { id: remItem.good.id, name: remItem.good.name },
          price: remItem.remains?.length ? remItem.remains[0].price : 0,
          remains: remItem.remains?.length ? remItem.remains?.[0].q : 0,
        });

        if (line) {
          setIsButtonBlocked(true);
        }

        return;
      } else {
        const good = goods.find((i) => i.barcode === brc);

        if (good) {
          setScaner({ state: line ? 'error' : 'found' });

          setScannedObject({ ...scannedGood, good: { id: good.id, name: good.name }, price: good.price || 0 });

          if (line) {
            setIsButtonBlocked(true);
          }
        } else {
          if (line) {
            setIsButtonBlocked(true);
            setScannedObject({
              ...scannedGood,
              good: { id: unknownGood.id, name: line.good?.name || unknownGood.name },
            });
          } else {
            setScannedObject({ ...scannedGood, good: { id: unknownGood.id, name: unknownGood.name } });
          }
          setScaner({ state: 'error' });
        }
      }
    },
    [doc, goodRemains, goods],
  );

  const [currentLineId, setCurrentLineId] = useState('');
  const good = useSelector((state) => state.app.formParams?.good) as INamedEntity | undefined;

  useEffect(() => {
    if (doc && good && currentLineId) {
      const currentLine = doc.lines?.find((l) => l.id === currentLineId);
      if (currentLine && currentLine.good?.id !== good?.id) {
        dispatch(
          documentActions.updateDocumentLine({
            docId: doc.id,
            line: { ...currentLine, good, withGood: true } as IRevisionLine,
          }),
        );
        setCurrentLineId('');
        dispatch(appActions.setFormParams({ good: undefined }));
      }
    }
  }, [currentLineId, dispatch, doc, good]);

  const handleSaveScannedItem = useCallback(
    (isWithGood: boolean) => {
      if (!scannedObject) {
        return;
      }

      if (!doc) {
        return;
      }
      if (isWithGood) {
        const line = doc.lines.find((i) => i.barcode === scannedObject.barcode);

        if (line) {
          setCurrentLineId(line.id);
          navigation.navigate('SelectRefItem', {
            refName: 'good',
            fieldName: 'good',
          });
        } else {
          const newLine: IRevisionLine = { ...scannedObject, sortOrder: (lines?.[0]?.sortOrder || 0) + 1 };
          dispatch(documentActions.addDocumentLine({ docId, line: newLine }));

          setCurrentLineId(newLine.id);
          navigation.navigate('SelectRefItem', {
            refName: 'good',
            fieldName: 'good',
          });
        }
      } else {
        const line: IRevisionLine = { ...scannedObject, sortOrder: (lines?.[0]?.sortOrder || 0) + 1 };

        dispatch(documentActions.addDocumentLine({ docId, line }));
      }

      setScaner({ state: 'init' });
    },
    [scannedObject, doc, navigation, lines, dispatch, docId],
  );

  const handleClearScaner = () => {
    setScaner({ state: 'init' });
    setIsButtonBlocked(false);
  };

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  if (!doc) {
    return (
      <View style={[globalStyles.container, globalStyles.alignItemsCenter]}>
        <LargeText>Документ не найден</LargeText>
      </View>
    );
  }

  return (
    <ScanBarcode
      onSave={() => !isButtonBlocked && handleSaveScannedItem(false)}
      onGetScannedObject={handleGetScannedObject}
      onClearScannedObject={handleClearScaner}
      scaner={scaner}
      barCodeTypes={[]}
      showExtraButton={scannedObject?.good?.id === 'unknown'}
      extraButtonIcon="clipboard-text-search-outline"
      extraButtonName="Привязать ТМЦ"
      onPressExtraButton={() => handleSaveScannedItem(true)}
    >
      {scannedObject ? (
        <View style={localStyles.itemInfo}>
          <View style={localStyles.goodInfo}>
            {scannedObject?.good?.id !== 'unknown' ? (
              <>
                <Text style={localStyles.goodName} numberOfLines={3}>
                  {scannedObject?.good?.name || ''}
                </Text>
                <Text style={localStyles.barcode}>{scannedObject?.barcode}</Text>
                <Text style={localStyles.barcode}>
                  цена: {scannedObject?.price || 0} р.
                  {scannedObject?.remains || scannedObject?.remains === 0 ? `, остаток: ${scannedObject?.remains}` : ''}
                </Text>
                {doc?.lines?.find((l) => l.barcode === scannedObject.barcode) ? (
                  <Text style={localStyles.goodName} numberOfLines={3}>
                    Баркод уже добавлен
                  </Text>
                ) : null}
              </>
            ) : (
              <>
                <Text style={localStyles.goodName} numberOfLines={3}>
                  {scannedObject?.barcode}
                </Text>
                <Text style={localStyles.barcode} numberOfLines={3}>
                  {scannedObject?.good?.name || ''}
                </Text>
                {doc?.lines?.find((l) => l.barcode === scannedObject.barcode) ? (
                  <Text style={localStyles.goodName} numberOfLines={3}>
                    Баркод уже добавлен
                  </Text>
                ) : null}
              </>
            )}
          </View>
        </View>
      ) : undefined}
    </ScanBarcode>
  );
};

export default RevisionGoodScreen;

const localStyles = StyleSheet.create({
  itemInfo: {
    flexShrink: 1,
    paddingRight: 10,
  },

  goodInfo: {
    flexShrink: 1,
    paddingRight: 10,
  },
  goodName: {
    color: '#fff',
    fontSize: 18,
    textTransform: 'uppercase',
  },
  barcode: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.5,
  },
});
