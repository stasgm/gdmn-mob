import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { globalStyles as styles } from '@lib/mobile-ui';
import { docSelectors, refSelectors } from '@lib/store';
import { Divider, useTheme } from 'react-native-paper';

import { IGood, IGoodGroup, IOrderDocument, IOrderLine, IRouteTotalLine } from '../../../store/types';

export interface IItem {
  routeId: string;
}

const RouteTotal = ({ routeId }: IItem) => {
  const { colors } = useTheme();

  const round = (num: number) => {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  };

  const groups = refSelectors.selectByName<IGoodGroup>('goodGroup').data;
  const goods = refSelectors.selectByName<IGood>('good').data;
  const firstLevelGroups = groups.filter((item) => !item.parent);

  const orders = docSelectors.selectByDocType<IOrderDocument>('order')?.filter((e) => e.head.route?.id === routeId);

  const orderLines = orders.reduce((prev: IOrderLine[], order) => {
    return [...prev, ...order.lines];
  }, []);

  const totalList: IRouteTotalLine[] = firstLevelGroups.map((firstGr) => ({
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
      .reduce(
        (s: number, line) =>
          round(s + round(line.quantity * (goods.find((g) => g.id === line.good.id)?.invWeight || 1))),
        0,
      ),
  }));
  // const totalList: IRouteTotalLine[] = firstLevelGroups.map((firstGr) => ({
  //   group: {
  //     id: firstGr.id,
  //     name: firstGr.name,
  //   },
  //   quantity: groups
  //     .filter((group) => group.parent?.id === firstGr.id)
  //     .reduce(
  //       (prev: number, item) =>
  //         round(
  //           prev +
  //             orderLines
  //               .filter((l) => goods.find((g) => g.id === l.good.id && g.goodgroup.id === item.id))
  //               .reduce(
  //                 (s: number, line) =>
  //                   s + round(line.quantity * (goods.find((g) => g.id === line.good.id)?.invWeight || 1)),
  //                 0,
  //               ),
  //         ),
  //       0,
  //     ),
  // }));

  const renderTotalItem = ({ item }: { item: IRouteTotalLine }) => (
    <View style={styles.item}>
      <View style={styles.details}>
        <View style={styles.directionRow}>
          <Text style={[styles.field, { color: colors.text }]}>{item.group.name}</Text>
          <View style={styles.directionRow}>
            <Text style={[styles.field, { color: colors.text }]}>{item.quantity}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.total}>
      <Text style={styles.textTotal}>Итого вес, кг.:</Text>
      <Divider />
      <FlatList data={totalList} keyExtractor={(_, i) => String(i)} renderItem={renderTotalItem} />
      <Divider />
      <View style={styles.bottomTotal}>
        <Text style={[styles.textTotal, styles.colorRed]}>
          {totalList.reduce((prev, item) => prev + item.quantity, 0)}
        </Text>
      </View>
    </View>
  );
};

export default RouteTotal;