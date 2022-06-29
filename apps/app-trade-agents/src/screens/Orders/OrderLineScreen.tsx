import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { View, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { documentActions, refSelectors, useDispatch } from '@lib/store';
import { SaveButton, globalStyles as styles } from '@lib/mobile-ui';

import { OrdersStackParamList, RoutesStackParamList } from '../../navigation/Root/types';

import { IOrderLine, IPackageGood } from '../../store/types';

import { navBackButton } from '../../components/navigateOptions';

import OrderLine from './components/OrderLine';

const OrderLineScreen = () => {
  const navigation = useNavigation<StackNavigationProp<OrdersStackParamList | RoutesStackParamList, 'OrderLine'>>();
  const dispatch = useDispatch();
  const { mode, docId, item } = useRoute<RouteProp<OrdersStackParamList, 'OrderLine'>>().params;

  const [line, setLine] = useState<IOrderLine>(item);

  const [loading, setLoading] = useState(false);

  const packages = refSelectors
    .selectByName<IPackageGood>('packageGood')
    ?.data?.filter((e) => e.good.id === item.good.id);

  // const handleSave = useCallback(() => {
  //   if (!line.packagekey && packages.length > 0) {
  //     Alert.alert('Ошибка!', 'Не указана упаковка', [{ text: 'Ок' }]);
  //     return;
  //   }
  //   dispatch(
  //     mode === 0
  //       ? documentActions.addDocumentLine({ docId, line })
  //       : documentActions.updateDocumentLine({ docId, line }),
  //   );

  //   navigation.goBack();
  // }, [line, packages.length, dispatch, mode, docId, navigation]);

  useEffect(() => {
    if (loading) {
      if (!line.packagekey && packages.length > 0) {
        Alert.alert('Ошибка!', 'Не указана упаковка', [{ text: 'Ок' }]);
        setLoading(false);
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
            },
          },
          { text: 'Отмена', onPress: () => setLoading(false) },
        ]);
      }
    }
  }, [dispatch, docId, line, loading, mode, navigation, packages.length]);

  const renderRight = useCallback(
    () => (
      <View style={styles.buttons}>
        <SaveButton onPress={() => setLoading(true)} disabled={loading} />
      </View>
    ),
    [loading],
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
export default OrderLineScreen;
