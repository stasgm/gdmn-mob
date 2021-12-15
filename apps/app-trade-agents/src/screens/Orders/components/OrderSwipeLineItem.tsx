import React from 'react';
import { Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { documentActions, useDispatch } from '@lib/store';

import { SwipeItem } from '@lib/mobile-ui';

import { OrdersStackParamList } from '../../../navigation/Root/types';
import { IOrderLine } from '../../../store/types';

import OrderItem from './OrderItem';

interface IProps {
  item: IOrderLine;
  docId: string;
  readonly?: boolean;
  edit?: boolean;
  copy?: boolean;
  del?: boolean;
}

const OrderSwipeLineItem = ({ docId, item, readonly, edit, copy, del }: IProps) => {
  const navigation = useNavigation<StackNavigationProp<OrdersStackParamList, 'OrderView'>>();
  const dispatch = useDispatch();

  const handlePressSwipeOrder = (name: 'edit' | 'copy' | 'delete', id: string) => {
    if (name === 'edit') {
      navigation.navigate('OrderLine', { mode: 0, docId, item });
    } else if (name === 'delete') {
      if (readonly) {
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
    <SwipeItem onPress={(name) => handlePressSwipeOrder(name, item.id)} edit={edit} copy={copy} del={del}>
      <OrderItem docId={docId} item={item} readonly={readonly} />
    </SwipeItem>
  );
};

export default OrderSwipeLineItem;
