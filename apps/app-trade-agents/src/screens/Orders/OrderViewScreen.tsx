import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Text, View, FlatList, TouchableOpacity, ScrollView, Switch, StyleSheet } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Animatable from 'react-native-animatable';
import Accordion from 'react-native-collapsible/Accordion';


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
  SelectableInput,
  Input,
  PrimeButton,
} from '@lib/mobile-ui';

import { IOrderDocument, IOrderLine } from '../../store/docs/types';

import { getDateString } from '../../utils/helpers';

import { OrdersStackParamList } from '../../navigation/Root/types';

import { getStatusColor } from '../../utils/constants';

import OrderItem from './components/OrderItem';
import { Divider, List } from 'react-native-paper';
import Collapsible from 'react-native-collapsible';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ISelector {
  title: string;
  value: number
}

const OrderViewScreen = () => {
  const showActionSheet = useActionSheet();
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<OrdersStackParamList, 'OrderView'>>();
  const { id, routeBack } = useRoute<RouteProp<OrdersStackParamList, 'OrderView'>>().params;

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

  const renderItem = ({ item }: { item: IOrderLine }) => <OrderItem key={item.id} docId={order.id} item={item} />;

  const DocField = (item: { label: string; value: string; noDivider?: boolean; noEdit?: boolean }) => {
    return (
      <>
        <View style={styles.item}>
          <View style={[styles.details, { margin: 0 }]}>
            <Text style={[styles.name, { color: '#333' }]}>{item.label}</Text>
            <Text style={[styles.number, styles.field]}>{item.value}</Text>
          </View>
          {!item.noEdit ? <MaterialCommunityIcons name="chevron-right" size={25} color='#444' /> : null}
        </View>
        {!item.noDivider ? <ItemSeparator /> : null}
      </>
    )
  }

  const [collapsed, setCollapsed] = useState<number[]>([]);

  return (
    <View style={localStyles.container}>
      <ScrollView>
        <View>
          <TouchableOpacity style={localStyles.header} onPress={() => setCollapsed(collapsed.find(i => i === 1) ? collapsed.filter(i => i !== 1) : [...collapsed, 1])}>
            <MaterialCommunityIcons name={!collapsed.includes(1) ? "chevron-up" : "chevron-down"} size={25} />
            <Text style={localStyles.headerText}>Информация о заявке</Text>
          </TouchableOpacity>
          <Collapsible collapsed={collapsed.includes(1)}>
            <View style={styles.details}>
              <DocField
                label="Организация"
                value={order.head.contact.name}
              />
              <DocField label="Магазин" value={order.head.outlet.name} />
              <DocField
                label="Дата отгрузки"
                value={getDateString(order.head.onDate || '')}
                noDivider={true}
              />
            </View>
          </Collapsible>
        </View>
        <View>
          <TouchableOpacity style={localStyles.header} onPress={() => setCollapsed(collapsed.find(i => i === 2) ? collapsed.filter(i => i !== 2) : [...collapsed, 2])}>
            <MaterialCommunityIcons name={!collapsed.includes(2) ? "chevron-up" : "chevron-down"} size={25} />
            <Text style={localStyles.headerText}>Товары</Text>
          </TouchableOpacity>
          <Collapsible collapsed={collapsed.includes(2)}>
            <View style={styles.details}>
              {order.lines.map(i => renderItem({ item: i }))}
            </View>
            <View style={styles.flexDirectionRow}>
              <PrimeButton icon="plus-circle" style={styles.flexGrow} onPress={handleAddOrderLine} outlined>Добавить</PrimeButton>
              <PrimeButton icon="barcode-scan" style={styles.flexGrow} onPress={handleAddOrderLine} outlined>Штрихкод</PrimeButton>
            </View>
          </Collapsible>
        </View>
        <View>
          <TouchableOpacity style={localStyles.header} onPress={() => setCollapsed(collapsed.find(i => i === 3) ? collapsed.filter(i => i !== 3) : [...collapsed, 3])}>
            <MaterialCommunityIcons name={!collapsed.includes(3) ? "chevron-up" : "chevron-down"} size={25} />
            <Text style={localStyles.headerText}>Детали заявки</Text>
          </TouchableOpacity>
          <Collapsible collapsed={collapsed.includes(3)}>
            <View style={styles.details}>
              <DocField label="Номер документа" value={order.number} noEdit />
              <DocField label="Дата документа" value={order.documentDate} noEdit />
              <DocField label="Склад-магазин" value={order.head.depart?.name || ''} />
              <DocField label="Принял" value="Наталья гоцелюк" noEdit noDivider={true}
              />
            </View>
          </Collapsible>
        </View>
        <PrimeButton icon="minus-circle" onPress={handleDelete}>Удалить документ</PrimeButton>
      </ScrollView>
    </View >
  );
};

export default OrderViewScreen;

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    // justifyContent: '',
    backgroundColor: 'rgba(225,225,225,1)',
    paddingHorizontal: 10,
    alignItems: 'center',
    paddingVertical: 3
  },
  headerText: {
    width: '90%',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});
