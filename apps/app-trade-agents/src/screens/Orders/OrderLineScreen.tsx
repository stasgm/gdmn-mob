import React, { useCallback, useLayoutEffect, useState } from 'react';
import { View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { v4 as uuid } from 'uuid';

import { documentActions, useDispatch } from '@lib/store';
import { SaveButton, BackButton, globalStyles as styles } from '@lib/mobile-ui';

import { OrdersStackParamList, RoutesStackParamList } from '../../navigation/Root/types';

import { IOrderLine } from '../../store/docs/types';

import OrderLine from './components/OrderLine';

const OrderLineScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<RoutesStackParamList, 'OrderLine'>>();
  const { docId, item } = useRoute<RouteProp<OrdersStackParamList, 'OrderLine'>>().params;

  const [line, setLine] = useState<IOrderLine>({ ...item, id: item.id || uuid() });

  const handleSave = useCallback(() => {
    dispatch(
      !item.id ? documentActions.addDocumentLine({ docId, line }) : documentActions.updateDocumentLine({ docId, line }),
    );

    navigation.goBack();
    // navigation.navigate('OrderView', { id: docId });
  }, [dispatch, item.id, docId, line, navigation]);

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
