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

import { IOrderDocument, IOrderLine } from '../../store/docs/types';

import { getDateString } from '../../utils/helpers';

import { OrdersStackParamList } from '../../navigation/Root/types';

import OrderItem from './components/OrderItem';

const OrderViewScreen = () => {
  const id = useRoute<RouteProp<OrdersStackParamList, 'OrderView'>>().params?.id;
  const routeBack = useRoute<RouteProp<OrdersStackParamList, 'OrderView'>>().params?.routeBack;

  const navigation = useNavigation();
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();
  const ref = useRef<FlatList<IOrderLine>>(null);

  const handleAddOrderLine = useCallback(() => {
    navigation.navigate('SelectGroupItem', {
      docId: id,
    });
  }, [navigation, id]);

  const handleEditOrderHead = useCallback(() => {
    navigation.navigate('OrderEdit', { id });
  }, [navigation, id]);

  const handleDelete = useCallback(() => {
    if (id) {
      dispatch(documentActions.deleteDocument(id));
      navigation.goBack();
    }
  }, [dispatch, id, navigation]);

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Добавить товар',
        onPress: handleAddOrderLine,
      },
      {
        title: 'Редактировать данные',
        onPress: handleEditOrderHead,
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
  }, [showActionSheet, handleAddOrderLine, handleDelete, handleEditOrderHead]);

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
          <AddButton onPress={handleAddOrderLine} />
        </View>
      ),
    });
  }, [navigation, handleAddOrderLine, actionsMenu, routeBack]);

  const order = (docSelectors.selectByDocType('order') as IOrderDocument[])?.find((e) => e.id === id);

  if (!order) {
    return (
      <View style={styles.container}>
        <SubTitle style={styles.title}>Заказ не найден</SubTitle>
      </View>
    );
  }

  const renderItem = ({ item }: { item: IOrderLine }) => <OrderItem docId={order.id} item={item} />;

  return (
    <View style={[styles.container]}>
      <TouchableOpacity onPress={handleEditOrderHead}>
        <InfoBlock colorLabel="#4479D4" title={order?.head.outlet.name}>
          <>
            <Text>{order.number}</Text>
            <Text>{getDateString(order.head.onDate)}</Text>
          </>
        </InfoBlock>
      </TouchableOpacity>
      <FlatList
        ref={ref}
        data={order.lines}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        scrollEventThrottle={400}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};

export default OrderViewScreen;
