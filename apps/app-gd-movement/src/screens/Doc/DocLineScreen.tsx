import React, { useCallback, useLayoutEffect, useState, useEffect } from 'react';
import { Alert, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';

import { documentActions, useDispatch } from '@lib/store';
import { SaveButton, globalStyles as styles, AppActivityIndicator, AppScreen, navBackButton } from '@lib/mobile-ui';

import { ScreenState } from '@lib/types';

import { generateId } from '@lib/mobile-hooks';

import { DocStackParamList } from '../../navigation/Root/types';

import { IMovementLine } from '../../store/types';
import { appInventoryActions } from '../../store';

import { unknownGood } from '../../utils/constants';

import { DocLine } from './components/DocLine';

export const DocLineScreen = () => {
  const navigation = useNavigation<StackNavigationProp<DocStackParamList | DocStackParamList, 'DocLine'>>();
  const dispatch = useDispatch();
  const { mode, docId, item } = useRoute<RouteProp<DocStackParamList, 'DocLine'>>().params;
  const [line, setLine] = useState<IMovementLine>(item);

  const [screenState, setScreenState] = useState<ScreenState>('idle');

  useEffect(() => {
    if (screenState === 'saving') {
      if (line.quantity < 0) {
        Alert.alert('Ошибка!', 'Количество товара не может быть меньше нуля!', [{ text: 'Ок' }]);
        setScreenState('idle');
        return;
      }
      let newLine = line;
      if (line.good.id === 'unknown' && mode === 0) {
        const id = `unknown_${generateId()}`;
        dispatch(
          appInventoryActions.addUnknownGood({
            ...unknownGood,
            ...line.good,
            barcode: line.barcode,
            id,
          }),
        );
        newLine = { ...newLine, good: { ...newLine.good, id } };
      }
      if (line.quantity) {
        dispatch(
          mode === 0
            ? documentActions.addDocumentLine({ docId, line: newLine })
            : documentActions.updateDocumentLine({ docId, line }),
        );
        navigation.goBack();
      } else {
        Alert.alert('Внимание!', 'В позиции не указано количество товара.\nВсе равно продолжить сохранение?', [
          {
            text: 'Да',
            onPress: () => {
              dispatch(
                mode === 0
                  ? documentActions.addDocumentLine({ docId, line: newLine })
                  : documentActions.updateDocumentLine({ docId, line }),
              );
              navigation.goBack();
            },
          },
          { text: 'Отмена', onPress: () => setScreenState('idle') },
        ]);
      }
    }
  }, [dispatch, docId, line, mode, navigation, screenState]);

  const renderRight = useCallback(
    () => (
      <View style={styles.buttons}>
        <SaveButton onPress={() => setScreenState('saving')} disabled={screenState === 'saving'} />
      </View>
    ),
    [screenState],
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
    <AppScreen>
      <DocLine item={line} onSetLine={setLine} />
    </AppScreen>
  );
};
