import React, { useCallback, useLayoutEffect } from 'react';
import { Text, View, FlatList } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
  const routeBack = useRoute<RouteProp<OrdersStackParamList, 'OrderView'>>().params?.routeBack;
  const id = useRoute<RouteProp<OrdersStackParamList, 'OrderView'>>().params?.id;

  const order = (docSelectors.selectByDocType('order') as IOrderDocument[])?.find((e) => e.id === id);

  const isBlocked = order?.status !== 'DRAFT';

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

    dispatch(documentActions.removeDocument(id));
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
      headerRight: () =>
        !isBlocked && (
          <View style={styles.buttons}>
            <MenuButton actionsMenu={actionsMenu} />
            <AddButton onPress={handleAddOrderLine} />
          </View>
        ),
    });
  }, [navigation, handleAddOrderLine, actionsMenu, routeBack, isBlocked]);

  if (!order) {
    return (
      <View style={styles.container}>
        <SubTitle style={styles.title}>Документ не найден</SubTitle>
      </View>
    );
  }

  const renderItem = ({ item }: { item: IOrderLine }) => (
    <OrderItem docId={order.id} item={item} readonly={isBlocked} />
  );

  return (
    <View style={[styles.container]}>
      <InfoBlock
        colorLabel={getStatusColor(order?.status || 'DRAFT')}
        title={order.head.outlet?.name}
        onPress={handleEditOrderHead}
        disabled={!['DRAFT', 'READY'].includes(order.status)}
      >
        <View style={styles.rowCenter}>
          <Text>{`№ ${order.number} от ${getDateString(order.documentDate)} на ${getDateString(
            order.head?.onDate,
          )}`}</Text>
          {isBlocked ? <MaterialCommunityIcons name="lock-outline" size={20} /> : null}
        </View>
      </InfoBlock>
      <FlatList
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
