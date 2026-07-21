import React, { useCallback, useMemo } from 'react';
import { View, FlatList, SectionListData, StyleSheet } from 'react-native';
import { globalStyles as styles, IListItemProps, LargeText, MediumText } from '@lib/mobile-ui';
import { refSelectors, useSelector } from '@lib/store';
import { Divider } from 'react-native-paper';

import { useTheme } from '@react-navigation/native';

import { formatValue, keyExtractorByIndex, round, useFilteredDocList } from '@lib/mobile-hooks';

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

  const settings = useSelector((state) => state.settings.data);
  const isUseRemains = settings?.isUseRemains?.data as boolean;
  const isUseUnitMeasure = (settings?.isUseUnitMeasure?.data ?? true) as boolean;

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
    () => totalListByGroup(firstLevelGroups, groups, orderLines, isUseUnitMeasure, isUseRemains),
    [firstLevelGroups, groups, orderLines, isUseUnitMeasure, isUseRemains],
  );

  const total = useMemo(() => totalList(totalListByOrders), [totalListByOrders]);

  const renderTotalItem = useCallback(
    ({ item }: { item: IOrderTotalLine }) => (
      <View style={styles.itemNoMargin}>
        <View style={styles.details}>
          <View style={styles.directionRow}>
            <View style={localStyles.name}>
              <MediumText>{item.group.name}</MediumText>
            </View>
            <View style={localStyles.values}>
              <MediumText>{formatValue({ type: 'number' }, round(item.weight, 3))} кг</MediumText>
              {!isUseUnitMeasure ? (
                <MediumText>{formatValue({ type: 'number' }, round(item.pieces, 3))} шт</MediumText>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    ),
    [isUseUnitMeasure],
  );

  return (
    <View>
      <Divider style={{ backgroundColor: colors.primary }} />
      {totalListByOrders?.length ? (
        <>
          <View style={[localStyles.margins, styles.directionRow, localStyles.headerRow]}>
            <LargeText style={[styles.textTotal, localStyles.name]}>Итого по группам</LargeText>
            <View style={localStyles.values}>
              <LargeText style={styles.textTotal}>Вес, кг</LargeText>
              {!isUseUnitMeasure ? <LargeText style={styles.textTotal}>Шт</LargeText> : null}
            </View>
          </View>
          <Divider style={{ backgroundColor: colors.primary }} />
          <FlatList
            data={totalListByOrders}
            keyExtractor={keyExtractorByIndex}
            renderItem={renderTotalItem}
            style={localStyles.groupMargin}
          />
          <Divider style={{ backgroundColor: colors.primary }} />
        </>
      ) : null}
      <View style={[styles.directionRow, localStyles.margins]}>
        <LargeText style={styles.textTotal}>Общий вес, кг: </LargeText>
        <MediumText style={styles.textTotal}>
          {formatValue({ type: 'number' }, round(total?.weight || 0, 3))}
        </MediumText>
      </View>
      {!isUseUnitMeasure ? (
        <View style={[styles.directionRow, localStyles.margins]}>
          <LargeText style={styles.textTotal}>Общее количество, шт: </LargeText>
          <MediumText style={styles.textTotal}>
            {formatValue({ type: 'number' }, round(total?.pieces || 0, 3))}
          </MediumText>
        </View>
      ) : null}
      <Divider style={{ backgroundColor: colors.primary }} />
      <View style={[styles.directionColumn, localStyles.margins]}>
        <View style={styles.itemNoMargin}>
          <LargeText style={styles.textTotal}>Принятых заявок: </LargeText>
          <MediumText>{sectionOrders.data?.length}</MediumText>
        </View>
        <View style={styles.itemNoMargin}>
          <LargeText style={styles.textTotal}>Одобренных заявок: </LargeText>
          <MediumText>{sectionOrders.data.filter((i) => i.status === 'PROCESSED')?.length}</MediumText>
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
  headerRow: {
    alignItems: 'center',
  },
  name: {
    flex: 1,
    maxWidth: '80%',
  },
  values: {
    flexDirection: 'row',
    gap: 12,
    minWidth: 80,
    justifyContent: 'flex-end',
  },
});
