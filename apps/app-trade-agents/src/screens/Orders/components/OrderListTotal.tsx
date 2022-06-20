import React, { useMemo } from 'react';
import { View, Text, FlatList, SectionListData, StyleSheet } from 'react-native';
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

const OrderListTotal = ({ orders }: IItem) => {
  const { colors } = useTheme();

  const groups = refSelectors.selectByName<IGoodGroup>('goodGroup')?.data;
  const goods = refSelectors.selectByName<IGood>('good')?.data;
  const firstLevelGroups = groups?.filter((item) => !item.parent?.id);

  const ordersList = docSelectors
    .selectByDocType<IOrderDocument>('order')
    ?.filter((e) => e.id === orders.data.find((i) => i.id === e.id)?.id);

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

  const renderTotalItem = ({ item }: { item: IOrderTotalLine }) => (
    <View style={styles.itemNoMargin}>
      <View style={styles.details}>
        <View style={styles.directionRow}>
          <View style={localStyles.groupWidth}>
            <Text style={textStyle}>{item.group.name}</Text>
          </View>
          <View style={localStyles.quantity}>
            <Text style={textStyle}>{`${item.quantity || 0}`}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View>
      <Divider style={{ backgroundColor: colors.primary }} />
      {totalList.length ? (
        <>
          <View style={[localStyles.margins, localStyles.rowDirection, localStyles.content]}>
            <Text style={styles.textTotal}>Итого:</Text>
            <Text style={styles.textTotal}>Вес (кг)</Text>
          </View>
          <Divider style={{ backgroundColor: colors.primary }} />
          <FlatList
            data={totalList}
            keyExtractor={(_, i) => String(i)}
            renderItem={renderTotalItem}
            style={localStyles.groupMargin}
          />
          <Divider style={{ backgroundColor: colors.primary }} />
        </>
      ) : null}

      <View style={[localStyles.rowDirection, localStyles.margins]}>
        <Text style={styles.textTotal}>Общий вес: </Text>
        <Text style={textStyle}> {totalList?.reduce((prev, item) => prev + (item?.quantity || 0), 0) || 0} кг</Text>
      </View>
      <Divider style={{ backgroundColor: colors.primary }} />
      <View style={[localStyles.columnDirection, localStyles.margins]}>
        <View style={localStyles.rowDirection}>
          <Text style={styles.textTotal}>Количество принятых заявок: </Text>

          <Text style={textStyle}> {orders.data.length}</Text>
        </View>
        <View style={localStyles.rowDirection}>
          <Text style={styles.textTotal}>Количество одобренных заявок: </Text>
          <Text style={textStyle}> {orders.data.filter((i) => i.status === 'PROCESSED').length}</Text>
        </View>
      </View>
    </View>
  );
};

export default OrderListTotal;

const localStyles = StyleSheet.create({
  rowDirection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  columnDirection: {
    flexDirection: 'column',
  },
  margins: {
    marginHorizontal: 8,
    marginVertical: 5,
  },
  content: {
    justifyContent: 'space-between',
  },
  groupWidth: {
    width: '80%',
  },
  groupMargin: {
    marginHorizontal: 5,
  },
  quantity: {
    alignItems: 'flex-end',
    width: '15%',
  },
});
