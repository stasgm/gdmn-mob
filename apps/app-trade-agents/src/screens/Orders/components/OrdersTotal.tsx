import React, { useMemo } from 'react';
import { View, Text, FlatList, SectionListData } from 'react-native';
import { globalStyles as styles, IListItemProps } from '@lib/mobile-ui';
import { docSelectors, refSelectors } from '@lib/store';
import { Divider } from 'react-native-paper';

import { useTheme } from '@react-navigation/native';

import { IGood, IGoodGroup, IOrderDocument, IOrderLine, IOrderTotalLine } from '../../../store/types';

export interface OrderListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<IListItemProps, OrderListSectionProps>[];

export interface IItem {
  orders: SectionListData<IListItemProps, OrderListSectionProps>;
}

const round = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

const OrdersTotal = ({ orders }: IItem) => {
  const { colors } = useTheme();

  const groups = refSelectors.selectByName<IGoodGroup>('goodGroup')?.data;
  const goods = refSelectors.selectByName<IGood>('good')?.data;
  const firstLevelGroups = groups?.filter((item) => !item.parent?.id);

  const ordersList = docSelectors
    .selectByDocType<IOrderDocument>('order')
    ?.filter((e) => e.id === orders.data.find((i) => i.id === e.id)?.id);

  console.log('ord', ordersList);

  const orderLines = ordersList.reduce((prev: IOrderLine[], order) => {
    return [...prev, ...order.lines];
  }, []);

  const totalList: IOrderTotalLine[] = firstLevelGroups
    ?.map((firstGr) => ({
      group: {
        id: firstGr.id,
        name: firstGr.name,
      },
      quantity: orderLines
        .filter((l) =>
          goods.find(
            (g) =>
              g.id === l.good.id &&
              (g.goodgroup.id === firstGr.id ||
                groups.find((group) => group.parent?.id === firstGr.id && group.id === g.goodgroup.id)),
          ),
        )
        .reduce((s: number, line) => {
          return round(s + round(line.quantity));
        }, 0),
    }))
    .filter((i) => i.quantity > 0);

  const textStyle = useMemo(() => [styles.field, { color: colors.text }], [colors.text]);
  const textTotalStyle = useMemo(() => [styles.textTotal, { color: colors.notification }], [colors.notification]);

  const renderTotalItem = ({ item }: { item: IOrderTotalLine }) => (
    <View style={styles.itemNoMargin}>
      <View style={styles.details}>
        {/* <View style={styles.directionRow}> */}
        <Text style={textStyle}>{item.group.name}</Text>
        <View style={styles.directionRow}>
          <Text style={textStyle}>{`Вес: ${item.quantity || 0} кг`}</Text>
          {/* <Text style={textStyle}>{`${item.quantity || 0} кг x ${item.price || 0} р.`}</Text> */}
        </View>
        {/* </View> */}
      </View>
    </View>
  );

  return (
    <View style={styles.total}>
      <Text style={styles.textTotal}>Итого:</Text>
      <Divider />
      <FlatList data={totalList} keyExtractor={(_, i) => String(i)} renderItem={renderTotalItem} />
      <Divider />
      <View style={{ flexDirection: 'row', margin: 3 }}>
        <Text style={styles.textTotal}>Общий вес: </Text>
        <Text style={textStyle}>{totalList?.reduce((prev, item) => prev + item.quantity, 0) || 0} кг</Text>
      </View>
      {/* <Text style={styles.textTotal}>{`Общий вес: ${
        totalList?.reduce((prev, item) => prev + item.quantity, 0) || 0
      } кг`}</Text> */}
      <Divider />
      {/* </View> */}
      {/* <Text style={textStyle}>Количество: {orders.data.length}</Text> */}
      <View style={{ flexDirection: 'column', margin: 5 }}>
        <Text style={textStyle}>Количество принятых заявок: {orders.data.length}</Text>
        <Text style={textStyle}>
          Количество одобренных заявок: {orders.data.filter((i) => i.status === 'PROCESSED').length}
        </Text>
      </View>
    </View>
  );
};

export default OrdersTotal;
