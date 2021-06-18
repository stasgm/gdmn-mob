import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { docSelectors, documentActions, useDispatch } from '@lib/store';
import {
  AddButton,
  BackButton,
  MenuButton,
  useActionSheet,
  globalStyles as styles,
  InfoBlock,
  ItemSeparator,
  SubTitle,
} from '@lib/mobile-ui';

import { IReturnDocument, IReturnLine } from '../../store/docs/types';

import { getDateString } from '../../utils/helpers';

import { ReturnsStackParamList } from '../../navigation/Root/types';

import ReturnItem from './components/ReturnItem';

const ReturnViewScreen = () => {
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<ReturnsStackParamList, 'ReturnView'>>();
  const { id, routeBack } = useRoute<RouteProp<ReturnsStackParamList, 'ReturnView'>>().params;

  const ref = useRef<FlatList<IReturnLine>>(null);

  const handleAddReturnLine = useCallback(() => {
    navigation.navigate('SelectItemReturn', {
      docId: id,
      name: 'good',
    });

    /*     navigation.navigate('SelectRefItem', {
          refName: 'good',
          fieldName: 'good',
        }); */
  }, [id, navigation]);

  const handleDelete = useCallback(() => {
    if (!id) {
      return;
    }

    dispatch(documentActions.deleteDocument(id));
    navigation.goBack();
  }, [dispatch, id, navigation]);

  const handleEditReturnHead = useCallback(() => {
    navigation.navigate('ReturnEdit', { id });
  }, [navigation, id]);

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Добавить товар',
        onPress: handleAddReturnLine,
      },
      {
        title: 'Редактировать данные',
        onPress: handleEditReturnHead,
      },
      {
        title: 'Удалить возврат',
        type: 'destructive',
        onPress: handleDelete,
      },
      {
        title: 'Отмена',
        type: 'cancel',
      },
    ]);
  }, [showActionSheet, handleAddReturnLine, handleEditReturnHead, handleDelete]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton onPress={routeBack ? () => navigation.navigate(routeBack) : undefined} />,
      headerRight: () => (
        <View style={styles.buttons}>
          <MenuButton actionsMenu={actionsMenu} />
          <AddButton onPress={handleAddReturnLine} />
        </View>
      ),
    });
  }, [navigation, handleAddReturnLine, routeBack, actionsMenu]);

  const returnDoc = (docSelectors.selectByDocType('return') as IReturnDocument[])?.find((e) => e.id === id);

  if (!returnDoc) {
    return (
      <View style={styles.container}>
        <SubTitle style={styles.title}>Заказ не найден</SubTitle>
      </View>
    );
  }

  const renderItem = ({ item }: { item: IReturnLine }) => <ReturnItem docId={returnDoc.id} item={item} />;

  return (
    <View style={[styles.container]}>
      <TouchableOpacity onPress={handleEditReturnHead}>
        <InfoBlock colorLabel="#3914AF" title={returnDoc?.head.outlet.name}>
          <>
            <Text>{returnDoc.number}</Text>
            <Text>{getDateString(returnDoc.documentDate)}</Text>
          </>
        </InfoBlock>
      </TouchableOpacity>
      <FlatList
        ref={ref}
        data={returnDoc.lines}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        scrollEventThrottle={400}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};

export default ReturnViewScreen;
