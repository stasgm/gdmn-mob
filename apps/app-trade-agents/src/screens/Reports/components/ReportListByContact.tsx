import React, { useCallback, useMemo } from 'react';
import { View, SectionListData, SectionList, ListRenderItem, StyleSheet } from 'react-native';
import { EmptyList, globalStyles as styles, ItemSeparator, LargeText, MediumText, SubTitle } from '@lib/mobile-ui';

import { getDateString, keyExtractorByIndex, round } from '@lib/mobile-hooks';

import { docSelectors, refSelectors, useSelector } from '@lib/store';

import { Chip, useTheme } from 'react-native-paper';

import { IOrderDocument, IOutlet, IReportItem, IReportListFormParam } from '../../../store/types';
import { noPackage } from '../../../utils/constants';

import { ReportTotal, ReportTotalByDate } from './ReportTotal';

export interface ReportListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<IReportItem, ReportListSectionProps>[];

export const ReportListByContact = () => {
  const { colors } = useTheme();

  const {
    filterReportContact,
    filterReportOutlet,
    filterReportDB,
    filterReportDE,
    filterReportOnDB,
    filterReportOnDE,
    filterReportGroup,
    filterReportGood,
    filterStatusList = [],
  } = useSelector((state) => state.app.formParams as IReportListFormParam);

  const outlets = refSelectors.selectByName<IOutlet>('outlet')?.data;
  const orders = docSelectors.selectByDocType<IOrderDocument>('order');

  const filteredOrderList = useMemo(
    () =>
      orders.filter(
        (i) =>
          (filterReportContact?.id ? i.head.contact.id === filterReportContact.id : true) &&
          (filterReportOutlet?.id ? i.head.outlet.id === filterReportOutlet.id : true) &&
          (filterReportGood?.id
            ? i.lines.find((item) => item.good.id === filterReportGood?.id)?.good.id === filterReportGood.id
            : true) &&
          (filterReportGroup?.length
            ? filterReportGroup.find((gr) => i.lines.find((item) => item.good.goodgroup.id === gr.id))
            : true) &&
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
      ),
    [
      filterReportContact,
      filterReportDB,
      filterReportDE,
      filterReportGood,
      filterReportGroup,
      filterReportOnDB,
      filterReportOnDE,
      filterReportOutlet,
      filterStatusList,
      orders,
    ],
  );

  const filteredOutletList: IReportItem[] = useMemo(() => {
    return filteredOrderList
      .reduce((prev: IReportItem[], cur) => {
        let itemIndex = prev.findIndex(
          (e) =>
            e.outlet.id === cur.head.outlet.id &&
            new Date(e.onDate.slice(0, 10)).getTime() === new Date(cur.head.onDate.slice(0, 10)).getTime(),
        );

        if (filterReportGood) {
          cur.lines.forEach((curLine) => {
            if (curLine.good.id === filterReportGood.id) {
              if (itemIndex > -1) {
                const oldTotalList = prev[itemIndex].totalList || [];
                const curTotalByPackage = oldTotalList.find(
                  (item) => item.package.id === (curLine.package?.id || 'noPackage'),
                );
                if (curTotalByPackage) {
                  const newTotalListByPackage = {
                    ...curTotalByPackage,
                    quantity: round(curTotalByPackage.quantity + curLine.quantity, 3),
                  };
                  const newTotalListByDate = oldTotalList
                    .filter((i) => i.package.id !== (curLine.package?.id || 'noPackage'))
                    .concat(newTotalListByPackage);
                  prev[itemIndex] = { ...prev[itemIndex], totalList: newTotalListByDate };
                } else {
                  prev[itemIndex] = {
                    ...prev[itemIndex],
                    totalList: [...oldTotalList, { package: curLine.package || noPackage, quantity: curLine.quantity }],
                  };
                }
              } else {
                const newLine = {
                  outlet: cur.head.outlet,
                  onDate: cur.head.onDate,
                  address: outlets.find((o) => cur?.head?.outlet.id === o.id)?.address,
                  totalList: [{ package: curLine.package || noPackage, quantity: curLine.quantity }],
                } as IReportItem;
                prev = [...prev, newLine];
                itemIndex = prev.findIndex(
                  (e) =>
                    e.outlet.id === cur.head.outlet.id &&
                    new Date(e.onDate.slice(0, 10)).getTime() === new Date(cur.head.onDate.slice(0, 10)).getTime(),
                );
              }
            }
          });
        } else if (itemIndex === -1) {
          const newLine = {
            outlet: cur.head.outlet,
            onDate: cur.head.onDate,
            address: outlets.find((o) => cur?.head?.outlet.id === o.id)?.address,
          } as IReportItem;
          prev = [...prev, newLine];
        }

        return prev;
      }, [])
      ?.sort(
        (a, b) =>
          new Date(b.onDate.slice(0, 10)).getTime() - new Date(a.onDate.slice(0, 10)).getTime() ||
          (a.outlet.name < b.outlet.name ? -1 : 1),
      );
  }, [filterReportGood, filteredOrderList, outlets]);

  const sections = useMemo(
    () =>
      filteredOutletList.reduce<SectionDataProps>((prev, item) => {
        const sectionTitle = getDateString(item.onDate);
        const sectionExists = prev.some(({ title }) => title === sectionTitle);
        if (sectionExists) {
          return prev.map((section) =>
            section.title === sectionTitle ? { ...section, data: [...section.data, item] } : section,
          );
        }

        return [
          ...prev,
          {
            title: sectionTitle,
            data: [item],
          },
        ];
      }, []),
    [filteredOutletList],
  );

  const renderItem: ListRenderItem<IReportItem> = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.details}>
        <View style={styles.directionRow}>
          <LargeText>{item.outlet.name}</LargeText>
        </View>
        <MediumText>{item.address}</MediumText>
        {item.totalList?.length ? (
          <View style={localStyles.quantity}>
            {item.totalList.map((line, key) => (
              <Chip key={key} style={[localStyles.margin, { borderColor: colors.primary }]}>
                {line.package.name}: {line.quantity} кг
              </Chip>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );

  const renderSectionHeader = ({ section }: any) => (
    <SubTitle style={[styles.header, styles.sectionTitle]}>{section.title}</SubTitle>
  );

  const renderSectionFooter = useCallback(
    ({ section }: any) =>
      filterReportGood && sections.length > 0 ? <ReportTotalByDate data={section.data} title={section.title} /> : null,
    [filterReportGood, sections],
  );

  return (
    <View style={styles.flex}>
      <SectionList
        sections={sections}
        renderItem={renderItem}
        keyExtractor={keyExtractorByIndex}
        ItemSeparatorComponent={ItemSeparator}
        renderSectionHeader={renderSectionHeader}
        renderSectionFooter={renderSectionFooter}
        ListEmptyComponent={EmptyList}
        keyboardShouldPersistTaps="never"
      />
      {filterReportGood && <ReportTotal data={filteredOutletList} />}
    </View>
  );
};

const localStyles = StyleSheet.create({
  quantity: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  margin: {
    margin: 2,
  },
});
