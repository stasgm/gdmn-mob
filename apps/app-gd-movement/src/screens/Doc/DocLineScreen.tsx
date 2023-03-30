import React, { useCallback, useLayoutEffect, useState, useEffect, useMemo } from 'react';
import { Alert, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';

import { docSelectors, documentActions, refSelectors, useDispatch, useSelector } from '@lib/store';
import {
  SaveButton,
  globalStyles as styles,
  AppActivityIndicator,
  navBackButton,
  AppInputScreen,
} from '@lib/mobile-ui';

import { IDocumentType, ScreenState } from '@lib/types';

import { AsyncAlert, generateId } from '@lib/mobile-hooks';

import KeyEvent from 'react-native-keyevent';

import { DocStackParamList } from '../../navigation/Root/types';

import { IMovementDocument, IMovementLine } from '../../store/types';
import { appInventoryActions } from '../../store';

import { unknownGood } from '../../utils/constants';

import { DocLine } from './components/DocLine';

export const DocLineScreen = () => {
  const navigation = useNavigation<StackNavigationProp<DocStackParamList | DocStackParamList, 'DocLine'>>();
  const dispatch = useDispatch();
  const { mode, docId, item } = useRoute<RouteProp<DocStackParamList, 'DocLine'>>().params;
  const [line, setLine] = useState<IMovementLine>(item);
  const [disabledSave, setDisabledSave] = useState(false);

  const [screenState, setScreenState] = useState<ScreenState>('idle');

  const settings = useSelector((state) => state.settings?.data);
  const showZeroRemains = settings?.showZeroRemains?.data;

  const document = docSelectors.selectByDocId<IMovementDocument>(docId);
  const documentTypes = refSelectors.selectByName<IDocumentType>('documentType')?.data;

  const documentType = useMemo(
    () => documentTypes?.find((d) => d.id === document?.documentType.id),
    [document?.documentType.id, documentTypes],
  );

  useEffect(() => {
    // eslint-disable-next-line import/no-named-as-default-member
    KeyEvent.onKeyDownListener((keyEvent: any) => {
      if (keyEvent.keyCode === 66 && !disabledSave) {
        setScreenState('saving');
      }
    });

    return () => {
      // eslint-disable-next-line import/no-named-as-default-member
      KeyEvent.removeKeyDownListener();
    };
  }, [disabledSave]);

  useEffect(() => {
    if (screenState === 'saving') {
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
      dispatch(
        mode === 0
          ? documentActions.addDocumentLine({ docId, line: newLine })
          : documentActions.updateDocumentLine({ docId, line }),
      );
      navigation.goBack();
    }
  }, [
    dispatch,
    docId,
    documentType?.isControlRemains,
    documentType?.isRemains,
    line,
    mode,
    navigation,
    screenState,
    showZeroRemains,
  ]);

  const renderRight = useCallback(
    () => (
      <View style={styles.buttons}>
        <SaveButton
          onPress={async () => {
            if (line.quantity < 0) {
              Alert.alert('Ошибка!', 'Количество товара не может быть меньше нуля!', [{ text: 'Ок' }]);
              return;
            }
            //Предупреждение, если количество по товару больше остатков
            if (
              (!!documentType?.isControlRemains &&
                (line.quantity > (line.remains || 0) || (line.remains || 0) === 0)) ||
              !line.quantity
            ) {
              const response = await AsyncAlert(
                'Внимание!',
                !line.quantity
                  ? 'В позиции не указано количество товара.\nПродолжить сохранение?'
                  : 'Указанное количество превышает остаток.\nПродолжить сохранение?',
              );
              if (response === 'NO') {
                return;
              }
            }
            setScreenState('saving');
          }}
          disabled={screenState === 'saving' || disabledSave}
        />
      </View>
    ),
    [disabledSave, documentType?.isControlRemains, line.quantity, line.remains, screenState],
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
    <AppInputScreen>
      <DocLine item={line} onSetLine={setLine} onSetDisabledSave={setDisabledSave} />
    </AppInputScreen>
  );
};
