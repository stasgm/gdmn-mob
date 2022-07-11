import React, { useCallback, useMemo } from 'react';
import { View, FlatList, SectionListData, StyleSheet } from 'react-native';
import { globalStyles as styles, IListItemProps, MediumText } from '@lib/mobile-ui';
import { refSelectors } from '@lib/store';
import { Divider } from 'react-native-paper';

import { useTheme } from '@react-navigation/native';

import { formatValue, round, useFilteredDocList } from '@lib/mobile-app';

import { IGoodGroup, IOrderDocument, IOrderLine, IOrderTotalLine } from '../../../store/types';
import { totalList, totalListByGroup } from '../../../utils/helpers';

export interface OrderListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<IListItemProps, OrderListSectionProps>[];

export interface IItem {
  sectionOrders: SectionListData<IListItemProps, OrderListSectionProps>;
}

const OrderListTotal = ({ sectionOrders }: IItem) => {
  const { colors } = useTheme();

  const groups = refSelectors.selectByName<IGoodGroup>('goodGroup')?.data;
  const firstLevelGroups = groups?.filter((item) => !item.parent?.id);
  const orders = useFilteredDocList<IOrderDocument>('order');

  const orderLines = useMemo(() => {
    return orders?.reduce((prev: IOrderLine[], order) => {
      if (sectionOrders.data.find((i) => i.id === order.id) !== undefined) {
        prev = [...prev, ...order.lines];
      }
      return prev;
    }, []);
  }, [sectionOrders.data, orders]);

  const totalListByOrders = useMemo(
    () => totalListByGroup(firstLevelGroups, groups, orderLines),
    [firstLevelGroups, groups, orderLines],
  );

  const total = useMemo(() => totalList(totalListByOrders), [totalListByOrders]);

  const renderTotalItem = useCallback(
    ({ item }: { item: IOrderTotalLine }) => (
      <View style={styles.itemNoMargin}>
        <View style={styles.details}>
          <View style={styles.directionRow}>
            <View style={styles.groupWidth}>
              <MediumText>{item.group.name}</MediumText>
            </View>
            <View style={localStyles.quantity}>
              <MediumText>{formatValue({ type: 'number', decimals: 3 }, round(item.quantity, 3))}</MediumText>
            </View>
          </View>
        </View>
      </View>
    ),
    [],
  );

  return (
    <View>
      <Divider style={{ backgroundColor: colors.primary }} />
      {totalListByOrders.length ? (
        <>
          <View style={[localStyles.margins, styles.rowCenter]}>
            <MediumText style={styles.textTotal}>Итого вес, кг.:</MediumText>
          </View>
          <Divider style={{ backgroundColor: colors.primary }} />
          <FlatList
            data={totalListByOrders}
            keyExtractor={(_, i) => String(i)}
            renderItem={renderTotalItem}
            style={localStyles.groupMargin}
          />
          <Divider style={{ backgroundColor: colors.primary }} />
        </>
      ) : null}
      <View style={[styles.directionRow, localStyles.margins]}>
        <MediumText style={styles.textTotal}>Общий вес, кг.: </MediumText>
        <MediumText style={styles.textTotal}>
          {formatValue({ type: 'number', decimals: 3 }, round(total?.quantity, 3))}
        </MediumText>
      </View>
      <Divider style={{ backgroundColor: colors.primary }} />
      <View style={[styles.directionColumn, localStyles.margins]}>
        <View style={styles.itemNoMargin}>
          <MediumText style={styles.textTotal}>Количество принятых заявок: </MediumText>
          <MediumText>{sectionOrders.data.length}</MediumText>
        </View>
        <View style={styles.itemNoMargin}>
          <MediumText style={styles.textTotal}>Количество одобренных заявок: </MediumText>
          <MediumText>{sectionOrders.data.filter((i) => i.status === 'PROCESSED').length}</MediumText>
        </View>
      </View>
    </View>
  );
};

export default OrderListTotal;

const localStyles = StyleSheet.create({
  margins: {
    marginHorizontal: 8,
    marginVertical: 5,
  },
  groupMargin: {
    marginHorizontal: 5,
  },
  quantity: {
    alignItems: 'flex-end',
    // width: '25%',
  },
});
