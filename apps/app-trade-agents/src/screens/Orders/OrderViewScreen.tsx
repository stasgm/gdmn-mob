import React, { useCallback, useLayoutEffect, useState } from 'react';
import { Alert, Text, View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { docSelectors, documentActions, refSelectors, useDocThunkDispatch } from '@lib/store';
import {
  AddButton,
  MenuButton,
  useActionSheet,
  globalStyles as styles,
  InfoBlock,
  ItemSeparator,
  SubTitle,
} from '@lib/mobile-ui';

import { sleep } from '@lib/client-api';

import { getDateString } from '@lib/mobile-app';

import { IDebt, IOrderDocument, IOrderLine } from '../../store/types';

import { OrdersStackParamList } from '../../navigation/Root/types';

import { getStatusColor } from '../../utils/constants';

import SwipeLineItem from '../../components/SwipeLineItem';

import { navBackButton } from '../../components/navigateOptions';

import OrderItem from './components/OrderItem';

const OrderViewScreen = () => {
  const { colors } = useTheme();
  const showActionSheet = useActionSheet();
  const docDispatch = useDocThunkDispatch();
  const navigation = useNavigation<StackNavigationProp<OrdersStackParamList, 'OrderView'>>();
  const id = useRoute<RouteProp<OrdersStackParamList, 'OrderView'>>().params?.id;

  const [del, setDel] = useState(false);

  const order = docSelectors.selectByDocId<IOrderDocument>(id);

  const isBlocked = order?.status !== 'DRAFT';

  const debt =
    refSelectors.selectByName<IDebt>('debt').data.find((item) => item.id === order?.head?.contact.id) || undefined;

  const handleAddOrderLine = useCallback(() => {
    navigation.navigate('SelectGroupItem', {
      docId: id,
    });
  }, [navigation, id]);

  const handleEditOrderHead = useCallback(() => {
    navigation.navigate('OrderEdit', { id });
  }, [navigation, id]);

  const handleDelete = useCallback(async () => {
    if (!id) {
      return;
    }

    Alert.alert('Вы уверены, что хотите удалить заявку?', '', [
      {
        text: 'Да',
        onPress: async () => {
          const res = await docDispatch(documentActions.removeDocument(id));
          if (res.type === 'DOCUMENTS/REMOVE_ONE_SUCCESS') {
            setDel(true);
            await sleep(500);
            navigation.goBack();
          }
        },
      },
      {
        text: 'Отмена',
      },
    ]);
  }, [docDispatch, id, navigation]);

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

  const renderRight = useCallback(
    () =>
      !isBlocked && (
        <View style={styles.buttons}>
          <AddButton onPress={handleAddOrderLine} />
          <MenuButton actionsMenu={actionsMenu} />
        </View>
      ),
    [actionsMenu, handleAddOrderLine, isBlocked],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
      headerRight: renderRight,
    });
  }, [navigation, renderRight]);

  if (del) {
    return (
      <View style={styles.container}>
        <View style={localStyles.del}>
          <SubTitle style={styles.title}>Удаление</SubTitle>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      </View>
    );
  } else {
    if (!order) {
      return (
        <View style={styles.container}>
          <SubTitle style={styles.title}>Документ не найден</SubTitle>
        </View>
      );
    }
  }

  const renderItem = ({ item }: { item: IOrderLine }) => (
    <SwipeLineItem docId={order.id} item={item} readonly={isBlocked} copy={false} routeName="OrderLine">
      <OrderItem docId={order.id} item={item} readonly={isBlocked} />
    </SwipeLineItem>
  );

  return (
    <View style={[styles.container]}>
      <InfoBlock
        colorLabel={getStatusColor(order?.status || 'DRAFT')}
        title={order.head.outlet?.name}
        onPress={handleEditOrderHead}
        disabled={!['DRAFT', 'READY'].includes(order.status)}
      >
        <View style={localStyles.infoBlock}>
          <Text style={[styles.textLow, { color: colors.text }]}>{`№ ${order.number} от ${getDateString(
            order.documentDate,
          )} на ${getDateString(order.head?.onDate)}`}</Text>

          <Text style={[styles.textLow, { color: colors.text }]}>
            {(debt?.saldo && debt?.saldo < 0
              ? `Предоплата: ${Math.abs(debt?.saldo)
                  .toString()
                  .replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, '$1' + ' ')}`
              : // : `Задолженность: ${new Intl.NumberFormat('ru-RU').format(Number(debt?.saldo))}`) || 0}
                `Задолженность: ${debt?.saldo.toString().replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, '$1' + ' ')}`) || 0}
          </Text>
          <View style={styles.rowCenter}>
            <Text style={[styles.textLow, { color: colors.text }]}>
              {`Просроченная задолженность: ${debt?.saldoDebt
                .toString()
                .replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, '$1' + ' ')}` || 0}
            </Text>
            {isBlocked ? <MaterialCommunityIcons name="lock-outline" size={20} /> : null}
          </View>
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

const localStyles = StyleSheet.create({
  del: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBlock: {
    flexDirection: 'column',
  },
});
