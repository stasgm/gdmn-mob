import React, { useMemo } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { globalStyles as styles, ItemSeparator, MediumText } from '@lib/mobile-ui';
import { refSelectors } from '@lib/store';
import { Divider } from 'react-native-paper';

import { useTheme } from '@react-navigation/native';

import { formatValue, round } from '@lib/mobile-app';

import { IGoodGroup, IOrderDocument, IOrderTotalLine } from '../../../store/types';
import { totalList, totalListByGroup } from '../../../utils/helpers';

export interface IItem {
  order: IOrderDocument;
}

const OrderTotal = ({ order }: IItem) => {
  console.log('OrderTotal');
  const { colors } = useTheme();

  const groups = refSelectors.selectByName<IGoodGroup>('goodGroup')?.data;
  const firstLevelGroups = groups?.filter((item) => !item.parent?.id);

  const totalListByOrder = useMemo(
    () => totalListByGroup(firstLevelGroups, groups, order.lines),
    [firstLevelGroups, groups, order.lines],
  );

  const total = useMemo(() => totalList(totalListByOrder), [totalListByOrder]);

  const renderTotalItem = ({ item }: { item: IOrderTotalLine }) => (
    <View style={styles.itemNoMargin}>
      <View style={styles.details}>
        <View style={styles.directionRow}>
          <View style={localStyles.groupWidth}>
            <MediumText>{item.group.name}</MediumText>
          </View>
          <View style={localStyles.quantity}>
            <MediumText>{`${formatValue({ type: 'number', decimals: 3 }, round(item.quantity, 3))} кг. /`}</MediumText>
            <MediumText>{`${formatValue({ type: 'currency', decimals: 2 }, round(item.s, 2))}`}</MediumText>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View>
      {totalList.length ? (
        <View style={[localStyles.margins, localStyles.total]}>
          <MediumText style={styles.textTotal}>Итого:</MediumText>
          <MediumText style={styles.textTotal}>вес {' / '} сумма:</MediumText>
        </View>
      ) : null}
      <Divider style={{ backgroundColor: colors.primary }} />
      <FlatList
        data={totalListByOrder}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderTotalItem}
        style={localStyles.groupMargin}
        ItemSeparatorComponent={ItemSeparator}
      />
      <Divider style={{ backgroundColor: colors.primary }} />
      <View style={[localStyles.margins]}>
        <View style={localStyles.content}>
          <MediumText style={styles.textTotal}>
            {formatValue({ type: 'number', decimals: 3 }, round(total.quantity, 3))} кг. /{' '}
            {formatValue({ type: 'currency', decimals: 2 }, round(total.s, 2))}
          </MediumText>
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
    width: '62%',
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
});
