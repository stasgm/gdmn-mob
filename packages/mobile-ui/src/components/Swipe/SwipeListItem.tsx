import React, { ReactNode } from 'react';
import { v4 as uuid } from 'uuid';
import { Alert, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { documentActions, useDispatch } from '@lib/store';

import { IDocument } from '@lib/types';

import SwipeItem from './SwipeItem';

interface IProps {
  children?: ReactNode;
  renderItem: any;
  item: any;
  edit?: boolean;
  copy?: boolean;
  del?: boolean;
  routeName: string;
}

const SwipeListItem = ({ children, item, edit, del, copy, routeName }: IProps) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handlePressSwipeOrder = (name: 'edit' | 'copy' | 'delete', id: string, isBlocked?: boolean) => {
    if (name === 'edit') {
      navigation.navigate(routeName, { id });
    } else if (name === 'copy') {
      const newReturnDate = new Date().toISOString();

      const newInventory: IDocument = {
        ...item,
        id: uuid(),
        number: 'б\\н',
        status: 'DRAFT',
        documentDate: newReturnDate,
        creationDate: newReturnDate,
        editionDate: newReturnDate,
      };

      dispatch(documentActions.addDocument(newInventory));

      navigation.navigate(routeName, { id: newInventory.id });
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
    <SwipeItem
      onPress={(name) => handlePressSwipeOrder(name, item.id, item?.status !== 'DRAFT')}
      edit={edit}
      copy={copy}
      del={del}
    >
      <View>{children}</View>
    </SwipeItem>
  );
};

export default SwipeListItem;
