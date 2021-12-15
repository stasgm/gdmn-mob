import React from 'react';
import { Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { documentActions, useDispatch } from '@lib/store';

import { OrdersStackParamList } from '../../../navigation/Root/types';
import { IOrderLine } from '../../../store/types';

import SwipeLineItem from '../../../components/SwipeLineItem';

import OrderItem from './OrderItem';

interface IProps {
  item: IOrderLine;
  docId: string;
  readonly?: boolean;
}

const OrderSwipeLineItem = ({ docId, item, readonly }: IProps) => {
  const navigation = useNavigation<StackNavigationProp<OrdersStackParamList, 'OrderView'>>();
  const dispatch = useDispatch();

  const handlePressSwipeOrder = (name: 'edit' | 'delete', id: string, isBlocked?: boolean) => {
    if (name === 'edit') {
      navigation.navigate('OrderLine', { mode: 0, docId, item });
    } else if (name === 'delete') {
      if (isBlocked) {
        return Alert.alert('Внимание!', 'Позиция не может быть удалена', [{ text: 'OK' }]);
      }

      Alert.alert('Вы уверены, что хотите удалить позицию?', '', [
        {
          text: 'Да',
          onPress: async () => {
            dispatch(documentActions.deleteDocumentLine({ docId, lineId: item.id }));
          },
        },
        {
          text: 'Отмена',
        },
      ]);
    }
  };

  return (
    <SwipeLineItem onPress={(name) => handlePressSwipeOrder(name, item.id)}>
      <OrderItem docId={docId} item={item} readonly={readonly} />
    </SwipeLineItem>
  );
};

export default OrderSwipeLineItem;
