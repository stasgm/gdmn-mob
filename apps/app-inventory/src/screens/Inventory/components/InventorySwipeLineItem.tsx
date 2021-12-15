import React from 'react';
import { Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { documentActions, useDispatch } from '@lib/store';

import { InventorysStackParamList } from '../../../navigation/Root/types';
import { IInventoryLine } from '../../../store/types';

import SwipeDocItem from '../../../components/SwipeLineItem';

import { InventoryItem } from './InventoryItem';

interface IProps {
  item: IInventoryLine;
  docId: string;
  readonly?: boolean;
}

const InventorySwipeLineItem = ({ docId, item, readonly }: IProps) => {
  const navigation = useNavigation<StackNavigationProp<InventorysStackParamList, 'InventoryView'>>();
  const dispatch = useDispatch();

  const handlePressSwipeOrder = (name: 'edit' | 'delete', id: string, isBlocked?: boolean) => {
    if (name === 'edit') {
      navigation.navigate('InventoryLine', { mode: 0, docId, item });
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
    <SwipeDocItem onPress={(name) => handlePressSwipeOrder(name, item.id)}>
      <InventoryItem docId={docId} item={item} readonly={readonly} />
    </SwipeDocItem>
  );
};

export default InventorySwipeLineItem;
