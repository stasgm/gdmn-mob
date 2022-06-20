import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { globalStyles as styles } from '@lib/mobile-ui';
import { docSelectors, refSelectors } from '@lib/store';
import { Divider } from 'react-native-paper';

import { useTheme } from '@react-navigation/native';

import { IGood, IGoodGroup, IOrderDocument, IOrderLine, IOrderTotalLine } from '../../../store/types';

export interface IItem {
  orderId: string;
}

const round = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

const OrderTotal = ({ orderId }: IItem) => {
  const { colors } = useTheme();

  const groups = refSelectors.selectByName<IGoodGroup>('goodGroup')?.data;
  const goods = refSelectors.selectByName<IGood>('good')?.data;
  const firstLevelGroups = groups?.filter((item) => !item.parent?.id);

  const orders = docSelectors.selectByDocType<IOrderDocument>('order')?.filter((e) => e.id === orderId);

  const orderLines = orders.reduce((prev: IOrderLine[], order) => {
    return [...prev, ...order.lines];
  }, []);

  const totalList: IOrderTotalLine[] = firstLevelGroups
    ?.map((firstGr) => ({
      group: {
        id: firstGr.id,
        name: firstGr.name,
      },
      quantity: orderLines
        ?.filter((l) =>
          goods.find(
            (g) =>
              g.id === l.good.id &&
              (g.goodgroup.id === firstGr.id ||
                groups.find((group) => group.parent?.id === firstGr.id && group.id === g.goodgroup.id)),
          ),
        )
        ?.reduce((s: number, line) => {
          return round(s + round(line.quantity));
        }, 0),
      price: orderLines
        ?.filter((l) =>
          goods.find(
            (g) =>
              g.id === l.good.id &&
              (g.goodgroup.id === firstGr.id ||
                groups.find((group) => group.parent?.id === firstGr.id && group.id === g.goodgroup.id)),
          ),
        )
        ?.reduce((s: number, line) => {
          return round(s + round(line.good.priceFsn));
        }, 0),
    }))
    .filter((i) => i.quantity > 0);

  const totalQuantity = orderLines
    ?.map((i) => (i.quantity / (i.good.invWeight || 1)) * i.good.priceFsn)
    ?.reduce((sum: number, a) => {
      return round(sum + a);
    });

  const textStyle = useMemo(() => [styles.field, { color: colors.text }], [colors.text]);

  const renderTotalItem = ({ item }: { item: IOrderTotalLine }) => (
    <View style={styles.itemNoMargin}>
      <View style={styles.details}>
        <View style={styles.directionRow}>
          <View style={localStyles.groupWidth}>
            <Text style={textStyle}>{item.group.name}</Text>
          </View>
          <View style={localStyles.quantity}>
            <Text style={textStyle}>{`${item.quantity || 0} кг x ${item.price || 0} р.`}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View>
      {totalList.length ? (
        <View style={[localStyles.margins, localStyles.total]}>
          <Text style={styles.textTotal}>Итого:</Text>
          <Text style={styles.textTotal}>Вес {' x '} стоимость:</Text>
        </View>
      ) : null}
      <Divider style={{ backgroundColor: colors.primary }} />
      <FlatList
        data={totalList}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderTotalItem}
        style={localStyles.groupMargin}
      />
      <Divider style={{ backgroundColor: colors.primary }} />
      <View style={[localStyles.margins]}>
        <View style={localStyles.content}>
          <Text style={styles.textTotal}>
            {round(totalList?.reduce((prev, item) => prev + round(item?.quantity || 0), 0)) || 0} кг х{' '}
            {round(totalList?.reduce((prev, item) => prev + round(item?.price || 0), 0)) || 0} р.
          </Text>
        </View>
        <View style={localStyles.sum}>
          <Text style={styles.textTotal}>Сумма: </Text>
          <Text style={textStyle}>{round(totalQuantity)} р.</Text>
        </View>
      </View>
    </View>
  );
};

export default OrderTotal;

const localStyles = StyleSheet.create({
  margins: {
    marginHorizontal: 8,
    marginVertical: 5,
  },
  content: {
    alignItems: 'flex-end',
  },
  groupWidth: {
    width: '60%',
  },
  groupMargin: {
    marginHorizontal: 5,
  },
  quantity: {
    alignItems: 'flex-end',
    width: '35%',
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  sum: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 2,
  },
});
