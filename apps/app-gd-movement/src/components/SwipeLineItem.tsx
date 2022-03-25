import React, { ReactNode } from 'react';
import { Alert, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { documentActions, useDispatch } from '@lib/store';

import { SwipeItem } from '@lib/mobile-ui';

interface IProps {
  children?: ReactNode;
  item: any;
  docId: string;
  readonly?: boolean;
  edit?: boolean;
  copy?: boolean;
  del?: boolean;
  routeName: string;
}

const SwipeLineItem = ({ children, docId, item, readonly, edit, copy, del, routeName }: IProps) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleSwipe = (name: 'edit' | 'copy' | 'delete') => {
    if (name === 'edit') {
      navigation.navigate(routeName as never, { mode: 0, docId, item } as never);
    } else if (name === 'delete') {
      Alert.alert('Вы уверены, что хотите удалить позицию?', '', [
        {
          text: 'Да',
          onPress: async () => {
            dispatch(documentActions.removeDocumentLine({ docId, lineId: item.id }));
          },
        },
        {
          text: 'Отмена',
        },
      ]);
    }
  };

  return !readonly ? (
    <SwipeItem onPress={(name) => handleSwipe(name)} edit={edit} copy={copy} del={del}>
      <View>{children}</View>
    </SwipeItem>
  ) : (
    <View>{children}</View>
  );
};

export default SwipeLineItem;
