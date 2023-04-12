import React from 'react';
import { View, SectionListData, StyleSheet, FlatList } from 'react-native';
import {
  globalColors,
  globalStyles as styles,
  IListItemProps,
  ItemSeparator,
  LargeText,
  MediumText,
} from '@lib/mobile-ui';

import { formatValue, keyExtractorByIndex, round } from '@lib/mobile-hooks';

import { IReportItem, IReportTotalLine } from '../../../store/types';

export interface OrderListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<IListItemProps, OrderListSectionProps>[];

const getTotalData = (items: IReportItem[]) => {
  let totalSum = 0;
  const lines = items?.reduce((prev: IReportTotalLine[], cur) => {
    cur.totalList?.forEach((totalByPackage) => {
      const index = prev.findIndex((i) => totalByPackage.package.id === i.package.id);
      totalSum = totalSum + totalByPackage.quantity;
      if (index > -1) {
        prev[index] = { ...prev[index], quantity: prev[index].quantity + totalByPackage.quantity };
      } else {
        prev = [...prev, totalByPackage];
      }
    });

    return prev;
  }, []);

  return { lines, totalSum };
};

const renderTotalItem = ({ item }: { item: IReportTotalLine }) => (
  <View style={styles.itemNoMargin}>
    <View style={styles.details}>
      <View style={styles.directionRow}>
        <View style={localStyles.name}>
          <MediumText>{item.package.name}</MediumText>
        </View>
        <View style={localStyles.quantity}>
          <MediumText>{formatValue({ type: 'number' }, round(item.quantity, 3))}</MediumText>
        </View>
      </View>
    </View>
  </View>
);

export const ReportTotalByDate = ({ data, title }: { data: IReportItem[]; title: string }) => {
  const total = getTotalData(data);

  return (
    <View>
      <ItemSeparator />
      <View style={[styles.directionRow, localStyles.margins]}>
        <LargeText style={styles.textTotal}>{`Итого за ${title}, кг: `}</LargeText>
        <MediumText style={styles.textTotal}>{formatValue({ type: 'number' }, round(total.totalSum, 3))}</MediumText>
      </View>
      <ItemSeparator />
      <FlatList
        data={total.lines}
        keyExtractor={keyExtractorByIndex}
        renderItem={renderTotalItem}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};

export const ReportTotal = ({ data }: { data: IReportItem[] }) => {
  const total = getTotalData(data);

  return (
    <View style={{ backgroundColor: globalColors.backgroundLight }}>
      <View style={[styles.directionRow, localStyles.margins, { backgroundColor: globalColors.backgroundLight }]}>
        <LargeText style={styles.textTotal}>Общий вес, кг: </LargeText>
        <MediumText style={styles.textTotal}>{formatValue({ type: 'number' }, round(total.totalSum, 3))}</MediumText>
      </View>
      <ItemSeparator />
      <FlatList
        data={total.lines}
        keyExtractor={keyExtractorByIndex}
        renderItem={renderTotalItem}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};

const localStyles = StyleSheet.create({
  margins: {
    marginHorizontal: 5,
    marginVertical: 5,
  },
  name: {
    flex: 1,
    maxWidth: '80%',
  },
  quantity: {
    flex: undefined,
  },
});
