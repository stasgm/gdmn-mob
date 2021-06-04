import { ItemSeparator, SubTitle } from '@lib/mobile-ui/src/components';
import { docSelectors, documentActions, useDispatch } from '@lib/store';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { View, FlatList } from 'react-native';
import { Divider } from 'react-native-paper';

import { AddButton, BackButton, MenuButton, useActionSheet, globalStyles as styles } from '@lib/mobile-ui';

import { OrdersStackParamList } from '../../navigation/Root/types';
import { IOrderDocument, IOrderLine } from '../../store/docs/types';

import OrderItem from './components/OrderItem';
import Header from './components/Header';

const OrderViewScreen = () => {
  const id = useRoute<RouteProp<OrdersStackParamList, 'OrderView'>>().params?.id;

  const navigation = useNavigation();
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();
  const ref = useRef<FlatList<IOrderLine>>(null);

  const handleAddOrderLine = useCallback(() => {
    navigation.navigate('SelectItem', {
      docId: id,
      name: 'good',
    });
  }, [navigation, id]);

  const handleDelete = useCallback(() => {
    if (id) {
      dispatch(documentActions.deleteDocument(id));
      navigation.navigate('OrderList');
    }
  }, [dispatch, id, navigation]);

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Добавить',
        onPress: handleAddOrderLine,
      },
      {
        title: 'Редактировать',
        // onPress: handleAddOrderLine,
      },
      {
        title: 'Удалить',
        type: 'destructive',
        onPress: handleDelete,
      },
    ]);
  }, [showActionSheet, handleAddOrderLine, handleDelete]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
      headerRight: () => (
        <View style={styles.buttons}>
          <MenuButton actionsMenu={actionsMenu} />
          <AddButton onPress={handleAddOrderLine} />
        </View>
      ),
    });
  }, [navigation, handleAddOrderLine, actionsMenu]);

  const order = (docSelectors.selectByDocType('order') as unknown as IOrderDocument[])?.find((e) => e.id === id);

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
      <Header item={order} />
      <Divider />
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
