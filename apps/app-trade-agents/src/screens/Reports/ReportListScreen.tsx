import { getDateString, keyExtractor } from '@lib/mobile-hooks';
import {
  AppActivityIndicator,
  AppScreen,
  EmptyList,
  globalStyles as styles,
  ItemSeparator,
  navBackDrawer,
  SearchButton,
  PrimeButton,
  SelectableInput,
  SubTitle,
} from '@lib/mobile-ui';
import { appActions, docSelectors, refSelectors, useDispatch, useSelector } from '@lib/store';
import { IReference } from '@lib/types';
import { useIsFocused, useNavigation, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { SectionListData, View, StyleSheet, SectionList, ListRenderItem, Platform, Keyboard } from 'react-native';

import { ReportStackParamList } from '../../navigation/Root/types';
import { IOrderDocument, IReportListFormParam, IOutlet, IReportTotalLine } from '../../store/types';

import { noPackage } from '../../utils/constants';

import ReportItem, { IReportItem } from './components/ReportItem';
import { ReportTotalByDate, ReportTotal } from './components/ReportTotal';
// import ReportListTotal from './components/ReportListTotal';

export type RefListItem = IReference & { refName: string };

export interface ReportListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<IReportItem, ReportListSectionProps>[];

const ReportListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<ReportStackParamList, 'ReportList'>>();

  const { colors } = useTheme();

  const dispatch = useDispatch();

  const { filterReportContact, filterReportOutlet, filterReportDateBegin, filterReportDateEnd, filterReportGood } =
    useSelector((state) => state.app.formParams as IReportListFormParam);

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

  const filteredOrderList = useMemo(() => {
    if (
      filterReportContact?.id ||
      filterReportOutlet?.id ||
      filterReportGood?.id ||
      filterReportDateBegin ||
      filterReportDateEnd
    ) {
      let dateEnd: Date | undefined;
      if (filterReportDateEnd) {
        dateEnd = new Date(filterReportDateEnd);
        dateEnd.setDate(dateEnd.getDate() + 1);
      }

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
          (dateEnd ? new Date(dateEnd).getTime() >= new Date(i.head.onDate.slice(0, 10)).getTime() : true),
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
    orders,
  ]);

  const filteredOutletList: IReportItem[] = useMemo(() => {
    return filteredOrderList.length
      ? filteredOrderList
          .reduce((prev: IReportItem[], cur) => {
            const address = outlets.find((o) => cur?.head?.outlet.id === o.id)?.address;
            const line = prev.find(
              (e) =>
                e.outlet.id === cur.head.outlet.id &&
                new Date(e.onDate.slice(0, 10)).getTime() === new Date(cur.head.onDate.slice(0, 10)).getTime(),
            );

            if (filterReportGood) {
              const curOutletLines = cur.lines.reduce((lines: IReportTotalLine[], curLine) => {
                if (curLine.good.id === filterReportGood.id) {
                  ///////////////////////////////
                  //////findIndex/////
                  //////////////////////////////
                  const pack = lines.find((i) => i.package.id === (curLine.package?.id || 'noPackage'));
                  if (!pack) {
                    const newRep: IReportTotalLine = {
                      package: curLine.package || noPackage,
                      quantity: curLine.quantity,
                    };
                    lines = [...lines, newRep];
                  } else {
                    const index = lines.indexOf(pack);
                    lines[index] = { ...lines[index], quantity: lines[index].quantity + curLine.quantity };
                  }
                }
                return lines;
              }, []);

              if (!line) {
                prev.push({
                  // id: cur.id,
                  outlet: cur.head.outlet,
                  onDate: cur.head.onDate,
                  address: address,
                  goodGuantity: curOutletLines,
                } as IReportItem);
              } else {
                const index = prev.indexOf(line);
                const newQuantity = prev[index].goodGuantity?.reduce((reportLines: IReportTotalLine[], curr) => {
                  const curOutlet = curOutletLines.find((item) => item.package.id === curr.package.id);
                  if (curOutlet) {
                    const newLine: IReportTotalLine = {
                      package: curr.package,
                      quantity: curr.quantity + curOutlet.quantity,
                    };
                    reportLines = [...reportLines, newLine];
                  } else {
                    reportLines = [...reportLines, curr];
                  }
                  return reportLines;
                }, []);
                prev[index] = { ...prev[index], goodGuantity: newQuantity };
              }
            } else {
              if (!line) {
                prev.push({
                  // id: cur.id,
                  outlet: cur.head.outlet,
                  onDate: cur.head.onDate,
                  address: address,
                } as IReportItem);
              }
            }

            return prev;
          }, [])
          ?.sort(
            (a, b) =>
              new Date(b.onDate.slice(0, 10)).getTime() - new Date(a.onDate.slice(0, 10)).getTime() ||
              (a.outlet.name < b.outlet.name ? -1 : 1),
          )
      : [];
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
        <SearchButton onPress={() => setFilterVisible(!filterVisible)} visible={filterVisible} />
      </View>
    ),
    [filterVisible],
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

  const renderItem: ListRenderItem<IReportItem> = ({ item }) => {
    return <ReportItem key={item.id} {...item} />;
  };

  const renderSectionHeader = ({ section }: any) => (
    <SubTitle style={[styles.header, styles.sectionTitle]}>{section.title}</SubTitle>
  );

  const renderSectionFooter = useCallback(
    (item: any) =>
      filterReportGood && sections ? (
        <ReportTotalByDate sectionReports={item.section} reports={filteredOutletList} />
      ) : null,
    [filterReportGood, filteredOutletList, sections],
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
                  filterReportDateEnd
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
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={ItemSeparator}
        renderSectionHeader={renderSectionHeader}
        renderSectionFooter={renderSectionFooter}
        ListEmptyComponent={EmptyList}
        keyboardShouldPersistTaps="never"
      />
      {filterReportGood ? <ReportTotal reports={filteredOutletList} /> : null}
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
    marginTop: -10,
  },
});
