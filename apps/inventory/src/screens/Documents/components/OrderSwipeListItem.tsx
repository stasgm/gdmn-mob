import React from 'react';
import { v4 as uuid } from 'uuid';
import { Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { documentActions, useDispatch } from '@lib/store';

import { DocumentsStackParamList } from '../../../navigation/Root/types';
import { IOrderDocument } from '../../../store/types';

import SwipeItem from '../../../components/SwipeItem';

import OrderListItem, { IOrderListRenderItemProps } from './OrderListItem';

interface IProps {
  renderItem: IOrderListRenderItemProps;
  item: IOrderDocument;
}

const OrderSwipeListItem = ({ item, renderItem }: IProps) => {
  const navigation = useNavigation<StackNavigationProp<DocumentsStackParamList, 'DocumentList'>>();
  const dispatch = useDispatch();

  const handlePressSwipeOrder = (name: 'edit' | 'copy' | 'delete', id: string, isBlocked?: boolean) => {
    if (name === 'edit') {
      navigation.navigate('DocumentView', { id });
    } else if (name === 'copy') {
      const newReturnDate = new Date().toISOString();

      const newOrder: IOrderDocument = {
        ...item,
        id: uuid(),
        number: 'б\\н',
        status: 'DRAFT',
        documentDate: newReturnDate,
        creationDate: newReturnDate,
        editionDate: newReturnDate,
      };

      dispatch(documentActions.addDocument(newOrder));

      navigation.navigate('DocumentView', { id: newOrder.id });
    } else if (name === 'delete') {
      if (isBlocked) {
        return Alert.alert('Внимание!', 'Документ не может быть удален', [{ text: 'OK' }]);
      }

      Alert.alert('Вы уверены, что хотите удалить документ?', '', [
        {
          text: 'Да',
          onPress: async () => {
            dispatch(documentActions.removeDocument(id));
          },
        },
        {
          text: 'Отмена',
        },
      ]);
    }
  };

  return (
    <SwipeItem onPress={(name) => handlePressSwipeOrder(name, item.id, item?.status !== 'DRAFT')}>
      <OrderListItem {...renderItem} />
    </SwipeItem>
  );
};

export default OrderSwipeListItem;
