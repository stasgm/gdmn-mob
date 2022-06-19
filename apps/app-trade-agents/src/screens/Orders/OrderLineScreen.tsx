import React, { useCallback, useLayoutEffect, useState } from 'react';
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

  const packages = refSelectors
    .selectByName<IPackageGood>('packageGood')
    ?.data?.filter((e) => e.good.id === item.good.id);

  const handleSave = useCallback(() => {
    if (!line.packagekey && packages.length > 0) {
      Alert.alert('Ошибка!', 'Не указана упаковка', [{ text: 'Ок' }]);
      return;
    }
    dispatch(
      mode === 0
        ? documentActions.addDocumentLine({ docId, line })
        : documentActions.updateDocumentLine({ docId, line }),
    );

    navigation.goBack();
  }, [packages.length, dispatch, mode, docId, line, navigation]);

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
export default OrderLineScreen;
