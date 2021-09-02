import React, { useCallback, useLayoutEffect, useState } from 'react';
import { View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { documentActions, useDispatch } from '@lib/store';
import { SaveButton, BackButton, globalStyles as styles } from '@lib/mobile-ui';

import { OrdersStackParamList, RoutesStackParamList } from '../../navigation/Root/types';

import { IOrderLine } from '../../store/types';

import OrderLine from './components/OrderLine';

const OrderLineScreen = () => {
  const navigation = useNavigation<StackNavigationProp<OrdersStackParamList | RoutesStackParamList, 'OrderLine'>>();
  const dispatch = useDispatch();
  const { mode, docId, item } = useRoute<RouteProp<OrdersStackParamList, 'OrderLine'>>().params;

  const [line, setLine] = useState<IOrderLine>(item);

  const handleSave = useCallback(() => {
    dispatch(
      mode === 0
        ? documentActions.addDocumentLine({ docId, line })
        : documentActions.updateDocumentLine({ docId, line }),
    );

    navigation.goBack();
    // navigation.navigate('OrderView', { id: docId });
  }, [navigation, line, docId, dispatch, mode]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
      headerRight: () => (
        <View style={styles.buttons}>
          <SaveButton onPress={handleSave} />
        </View>
      ),
    });
  }, [navigation, handleSave]);

  return (
    <View style={[styles.container]}>
      <OrderLine item={line} onSetLine={setLine} />
    </View>
  );
};
export default OrderLineScreen;
