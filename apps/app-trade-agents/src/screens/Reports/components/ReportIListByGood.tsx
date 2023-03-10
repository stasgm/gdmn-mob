import React, { useMemo } from 'react';
import { View, SectionListData, ListRenderItem, StyleSheet, FlatList } from 'react-native';
import { EmptyList, globalColors, globalStyles as styles, ItemSeparator, LargeText, MediumText } from '@lib/mobile-ui';

import { keyExtractorByIndex, round } from '@lib/mobile-hooks';

import { docSelectors, refSelectors, useSelector } from '@lib/store';

import {
  IGoodGroup,
  IOrderDocument,
  IOrderLine,
  IReportItem,
  IReportItemByGood,
  IReportItemByGoods,
  IReportListFormParam,
} from '../../../store/types';

export interface ReportListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<IReportItem, ReportListSectionProps>[];

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
    let i = 1;
    firstLevelGroups.forEach((parent) => {
      const secondLevelGroups = groups.filter((gr) => gr.parent?.id === parent.id);
      list.push({ type: 'parent', name: parent.name });
      secondLevelGroups.forEach((gr) => {
        i = 1;
        const goods = lines.reduce((prev: IReportItemByGood[], line: IOrderLine) => {
          if (line.good.goodgroup.id === gr.id) {
            const idx = prev.findIndex((l) => l.good.id === line.good.id);
            if (idx >= 0) {
              prev[idx] = { ...prev[idx], quantity: prev[idx].quantity + line.quantity };
            } else {
              prev = [...prev, { n: i, good: line.good, quantity: line.quantity }];
              i++;
            }
          }
          return prev;
        }, []);
        if (goods.length > 0) {
          list.push({ type: 'group', name: gr.name });
        }
        goods.forEach((item) =>
          list.push({ type: 'good', n: `00${item.n}.`.slice(-4), name: item.good.name, quantity: item.quantity }),
        );
      });
    });
    return list;
  }, [firstLevelGroups, groups, lines]);

  const renderItem: ListRenderItem<IReportItemByGoods> = ({ item }) => (
    <View style={styles.itemNoMargin}>
      <View style={styles.details}>
        <View style={styles.directionRow}>
          <View style={localStyles.item}>
            {item.n && <MediumText style={localStyles.n}>{item.n}</MediumText>}
            <MediumText
              style={[
                item.type === 'parent' && localStyles.itemParent,
                item.type === 'group' && localStyles.itemGroup,
                item.type === 'good' && localStyles.itemGood,
              ]}
            >
              {item.name}
            </MediumText>
          </View>
          {item.type === 'good' && (
            <View style={localStyles.quantity}>
              <MediumText>{round(item.quantity || 0, 3)}</MediumText>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const sAll = useMemo(
    () => round(filteredGroupList?.reduce((prev, cur) => prev + (cur.quantity || 0), 0) || 0, 3),
    [filteredGroupList],
  );

  return (
    <View style={styles.flex}>
      <FlatList
        data={filteredGroupList}
        renderItem={renderItem}
        keyExtractor={keyExtractorByIndex}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={EmptyList}
        keyboardShouldPersistTaps="never"
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
    alignItems: 'flex-end',
  },
  item: {
    flexDirection: 'row',
    width: '80%',
  },
  itemParent: {
    fontWeight: 'bold',
  },
  itemGroup: {
    paddingLeft: 15,
    fontWeight: 'bold',
  },
  itemGood: {
    paddingLeft: 6,
    width: '80%',
  },
  n: {
    paddingLeft: 30,
  },
});
