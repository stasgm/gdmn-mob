import React from 'react';
import { Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { documentActions, useDispatch } from '@lib/store';

import { SwipeItem } from '@lib/mobile-ui';

import { ReturnsStackParamList } from '../../../navigation/Root/types';
import { IReturnLine } from '../../../store/types';

import ReturnItem from './ReturnItem';

interface IProps {
  item: IReturnLine;
  docId: string;
  readonly?: boolean;
  edit?: boolean;
  copy?: boolean;
  del?: boolean;
}

const ReturnSwipeLineItem = ({ docId, item, readonly, edit, copy, del }: IProps) => {
  const navigation = useNavigation<StackNavigationProp<ReturnsStackParamList, 'ReturnView'>>();
  const dispatch = useDispatch();

  const handlePressSwipeOrder = (name: 'edit' | 'copy' | 'delete', id: string) => {
    if (name === 'edit') {
      navigation.navigate('ReturnLine', { mode: 0, docId, item });
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

  return !readonly ? (
    <SwipeItem onPress={(name) => handlePressSwipeOrder(name, item.id)} edit={edit} copy={copy} del={del}>
      <ReturnItem docId={docId} item={item} readonly={readonly} />
    </SwipeItem>
  ) : (
    <ReturnItem docId={docId} item={item} readonly={readonly} />
  );
};

export default ReturnSwipeLineItem;
