import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, Text, View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { docSelectors, documentActions, useDocThunkDispatch } from '@lib/store';
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

import { generateId, getDateString } from '@lib/mobile-app';

import { IDocument } from '@lib/types';

import { IOrderDocument, IOrderLine, IOtvesDocument } from '../../store/types';

import { OrderStackParamList } from '../../navigation/Root/types';

import { getStatusColor } from '../../utils/constants';

import SwipeLineItem from '../../components/SwipeLineItem';

import { navBackButton } from '../../components/navigateOptions';

import OrderItem from './components/OrderItem';

const keyExtractor = (item: IOrderLine) => item.id;

const OtvesViewScreen = () => {
  const { colors } = useTheme();
  const showActionSheet = useActionSheet();
  const docDispatch = useDocThunkDispatch();
  const navigation = useNavigation<StackNavigationProp<OrderStackParamList, 'OtvesView'>>();
  const id = useRoute<RouteProp<OrderStackParamList, 'OtvesView'>>().params?.id;

  const textStyle = useMemo(() => [styles.textLow, { color: colors.text }], [colors.text]);

  const [del, setDel] = useState(false);

  const order = docSelectors.selectByDocId<IOtvesDocument>(id);
  console.log('or', order);

  const isBlocked = order?.status !== 'DRAFT';

  const handleAddOrderLine = useCallback(() => {
    navigation.navigate('SelectGroupItem', {
      docId: id,
    });
  }, [navigation, id]);

  const handleEditOrderHead = useCallback(() => {
    navigation.navigate('OrderEdit', { id });
  }, [navigation, id]);

  const handleCopyOrder = useCallback(() => {
    const newDocDate = new Date().toISOString();
    const newId = generateId();

    const newDoc: IDocument = {
      ...order,
      id: newId,
      number: 'б\\н',
      status: 'DRAFT',
      documentDate: newDocDate,
      creationDate: newDocDate,
      editionDate: newDocDate,
    };

    docDispatch(documentActions.addDocument(newDoc));

    navigation.navigate('OrderView', { id: newId });
  }, [order, docDispatch, navigation]);

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
        title: 'Копировать заявку',
        onPress: handleCopyOrder,
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
  }, [showActionSheet, handleAddOrderLine, handleEditOrderHead, handleCopyOrder, handleDelete]);

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

  const renderItem = useCallback(
    ({ item }: { item: IOrderLine }) => (
      <SwipeLineItem docId={order?.id} item={item} readonly={isBlocked} copy={false} routeName="OrderLine">
        <OrderItem docId={order?.id} item={item} readonly={isBlocked} />
      </SwipeLineItem>
    ),
    [isBlocked, order?.id],
  );

  const colorStyle = useMemo(() => colors.primary, [colors.primary]);

  if (del) {
    return (
      <View style={styles.container}>
        <View style={localStyles.del}>
          <SubTitle style={styles.title}>Удаление</SubTitle>
          <ActivityIndicator size="small" color={colorStyle} />
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

  return (
    <View style={[styles.container]}>
      <InfoBlock
        colorLabel={getStatusColor(order?.status || 'DRAFT')}
        title={order.head.outlet?.name}
        onPress={handleEditOrderHead}
        disabled={!['DRAFT', 'READY'].includes(order.status)}
      >
        <View style={localStyles.infoBlock}>
          <Text style={textStyle}>
            {`№ ${order.number} от ${getDateString(order.documentDate)} на ${getDateString(order.head?.onDate)}`}
          </Text>
          <View style={styles.rowCenter}>
            {isBlocked ? <MaterialCommunityIcons name="lock-outline" size={20} /> : null}
          </View>
        </View>
      </InfoBlock>
      <FlatList
        data={order.lines}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        scrollEventThrottle={400}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};

export default OtvesViewScreen;

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
