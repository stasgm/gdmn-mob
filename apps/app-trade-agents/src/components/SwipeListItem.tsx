import React, { ReactNode } from 'react';
import { v4 as uuid } from 'uuid';
import { Alert, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { documentActions, useDispatch } from '@lib/store';

import { IDocument } from '@lib/types';

import { SwipeItem } from '@lib/mobile-ui';

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

  const handleSwipe = (name: 'edit' | 'copy' | 'delete', id: string, isBlocked?: boolean) => {
    if (name === 'edit') {
      navigation.navigate(routeName as never, { id } as never);
    } else if (name === 'copy') {
      const newDocDate = new Date().toISOString();

      const newDoc: IDocument = {
        ...item,
        id: uuid(),
        number: 'б\\н',
        status: 'DRAFT',
        documentDate: newDocDate,
        creationDate: newDocDate,
        editionDate: newDocDate,
      };

      dispatch(documentActions.addDocument(newDoc));

      navigation.navigate(routeName as never, { id: newDoc.id } as never);
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
      onPress={(name) => handleSwipe(name, item.id, item?.status !== 'DRAFT')}
      edit={edit}
      copy={copy}
      del={del}
    >
      <View>{children}</View>
    </SwipeItem>
  );
};

export default SwipeListItem;
