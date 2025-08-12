import React, { useCallback, useLayoutEffect, useState, useEffect, useMemo } from 'react';
import { Alert, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';

import { docSelectors, documentActions, refSelectors, useDispatch } from '@lib/store';
import {
  SaveButton,
  globalStyles as styles,
  AppActivityIndicator,
  navBackButton,
  AppInputScreen,
} from '@lib/mobile-ui';

import { IDocumentType, ScreenState } from '@lib/types';

import { generateId } from '@lib/mobile-hooks';

import KeyEvent from 'react-native-keyevent';

import { InvoiceStackParamList } from '../../navigation/Root/types';

import { IInvoiceDocument, IInvoiceLine } from '../../store/types';
import { appInventoryActions } from '../../store';

import { unknownGood } from '../../utils/constants';

import { IGood } from '../../store/app/types';

import { InvoiceLine } from './components/InvoiceLine';

export const InvoiceLineScreen = () => {
  const navigation = useNavigation<StackNavigationProp<InvoiceStackParamList | InvoiceStackParamList, 'InvoiceLine'>>();
  const dispatch = useDispatch();
  const { mode, docId, item } = useRoute<RouteProp<InvoiceStackParamList, 'InvoiceLine'>>().params;
  const [line, setLine] = useState<IInvoiceLine>(item);
  const [disabledSave, setDisabledSave] = useState(false);

  const [screenState, setScreenState] = useState<ScreenState>('idle');

  const document = docSelectors.selectByDocId<IInvoiceDocument>(docId);
  const documentTypes = refSelectors.selectByName<IDocumentType>('documentType')?.data;

  const documentType = useMemo(
    () => documentTypes?.find((d) => d.id === document?.documentType.id),
    [document?.documentType.id, documentTypes],
  );

  const goods = refSelectors.selectByName<IGood>('good')?.data;

  useEffect(() => {
    KeyEvent.onKeyDownListener((keyEvent: any) => {
      if (keyEvent.keyCode === 66 && !disabledSave) {
        setScreenState('saving');
      }
    });

    return () => {
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
            price: line.price || 0,
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
  }, [dispatch, docId, documentType?.isControlRemains, documentType?.isRemains, line, mode, navigation, screenState]);

  const renderRight = useCallback(
    () => (
      <View style={styles.buttons}>
        <SaveButton
          onPress={async () => {
            if (line.quantity < 0) {
              Alert.alert('Ошибка!', 'Количество товара не может быть меньше нуля!', [{ text: 'Ок' }]);
              return;
            }

            const goodIsMark = goods?.find((e) => e.id === item?.good.id)?.isMark;

            if (!!goodIsMark && !line.EID) {
              Alert.alert('Ошибка!', 'Поле EID должно быть заполнено! Отсканируйте штрих-код.', [{ text: 'Ок' }]);
              return;
            }

            if (line.eidType !== '0' && line.quantity !== line.eidList?.length) {
              Alert.alert('Ошибка!', 'Количество кодов маркировки не совпадает с количеством товара', [{ text: 'Ок' }]);
              return;
            }
            setScreenState('saving');
          }}
          disabled={screenState === 'saving' || disabledSave}
        />
      </View>
    ),
    [disabledSave, goods, item?.good.id, line.EID, line.eidList?.length, line.eidType, line.quantity, screenState],
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
      <InvoiceLine
        item={line}
        onSetLine={setLine}
        onSetDisabledSave={setDisabledSave}
        isSumWNds={Boolean(document?.documentType.isSumWNds)}
      />
    </AppInputScreen>
  );
};
