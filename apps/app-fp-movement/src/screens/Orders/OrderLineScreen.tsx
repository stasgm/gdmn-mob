import React, { useCallback, useLayoutEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { docSelectors, documentActions, useDispatch } from '@lib/store';
import { SaveButton, globalStyles as styles } from '@lib/mobile-ui';

import { OrderStackParamList } from '../../navigation/Root/types';

import { IOtvesLine, ITempDocument } from '../../store/types';
import { navBackButton } from '../../components/navigateOptions';

import { OrderLine } from './components/OrderLine';

const round = (num: number) => {
  return Math.round((num + Number.EPSILON) * 1000) / 1000;
};

export const OrderLineScreen = () => {
  const navigation = useNavigation<StackNavigationProp<OrderStackParamList | OrderStackParamList, 'OrderLine'>>();
  const dispatch = useDispatch();
  const { mode, docId, tempId, item } = useRoute<RouteProp<OrderStackParamList, 'OrderLine'>>().params;
  const [line, setLine] = useState<IOtvesLine>(item);

  const tempLines = docSelectors.selectByDocId<ITempDocument>(tempId)?.lines;

  const handleSave = useCallback(() => {
    for (const tempLine of tempLines) {
      if (line.good.id === tempLine.good.id) {
        console.log('123');
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
      }
    }
    dispatch(
      mode === 0
        ? documentActions.addDocumentLine({ docId, line })
        : documentActions.updateDocumentLine({ docId, line }),
    );
    navigation.goBack();
  }, [dispatch, docId, line, mode, navigation, tempId, tempLines]);

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

  return (
    <View style={[styles.container]}>
      <OrderLine item={line} onSetLine={setLine} />
    </View>
  );
};
