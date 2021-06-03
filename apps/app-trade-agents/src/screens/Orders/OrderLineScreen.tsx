import { documentActions, useDispatch } from '@lib/store';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { View } from 'react-native';

import styles from '@lib/mobile-ui/src/styles/global';

import { SaveButton, BackButton } from '@lib/mobile-ui/src/components/AppBar';

import { OrdersStackParamList } from '../../navigation/Root/types';

import { IOrderLine } from '../../store/docs/types';

import OrderLine from './components/OrderLine';

const OrderLineScreen = () => {
  const { mode, docId, item } = useRoute<RouteProp<OrdersStackParamList, 'OrderLine'>>().params;

  const [line, setLine] = useState<IOrderLine>(item);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleSave = useCallback(() => {
    if (mode === 0) {
      dispatch(documentActions.addDocumentLine({ docId, line }));
    } else {
      dispatch(documentActions.updateDocumentLine({ docId, line }));
    }

    navigation.navigate('OrderView', { id: docId });
  }, [navigation, line, docId, dispatch, mode]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
      headerRight: () => <SaveButton onPress={handleSave} />,
    });
  }, [navigation, handleSave]);

  return (
    <View style={[styles.container]}>
      <OrderLine item={item} onSetLine={(value: IOrderLine) => setLine(value)} />
    </View>
  );
};

export default OrderLineScreen;
