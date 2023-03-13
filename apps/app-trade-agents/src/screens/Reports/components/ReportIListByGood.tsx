import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { EmptyList, globalColors, globalStyles as styles, ItemSeparator, LargeText, MediumText } from '@lib/mobile-ui';

import { formatValue, keyExtractorByIndex, round } from '@lib/mobile-hooks';

import { docSelectors, refSelectors, useSelector } from '@lib/store';

import { FlashList } from '@shopify/flash-list';

import {
  IGoodGroup,
  IOrderDocument,
  IOrderLine,
  IReportItemByGood,
  IReportItemByGoods,
  IReportListFormParam,
} from '../../../store/types';

export interface ReportListSectionProps {
  title: string;
}

const renderItem = ({ item }: { item: IReportItemByGoods }) => (
  <View style={styles.flex}>
    {item.type === 'good' ? (
      <View style={[styles.directionRow, localStyles.good]}>
        <View style={localStyles.name}>
          <MediumText style={localStyles.n}>{item.n}</MediumText>
          <MediumText style={localStyles.goodName}>{item.name}</MediumText>
        </View>
        <View style={localStyles.quantity}>
          <MediumText>{formatValue({ type: 'number' }, round(item.quantity || 0, 3))}</MediumText>
        </View>
      </View>
    ) : (
      <View style={localStyles.group}>
        <MediumText
          style={[item.type === 'parent' && localStyles.itemParent, item.type === 'group' && localStyles.itemGroup]}
        >
          {item.name}
        </MediumText>
      </View>
    )}
  </View>
);

export const ReportListByGood = () => {
  const {
    filterReportContact,
    filterReportOutlet,
    filterReportDB,
    filterReportDE,
    filterReportOnDB,
    filterReportOnDE,
    filterStatusList = [],
  } = useSelector((state) => state.app.formParams as IReportListFormParam);

  const orders = docSelectors.selectByDocType<IOrderDocument>('order');
  const groups = refSelectors.selectByName<IGoodGroup>('goodGroup').data;

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

  const firstLevelGroups = groups.filter((gr) => !gr.parent?.id && groups.find((grr) => grr.parent?.id === gr.id));

  const lines = filteredOrderList.reduce((prev: IOrderLine[], order) => prev.concat(order.lines), []);

  const filteredGroupList = useMemo(() => {
    const list: IReportItemByGoods[] = [];
    firstLevelGroups.forEach((parent) => {
      const secondLevelGroups = groups.filter((gr) => gr.parent?.id === parent.id);
      list.push({ type: 'parent', name: parent.name });
      secondLevelGroups.forEach((gr) => {
        const goods = lines.reduce((prev: IReportItemByGood[], line: IOrderLine) => {
          if (line.good.goodgroup.id === gr.id) {
            const idx = prev.findIndex((l) => l.good.id === line.good.id);
            if (idx >= 0) {
              prev[idx] = { ...prev[idx], quantity: prev[idx].quantity + line.quantity };
            } else {
              prev = [...prev, { good: line.good, quantity: line.quantity }];
            }
          }
          return prev;
        }, []);
        if (goods.length > 0) {
          list.push({ type: 'group', name: gr.name });
          goods
            .sort((a, b) => (a.good.name < b.good.name ? -1 : 1))
            .forEach((item, id) =>
              list.push({ type: 'good', n: `00${id + 1}.`.slice(-4), name: item.good.name, quantity: item.quantity }),
            );
        }
      });
    });
    return list;
  }, [firstLevelGroups, groups, lines]);

  const sAll = useMemo(
    () =>
      formatValue(
        { type: 'number' },
        round(filteredGroupList?.reduce((prev, cur) => prev + (cur.quantity || 0), 0) || 0, 3),
      ),
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
        extraData={[firstLevelGroups, groups, lines]}
      />
      <View style={{ backgroundColor: globalColors.backgroundLight }}>
        <View style={[styles.directionRow, localStyles.margins, { backgroundColor: globalColors.backgroundLight }]}>
          <LargeText style={styles.textTotal}>Общий вес, кг: </LargeText>
          <MediumText style={styles.textTotal}>{sAll}</MediumText>
        </View>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  margins: {
    marginHorizontal: 8,
    marginVertical: 5,
  },
  quantity: {
    flex: undefined,
    paddingRight: 5,
  },
  name: {
    flex: 1,
    maxWidth: '80%',
    flexDirection: 'row',
  },
  group: {
    width: '100%',
  },
  itemParent: {
    fontWeight: 'bold',
    textAlignVertical: 'center',
    paddingHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: globalColors.backgroundLight,
  },
  itemGroup: {
    paddingLeft: 15,
    fontWeight: 'bold',
    paddingVertical: 10,
    textAlignVertical: 'center',
  },
  goodName: {
    paddingLeft: 6,
    width: '80%',
  },
  good: {
    paddingVertical: 5,
  },
  n: {
    paddingLeft: 30,
  },
});
