import React, { ReactNode, useCallback } from 'react';
import { Alert, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { documentActions, useDispatch, useDocThunkDispatch } from '@lib/store';

import { IDocument } from '@lib/types';

import { SwipeItem } from '@lib/mobile-ui';
import { generateId } from '@lib/mobile-app';

interface IProps {
  children?: ReactNode;
  renderItem: any;
  item: any;
  edit?: boolean;
  copy?: boolean;
  del?: boolean;
  routeName: string;
}

let pressed = -1;

const SwipeListItem = ({ children, item, edit = true, del = true, copy = true, routeName }: IProps) => {
  const navigation = useNavigation() as any;
  const dispatch = useDispatch();
  const docDispatch = useDocThunkDispatch();

  const handleSwipe = useCallback(
    (name: 'edit' | 'copy' | 'delete', id: string, isBlocked?: boolean) => {
      if (name === 'edit') {
        navigation.navigate(routeName, { id });
      } else if (name === 'copy') {
        const newDocDate = new Date().toISOString();

        const newDoc: IDocument = {
          ...item,
          id: generateId(),
          number: 'б\\н',
          status: 'DRAFT',
          documentDate: newDocDate,
          creationDate: newDocDate,
          editionDate: newDocDate,
        };

        dispatch(documentActions.addDocument(newDoc));

        navigation.navigate(routeName, { id: newDoc.id });
      } else if (name === 'delete') {
        if (isBlocked) {
          return Alert.alert('Внимание!', 'Документ не может быть удален', [{ text: 'OK' }]);
        }

        Alert.alert('Вы уверены, что хотите удалить документ?', '', [
          {
            text: 'Да',
            onPress: () => {
              docDispatch(documentActions.removeDocument(id));
            },
          },
          {
            text: 'Отмена',
          },
        ]);
      }
    },
    [dispatch, docDispatch, item, navigation, routeName],
  );

  return (
    <SwipeItem
      onPress={(name) => {
        const delta = new Date().getTime() - pressed;
        if (delta > 2200) {
          pressed = new Date().getTime();
          handleSwipe(name, item.id, item?.status !== 'DRAFT');
        }
      }}
      edit={edit}
      copy={copy}
      del={del}
    >
      <View>{children}</View>
    </SwipeItem>
  );
};

export default SwipeListItem;
