import React, { useCallback, useLayoutEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';

import { docSelectors, documentActions, useDispatch } from '@lib/store';
import { SaveButton, globalStyles as styles, AppActivityIndicator } from '@lib/mobile-ui';

import { OrderStackParamList } from '../../navigation/Root/types';

import { IOtvesDocument, IOtvesLine, ITempDocument } from '../../store/types';
import { navBackButton } from '../../components/navigateOptions';

// import { getBarcode } from '../../utils/helpers';

import { OtvesLine } from './components/OtvesLine';

const round = (num: number) => {
  return Math.round((num + Number.EPSILON) * 1000) / 1000;
};

export const OtvesLineScreen = () => {
  const navigation = useNavigation<StackNavigationProp<OrderStackParamList | OrderStackParamList, 'OtvesLine'>>();
  const dispatch = useDispatch();
  const { mode, docId, tempId, item } = useRoute<RouteProp<OrderStackParamList, 'OtvesLine'>>().params;
  const [line, setLine] = useState<IOtvesLine>(item);

  const tempLines = docSelectors.selectByDocId<ITempDocument>(tempId)?.lines;
  const otvesLines = docSelectors.selectByDocId<IOtvesDocument>(docId)?.lines;

  const handleSave = useCallback(() => {
    // for (const tempLine of tempLines) {
    const tempLine = tempLines?.find((i) => line.good.id === i.good.id);
    const otvesLine = otvesLines.find((i) => i.barcode === line.barcode);

    console.log('otv', otvesLine);
    if (tempLine) {
      const newLine = { ...tempLine, weight: round(tempLine.weight - line.weight) };
      if (newLine.weight > 0) {
        dispatch(
          documentActions.updateDocumentLine({
            docId: tempId,
            line: newLine,
          }),
        );
      } else if (newLine.weight === 0) {
        dispatch(documentActions.removeDocumentLine({ docId: tempId, lineId: tempLine.id }));
      } else {
        Alert.alert('Данное количество превышает количество в заявке', 'Добавить позицию?', [
          {
            text: 'Да',
            onPress: async () => {
              dispatch(documentActions.removeDocumentLine({ docId: tempId, lineId: tempLine.id }));
            },
          },
          {
            text: 'Отмена',
          },
        ]);
      }
      dispatch(
        mode === 0
          ? documentActions.addDocumentLine({ docId, line })
          : documentActions.updateDocumentLine({ docId, line }),
      );
      navigation.goBack();
    } else {
      Alert.alert('Данный товар отсутствует в позициях заявки', 'Добавить позицию?', [
        {
          text: 'Да',
          onPress: async () => {
            dispatch(
              mode === 0
                ? documentActions.addDocumentLine({ docId, line })
                : documentActions.updateDocumentLine({ docId, line }),
            );
            navigation.goBack();
          },
        },
        {
          text: 'Отмена',
        },
      ]);
    }
    // }
  }, [dispatch, docId, line, mode, navigation, otvesLines, tempId, tempLines]);

  const renderRight = useCallback(
    () => (
      <View style={styles.buttons}>
        <SaveButton onPress={handleSave} />
      </View>
    ),
    [handleSave],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
      headerRight: renderRight,
    });
  }, [navigation, renderRight]);

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }
  return (
    <View style={[styles.container]}>
      <OtvesLine item={line} onSetLine={setLine} />
    </View>
  );
};
