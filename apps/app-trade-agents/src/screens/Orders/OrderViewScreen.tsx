import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

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

import { IOrderDocument, IOrderLine } from '../../store/docs/types';

import { getDateString } from '../../utils/helpers';

import { OrdersStackParamList } from '../../navigation/Root/types';

import { getStatusColor } from '../../utils/constants';

import OrderItem from './components/OrderItem';

const OrderViewScreen = () => {
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<OrdersStackParamList, 'OrderView'>>();
  const { id, routeBack } = useRoute<RouteProp<OrdersStackParamList, 'OrderView'>>().params;

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
    if (!id) {
      return;
    }

    dispatch(documentActions.deleteDocument(id));
    navigation.goBack();
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
      headerLeft: () => <BackButton onPress={routeBack ? () => navigation.navigate(routeBack) : undefined} />,
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
        <InfoBlock colorLabel={getStatusColor(order?.status || 'DRAFT')} title={order?.head.outlet.name}>
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
