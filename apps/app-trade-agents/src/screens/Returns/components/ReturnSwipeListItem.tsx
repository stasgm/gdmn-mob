import React from 'react';
import { v4 as uuid } from 'uuid';
import { Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { documentActions, useDispatch } from '@lib/store';

import { ReturnsStackParamList } from '../../../navigation/Root/types';
import { IReturnDocument } from '../../../store/types';

import SwipeItem from '../../../components/SwipeItem';

import ReturnListItem, { IReturnListRenderItemProps } from './ReturnListItem';

interface IProps {
  renderItem: IReturnListRenderItemProps;
  item: IReturnDocument;
}

const ReturnSwipeListItem = ({ item, renderItem }: IProps) => {
  const navigation = useNavigation<StackNavigationProp<ReturnsStackParamList, 'ReturnList'>>();
  const dispatch = useDispatch();

  const handlePressSwipeReturn = (name: 'edit' | 'copy' | 'delete', id: string, isBlocked?: boolean) => {
    if (name === 'edit') {
      navigation.navigate('ReturnView', { id });
    } else if (name === 'copy') {
      const newReturnDate = new Date().toISOString();

      const newReturn: IReturnDocument = {
        ...item,
        id: uuid(),
        number: 'б\\н',
        status: 'DRAFT',
        documentDate: newReturnDate,
        creationDate: newReturnDate,
        editionDate: newReturnDate,
      };

      dispatch(documentActions.addDocument(newReturn));

      navigation.navigate('ReturnView', { id: newReturn.id });
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
    <SwipeItem onPress={(name) => handlePressSwipeReturn(name, item.id, item?.status !== 'DRAFT')}>
      <ReturnListItem {...renderItem} />
    </SwipeItem>
  );
};

export default ReturnSwipeListItem;
