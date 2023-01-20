import React, { useCallback, useMemo } from 'react';
import { View, SectionListData, StyleSheet, FlatList } from 'react-native';
import {
  globalColors,
  globalStyles as styles,
  IListItemProps,
  ItemSeparator,
  LargeText,
  MediumText,
} from '@lib/mobile-ui';

import { keyExtractorByIndex, round } from '@lib/mobile-hooks';

import { useTheme } from '@react-navigation/native';

import { Divider } from 'react-native-paper';

import { IReportTotalLine } from '../../../store/types';

import { IReportItem } from './ReportItem';

export interface OrderListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<IListItemProps, OrderListSectionProps>[];

export interface IItem {
  reports: IReportItem[];
}

const ReportListTotal = ({ reports }: IItem) => {
  const { colors } = useTheme();

  const reportLines = useMemo(() => {
    return reports?.reduce((prev: IReportTotalLine[], report) => {
      if (report.goodGuantity) {
        prev = [...prev, ...report.goodGuantity];
      }
      return prev;
    }, []);
  }, [reports]);

  const newRep = reportLines.reduce((prev: IReportTotalLine[], cur) => {
    const iss = prev.find((i) => cur.package.id === i.package.id);
    if (iss) {
      const index = prev.indexOf(iss);
      prev[index] = { ...prev[index], quantity: prev[index].quantity + cur.quantity };
    } else {
      prev = [...prev, cur];
    }

    return prev;
  }, []);
  const total = useMemo(
    () =>
      newRep.reduce(
        (prev, item) => ({
          quantity: prev.quantity + (item.quantity || 0),
        }),
        {
          quantity: 0,
        },
      ),
    [newRep],
  );

  const renderTotalItem = useCallback(
    ({ item }: { item: IReportTotalLine }) => (
      <View style={styles.itemNoMargin}>
        <View style={styles.details}>
          <View style={styles.directionRow}>
            <View style={styles.groupWidth}>
              <MediumText>{item.package.name}</MediumText>
            </View>
            <View style={localStyles.quantity}>
              <MediumText>{round(item.quantity, 3)}</MediumText>
            </View>
          </View>
        </View>
      </View>
    ),
    [],
  );

  return (
    <View style={{ backgroundColor: globalColors.backgroundLight }}>
      <View style={[styles.directionRow, localStyles.margins, { backgroundColor: globalColors.backgroundLight }]}>
        <LargeText style={styles.textTotal}>Общий вес, кг: </LargeText>
        <MediumText style={styles.textTotal}>{round(total?.quantity, 3)}</MediumText>
      </View>
      <Divider style={{ backgroundColor: colors.primary }} />
      <FlatList
        data={newRep}
        keyExtractor={keyExtractorByIndex}
        renderItem={renderTotalItem}
        style={localStyles.groupMargin}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};

export default ReportListTotal;

const localStyles = StyleSheet.create({
  margins: {
    marginHorizontal: 8,
    marginVertical: 5,
  },
  quantity: {
    alignItems: 'flex-end',
  },
  groupMargin: {
    marginHorizontal: 5,
  },
});
