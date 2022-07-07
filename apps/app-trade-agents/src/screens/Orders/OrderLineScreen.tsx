import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { View, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';

import { documentActions, refSelectors, useDispatch } from '@lib/store';
import { SaveButton, globalStyles as styles, AppActivityIndicator } from '@lib/mobile-ui';

import { OrdersStackParamList, RoutesStackParamList } from '../../navigation/Root/types';

import { IOrderLine, IPackageGood } from '../../store/types';

import { navBackButton } from '../../components/navigateOptions';

import OrderLine from './components/OrderLine';

const OrderLineScreen = () => {
  // console.log('OrderLineScreen');
  const navigation = useNavigation<StackNavigationProp<OrdersStackParamList | RoutesStackParamList, 'OrderLine'>>();
  const dispatch = useDispatch();
  const { mode, docId, item } = useRoute<RouteProp<OrdersStackParamList, 'OrderLine'>>().params;

  const [line, setLine] = useState<IOrderLine>(item);

  const [screenState, setScreenState] = useState<'idle' | 'saving'>('idle');

  const packages = refSelectors
    .selectByName<IPackageGood>('packageGood')
    ?.data?.filter((e) => e.good.id === item.good.id);

  useEffect(() => {
    if (screenState === 'saving') {
      if (!line.package && packages.length > 0) {
        Alert.alert('Ошибка!', 'Не указана упаковка', [{ text: 'Ок' }]);
        setScreenState('idle');
        return;
      }

      if (line.quantity) {
        dispatch(
          mode === 0
            ? documentActions.addDocumentLine({ docId, line })
            : documentActions.updateDocumentLine({ docId, line }),
        );
        navigation.goBack();
      } else {
        Alert.alert('Внимание!', 'В позиции не указан вес товара. Все равно продолжить сохранение?', [
          {
            text: 'Да',
            onPress: () => {
              dispatch(
                mode === 0
                  ? documentActions.addDocumentLine({ docId, line })
                  : documentActions.updateDocumentLine({ docId, line }),
              );
              navigation.goBack();
              setScreenState('idle');
            },
          },
          { text: 'Отмена', onPress: () => setScreenState('idle') },
        ]);
      }
    }
  }, [dispatch, docId, line, mode, navigation, packages.length, screenState]);

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
    <View style={styles.container}>
      <OrderLine item={line} onSetLine={setLine} />
    </View>
  );
};
export default OrderLineScreen;
