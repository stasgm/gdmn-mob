import { getDateString, keyExtractorByIndex, round } from '@lib/mobile-hooks';
import {
  AppActivityIndicator,
  AppScreen,
  EmptyList,
  globalStyles as styles,
  ItemSeparator,
  navBackDrawer,
  FilterButton,
  PrimeButton,
  SelectableInput,
  SubTitle,
  Checkbox,
} from '@lib/mobile-ui';
import { appActions, docSelectors, refSelectors, useDispatch, useSelector } from '@lib/store';
import { IReference } from '@lib/types';
import { useIsFocused, useNavigation, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { SectionListData, View, StyleSheet, SectionList, ListRenderItem, Platform, Keyboard } from 'react-native';

import { IListItem } from '@lib/mobile-types';

import { ReportStackParamList } from '../../navigation/Root/types';
import { IOrderDocument, IReportListFormParam, IOutlet, IReportItem } from '../../store/types';

import { noPackage, statusTypes } from '../../utils/constants';

import ReportItem from './components/ReportItem';
import { ReportTotalByDate, ReportTotal } from './components/ReportTotal';

export type RefListItem = IReference & { refName: string };

export interface ReportListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<IReportItem, ReportListSectionProps>[];

const ReportListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<ReportStackParamList, 'ReportList'>>();

  const { colors } = useTheme();

  const dispatch = useDispatch();

  const {
    filterReportContact,
    filterReportOutlet,
    filterReportDateBegin,
    filterReportDateEnd,
    filterReportGood,
    filterStatusList = [],
  } = useSelector((state) => state.app.formParams as IReportListFormParam);

  const outlets = refSelectors.selectByName<IOutlet>('outlet')?.data;

  const orders = docSelectors.selectByDocType<IOrderDocument>('order');

  useEffect(() => {
    return () => {
      dispatch(appActions.clearFormParams());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCleanFormParams = useCallback(() => {
    dispatch(appActions.clearFormParams());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const outlet = refSelectors.selectByName<IOutlet>('outlet')?.data?.find((e) => e.id === filterReportOutlet?.id);

  useEffect(() => {
    if (!!filterReportContact && !!filterReportOutlet && filterReportContact.id !== outlet?.company.id) {
      dispatch(
        appActions.setFormParams({
          filterOutlet: undefined,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, filterReportContact?.id, outlet?.company.id]);

  useEffect(() => {
    // Инициализируем параметры
    dispatch(
      appActions.setFormParams({
        filterReportDateBegin: '',
        filterReportDateEnd: '',
      }),
    );
  }, [dispatch]);

  const withParams =
    !!filterReportContact ||
    !!filterReportOutlet ||
    !!filterReportGood ||
    !!filterReportDateBegin ||
    !!filterReportDateEnd ||
    filterStatusList.length > 0;

  const filteredOrderList = useMemo(() => {
    if (withParams) {
      return orders.filter(
        (i) =>
          (filterReportContact?.id ? i.head.contact.id === filterReportContact.id : true) &&
          (filterReportOutlet?.id ? i.head.outlet.id === filterReportOutlet.id : true) &&
          (filterReportGood?.id
            ? i.lines.find((item) => item.good.id === filterReportGood?.id)?.good.id === filterReportGood.id
            : true) &&
          (filterReportDateBegin
            ? new Date(filterReportDateBegin).getTime() <= new Date(i.head.onDate.slice(0, 10)).getTime()
            : true) &&
          (filterReportDateEnd
            ? new Date(filterReportDateEnd).getTime() >= new Date(i.head.onDate.slice(0, 10)).getTime()
            : true) &&
          (filterStatusList.length > 0
            ? filterStatusList.find((item) => item.id.toUpperCase() === i.status.toUpperCase())
            : true),
      );
    } else {
      return [];
    }
  }, [
    filterReportContact?.id,
    filterReportDateBegin,
    filterReportDateEnd,
    filterReportGood?.id,
    filterReportOutlet?.id,
    filterStatusList,
    orders,
    withParams,
  ]);

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
                const curTotalByPackage = oldTotalList.find((item) => item.package.id === curLine.package?.id);
                if (curTotalByPackage) {
                  const newTotalListByPackage = {
                    ...curTotalByPackage,
                    quantity: round(curTotalByPackage.quantity + curLine.quantity, 3),
                  };
                  const newTotalListByDate = oldTotalList
                    .filter((i) => i.package.id !== curLine.package?.id)
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

  const [filterVisible, setFilterVisible] = useState(true);

  const renderRight = useCallback(
    () => (
      <View style={styles.buttons}>
        <FilterButton
          onPress={() => setFilterVisible(!filterVisible)}
          visible={filterVisible}
          withParams={withParams}
        />
      </View>
    ),
    [filterVisible, withParams],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackDrawer,
      headerRight: renderRight,
    });
  }, [navigation, renderRight]);

  const [showDateBegin, setShowDateBegin] = useState(false);
  const handleApplyDateBegin = (_event: any, selectedDateBegin: Date | undefined) => {
    setShowDateBegin(false);

    if (selectedDateBegin && _event.type !== 'dismissed') {
      dispatch(appActions.setFormParams({ filterReportDateBegin: selectedDateBegin.toISOString().slice(0, 10) }));
    }
  };
  const handlePresentDateBegin = () => {
    Keyboard.dismiss();
    setShowDateBegin(true);
  };

  const [showDateEnd, setShowDateEnd] = useState(false);

  const handleApplyDateEnd = (_event: any, selectedDateEnd: Date | undefined) => {
    setShowDateEnd(false);

    if (selectedDateEnd && _event.type !== 'dismissed') {
      dispatch(appActions.setFormParams({ filterReportDateEnd: selectedDateEnd.toISOString().slice(0, 10) }));
    }
  };

  const handlePresentDateEnd = () => {
    Keyboard.dismiss();
    setShowDateEnd(true);
  };

  const handleSearchContact = useCallback(() => {
    navigation.navigate('SelectRefItem', {
      refName: 'contact',
      fieldName: 'filterReportContact',
      value: filterReportContact && [filterReportContact],
    });
  }, [filterReportContact, navigation]);

  const handleSearchOutlet = useCallback(() => {
    navigation.navigate('SelectRefItem', {
      refName: 'outlet',
      fieldName: 'filterReportOutlet',
      clause: filterReportContact?.id
        ? {
            companyId: filterReportContact?.id,
          }
        : undefined,
      value: filterReportOutlet && [filterReportOutlet],
      descrFieldName: 'address',
    });
  }, [filterReportContact?.id, filterReportOutlet, navigation]);

  const handleSearchGood = useCallback(() => {
    navigation.navigate('SelectRefItem', {
      refName: 'good',
      fieldName: 'filterReportGood',

      value: filterReportGood && [filterReportGood],
    });
  }, [filterReportGood, navigation]);

  const handleFilterStatus = useCallback(
    (value: IListItem) => {
      dispatch(
        appActions.setFormParams({
          filterStatusList: filterStatusList.find((item) => item.id === value.id)
            ? filterStatusList.filter((i) => i.id !== value.id)
            : [...filterStatusList, value],
        }),
      );
    },
    [dispatch, filterStatusList],
  );

  const renderItem: ListRenderItem<IReportItem> = ({ item }) => <ReportItem {...item} />;

  const renderSectionHeader = ({ section }: any) => (
    <SubTitle style={[styles.header, styles.sectionTitle]}>{section.title}</SubTitle>
  );

  const renderSectionFooter = useCallback(
    ({ section }: any) =>
      filterReportGood && sections ? <ReportTotalByDate data={section.data} title={section.title} /> : null,
    [filterReportGood, sections],
  );

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  return (
    <AppScreen>
      {filterVisible && (
        <View style={[localStyles.filter, { borderColor: colors.primary }]}>
          <SelectableInput label="Организация" value={filterReportContact?.name || ''} onPress={handleSearchContact} />
          <View style={localStyles.marginTop}>
            <SelectableInput label="Магазин" value={filterReportOutlet?.name || ''} onPress={handleSearchOutlet} />
          </View>
          <View style={localStyles.marginTop}>
            <SelectableInput label="Товар" value={filterReportGood?.name || ''} onPress={handleSearchGood} />
          </View>
          <View style={[styles.flexDirectionRow, localStyles.marginTop]}>
            <View style={localStyles.width}>
              <SelectableInput
                label="С даты отгрузки"
                value={filterReportDateBegin ? getDateString(filterReportDateBegin) : ''}
                onPress={handlePresentDateBegin}
                style={!filterReportDateBegin && localStyles.fontSize}
              />
            </View>
            <View style={localStyles.width}>
              <SelectableInput
                label="По дату отгрузки"
                value={filterReportDateEnd ? getDateString(filterReportDateEnd || '') : ''}
                onPress={handlePresentDateEnd}
                style={[!filterReportDateEnd && localStyles.fontSize, localStyles.marginInput]}
              />
            </View>
          </View>
          <View style={[localStyles.marginTop, localStyles.status]}>
            {statusTypes.map((elem) => (
              <View key={elem.id}>
                <Checkbox
                  key={elem.id}
                  title={elem.value}
                  selected={!!filterStatusList.find((i) => i.id === elem.id)}
                  onSelect={() => handleFilterStatus(elem)}
                />
              </View>
            ))}
          </View>
          <View style={localStyles.container}>
            <PrimeButton
              icon={'delete-outline'}
              onPress={handleCleanFormParams}
              disabled={
                !(
                  filterReportContact ||
                  filterReportOutlet ||
                  filterReportGood ||
                  filterReportDateBegin ||
                  filterReportDateEnd ||
                  filterStatusList.length
                )
              }
            >
              {'Очистить'}
            </PrimeButton>
          </View>
        </View>
      )}
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
      {filterReportGood ? <ReportTotal data={filteredOutletList} /> : null}
      {showDateBegin && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(filterReportDateBegin || new Date())}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleApplyDateBegin}
        />
      )}
      {showDateEnd && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(filterReportDateEnd || new Date())}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleApplyDateEnd}
        />
      )}
    </AppScreen>
  );
};

export default ReportListScreen;

const localStyles = StyleSheet.create({
  filter: {
    paddingTop: 5,
    marginVertical: 5,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 2,
  },
  marginTop: {
    marginTop: -5,
  },
  width: {
    width: '50%',
  },
  fontSize: {
    fontSize: 14,
  },
  marginInput: {
    marginLeft: 5,
  },
  container: {
    alignItems: 'center',
    marginTop: -4,
  },
  status: {
    marginHorizontal: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
