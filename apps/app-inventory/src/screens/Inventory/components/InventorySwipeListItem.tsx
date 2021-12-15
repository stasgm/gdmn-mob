import React from 'react';
import { v4 as uuid } from 'uuid';
import { Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { documentActions, useDispatch } from '@lib/store';

import { SwipeItem } from '@lib/mobile-ui';

import { InventorysStackParamList } from '../../../navigation/Root/types';
import { IInventoryDocument } from '../../../store/types';

import { IInventoryListRenderItemProps, InventoryListItem } from './InventoryListItem';

interface IProps {
  renderItem: IInventoryListRenderItemProps;
  item: IInventoryDocument;
  edit?: boolean;
  copy?: boolean;
  del?: boolean;
}

export const InventorySwipeListItem = ({ item, renderItem, edit, del, copy }: IProps) => {
  const navigation = useNavigation<StackNavigationProp<InventorysStackParamList, 'InventoryList'>>();
  const dispatch = useDispatch();

  const handlePressSwipeOrder = (name: 'edit' | 'copy' | 'delete', id: string, isBlocked?: boolean) => {
    if (name === 'edit') {
      navigation.navigate('InventoryView', { id });
    } else if (name === 'copy') {
      const newReturnDate = new Date().toISOString();

      const newInventory: IInventoryDocument = {
        ...item,
        id: uuid(),
        number: 'б\\н',
        status: 'DRAFT',
        documentDate: newReturnDate,
        creationDate: newReturnDate,
        editionDate: newReturnDate,
      };

      dispatch(documentActions.addDocument(newInventory));

      navigation.navigate('InventoryView', { id: newInventory.id });
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
      <InventoryListItem {...renderItem} />
    </SwipeItem>
  );
};
