import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { EmptyList, globalColors, globalStyles as styles, ItemSeparator, LargeText, MediumText } from '@lib/mobile-ui';

import { formatValue, keyExtractorByIndex, round } from '@lib/mobile-hooks';

import { docSelectors, useSelector } from '@lib/store';

import { INamedEntity } from '@lib/types';

import { FlashList } from '@shopify/flash-list';

import { IOrderDocument, IReportItemByGroup, IReportListFormParam } from '../../../store/types';

export interface ReportListSectionProps {
  title: string;
}

const renderItem = ({ item }: { item: IReportItemByGroup }) => (
  <View style={styles.itemNoMargin}>
    <View style={styles.details}>
      <View style={styles.directionRow}>
        <View style={localStyles.name}>
          <MediumText>{item.group.name}</MediumText>
        </View>
        <View style={localStyles.quantity}>
          <MediumText>{formatValue({ type: 'number' }, round(item.quantity, 3))}</MediumText>
        </View>
      </View>
    </View>
  </View>
);

export const ReportListByGroup = () => {
  const {
    filterReportContact,
    filterReportOutlet,
    filterReportDB,
    filterReportDE,
    filterReportOnDB,
    filterReportOnDE,
    filterReportGroup,
    filterStatusList = [],
  } = useSelector((state) => state.app.formParams as IReportListFormParam);

  const orders = docSelectors.selectByDocType<IOrderDocument>('order');

  const filteredOrderList = useMemo(
    () =>
      orders.filter(
        (i) =>
          (filterReportContact?.id ? i.head.contact.id === filterReportContact.id : true) &&
          (filterReportOutlet?.id ? i.head.outlet.id === filterReportOutlet.id : true) &&
          (filterReportDB
            ? new Date(filterReportDB).getTime() <= new Date(i.documentDate.slice(0, 10)).getTime()
            : true) &&
          (filterReportDE
            ? new Date(filterReportDE).getTime() >= new Date(i.documentDate.slice(0, 10)).getTime()
            : true) &&
          (filterReportOnDB
            ? new Date(filterReportOnDB).getTime() <= new Date(i.head.onDate.slice(0, 10)).getTime()
            : true) &&
          (filterReportOnDE
            ? new Date(filterReportOnDE).getTime() >= new Date(i.head.onDate.slice(0, 10)).getTime()
            : true) &&
          (filterStatusList.length > 0
            ? filterStatusList.find((item) => item.id.toUpperCase() === i.status.toUpperCase())
            : true),
      ) || [],
    [
      filterReportContact,
      filterReportDB,
      filterReportDE,
      filterReportOnDB,
      filterReportOnDE,
      filterReportOutlet,
      filterStatusList,
      orders,
    ],
  );

  const filteredGroupList = useMemo(() => {
    if (filterReportGroup?.length) {
      return filteredOrderList
        ?.reduce((prev: IReportItemByGroup[], order) => {
          filterReportGroup?.forEach((gr) => {
            const q = order.lines.reduce(
              (orderQ, line) => (line.good.goodgroup.id === gr.id ? orderQ + line.quantity : orderQ),
              0,
            );
            const idx = prev.findIndex((p) => p.group.id === gr.id);
            if (idx >= 0) {
              prev[idx] = { ...prev[idx], quantity: prev[idx].quantity + q };
            } else {
              const newLine = {
                group: gr as INamedEntity,
                quantity: q,
              } as IReportItemByGroup;
              prev = [...prev, newLine];
            }
          });
          return prev;
        }, [])
        ?.sort((a, b) => (a.group.name < b.group.name ? -1 : 1));
    } else {
      return filteredOrderList
        ?.reduce((prev: IReportItemByGroup[], order) => {
          order.lines?.forEach((item) => {
            const idx = prev.findIndex((p) => p.group.id === item.good.goodgroup.id);

            if (idx >= 0) {
              prev[idx] = { ...prev[idx], quantity: prev[idx].quantity + item.quantity };
            } else {
              const newLine = {
                group: item.good.goodgroup as INamedEntity,
                quantity: item.quantity,
              } as IReportItemByGroup;
              prev = [...prev, newLine];
            }
          });
          return prev;
        }, [])
        ?.sort((a, b) => (a.group.name < b.group.name ? -1 : 1));
    }
  }, [filterReportGroup, filteredOrderList]);

  const sAll = useMemo(
    () => round(filteredGroupList?.reduce((prev, cur) => prev + cur.quantity, 0) || 0, 3),
    [filteredGroupList],
  );

  return (
    <View style={styles.flex}>
      <FlashList
        data={filteredGroupList}
        renderItem={renderItem}
        keyExtractor={keyExtractorByIndex}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={EmptyList}
        keyboardShouldPersistTaps="never"
        estimatedItemSize={40}
        extraData={[filterReportGroup, filteredOrderList]}
      />
      {sAll > 0 && (
        <View style={{ backgroundColor: globalColors.backgroundLight }}>
          <View style={[styles.directionRow, localStyles.margins, { backgroundColor: globalColors.backgroundLight }]}>
            <LargeText style={styles.textTotal}>Общий вес, кг: </LargeText>
            <MediumText style={styles.textTotal}>{formatValue({ type: 'number' }, sAll)}</MediumText>
          </View>
        </View>
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  margins: {
    marginHorizontal: 8,
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
