import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
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

import { IconButton } from 'react-native-paper';

import { IReturnDocument, IReturnLine } from '../../store/docs/types';

import { getDateString } from '../../utils/helpers';

import { ReturnsStackParamList } from '../../navigation/Root/types';

import ReturnItem from './components/ReturnItem';

const ReturnViewScreen = () => {
  const id = useRoute<RouteProp<ReturnsStackParamList, 'ReturnView'>>().params?.id;
  const routeBack = useRoute<RouteProp<ReturnsStackParamList, 'ReturnView'>>().params?.routeBack;

  const navigation = useNavigation();
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();
  const ref = useRef<FlatList<IReturnLine>>(null);

  const handleAddReturnLine = useCallback(() => {
    navigation.navigate('SelectItemReturn', {
      docId: id,
      name: 'good',
    });
  }, [navigation, id]);

  const handleDelete = useCallback(() => {
    if (id) {
      dispatch(documentActions.deleteDocument(id));
      navigation.goBack();
    }
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
        title: 'Удалить заявку',
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
      headerLeft: () =>
        routeBack ? (
          <IconButton icon="chevron-left" onPress={() => navigation.navigate(routeBack)} size={30} />
        ) : (
          <BackButton />
        ),
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
