import React, { useMemo } from 'react';
import { View, SectionListData, StyleSheet, FlatList } from 'react-native';
import {
  globalColors,
  globalStyles as styles,
  IListItemProps,
  ItemSeparator,
  LargeText,
  MediumText,
} from '@lib/mobile-ui';
import { Divider } from 'react-native-paper';

import { useTheme } from '@react-navigation/native';

import { keyExtractorByIndex, round } from '@lib/mobile-hooks';

import { IReportTotalLine } from '../../../store/types';
import { ReportListSectionProps } from '../ReportListScreen';

import { IReportItem } from './ReportItem';

export interface OrderListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<IListItemProps, OrderListSectionProps>[];

export interface IItem {
  sectionReports?: SectionListData<IListItemProps, ReportListSectionProps>;
  reports: IReportItem[];
}

const renderTotalItem = ({ item }: { item: IReportTotalLine }) => (
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
);

const countSum = (reportLines: IReportTotalLine[]) => {
  const lineSum = reportLines.reduce((prev: IReportTotalLine[], cur) => {
    const line = prev.find((i) => cur.package.id === i.package.id);
    if (line) {
      const index = prev.indexOf(line);
      prev[index] = { ...prev[index], quantity: prev[index].quantity + cur.quantity };
    } else {
      prev = [...prev, cur];
    }

    return prev;
  }, []);

  const totalSum = lineSum.reduce(
    (prev, item) => ({
      quantity: prev.quantity + (item.quantity || 0),
    }),
    {
      quantity: 0,
    },
  );

  return { lineSum, totalSum };
};

export const ReportTotalByDate = ({ sectionReports }: IItem) => {
  const { colors } = useTheme();

  const sectionData = sectionReports ? (sectionReports?.data as IReportItem[]) : [];
  const reportLines = sectionData.reduce((prev: IReportTotalLine[], report) => {
    if (report.goodGuantity) {
      prev = [...prev, ...report.goodGuantity];
    }
    return prev;
  }, []);

  const sum = countSum(reportLines);

  return (
    <View>
      <Divider style={{ backgroundColor: colors.primary }} />
      {reportLines.length ? (
        <>
          <View style={[styles.directionRow, localStyles.margins]}>
            <LargeText style={styles.textTotal}>{`Итого за ${sectionReports?.title}, кг: `}</LargeText>
            <MediumText style={styles.textTotal}>{round(sum.totalSum?.quantity, 3)}</MediumText>
          </View>
          <Divider style={{ backgroundColor: colors.primary }} />
          <FlatList
            data={sum.lineSum}
            keyExtractor={keyExtractorByIndex}
            renderItem={renderTotalItem}
            style={localStyles.groupMargin}
            ItemSeparatorComponent={ItemSeparator}
          />
        </>
      ) : null}
    </View>
  );
};

export const ReportTotal = ({ reports }: IItem) => {
  const { colors } = useTheme();

  const reportLines = reports?.reduce((prev: IReportTotalLine[], report) => {
    if (report.goodGuantity) {
      prev = [...prev, ...report.goodGuantity];
    }
    return prev;
  }, []);

  const sum = countSum(reportLines);

  return (
    <View style={{ backgroundColor: globalColors.backgroundLight }}>
      <View style={[styles.directionRow, localStyles.margins, { backgroundColor: globalColors.backgroundLight }]}>
        <LargeText style={styles.textTotal}>Общий вес, кг: </LargeText>
        <MediumText style={styles.textTotal}>{round(sum.totalSum?.quantity, 3)}</MediumText>
      </View>
      <Divider style={{ backgroundColor: colors.primary }} />
      <FlatList
        data={sum.lineSum}
        keyExtractor={keyExtractorByIndex}
        renderItem={renderTotalItem}
        style={localStyles.groupMargin}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};

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
