import { useDispatch } from '@lib/store';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useLayoutEffect } from 'react';
import { View } from 'react-native';

import styles from '@lib/mobile-ui/src/styles/global';

import { SaveButton, BackButton } from '@lib/mobile-ui/src/components/AppBar';

import { OrdersStackParamList } from '../../navigation/Root/types';

import OrderLine from './components/OrderLine';

const OrderLineScreen = () => {
  const { docId, item } = useRoute<RouteProp<OrdersStackParamList, 'OrderLine'>>().params;

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleSave = useCallback(() => {
    if (item) {
      // dispatch(documentActions.updateDocumentLine(id, doc));
    } else {
      // dispatch(documentActions.addDocumentLine(id, doc));
    }
    navigation.navigate('OrderView', { id: docId });
  }, [navigation, item, docId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
      headerRight: () => <SaveButton onPress={handleSave} />,
    });
  }, [navigation, handleSave]);

  return (
    <View style={[styles.container]}>
      <OrderLine item={item} />
    </View>
  );
};

export default OrderLineScreen;
