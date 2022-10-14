import { getDateString, keyExtractor } from '@lib/mobile-app';
import {
  AppActivityIndicator,
  AppScreen,
  EmptyList,
  globalStyles as styles,
  ItemSeparator,
  navBackDrawer,
  SelectableInput,
  SubTitle,
} from '@lib/mobile-ui';
import { appActions, refSelectors, useDispatch, useSelector } from '@lib/store';
import { IReference } from '@lib/types';
import { useIsFocused, useNavigation, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { SectionListData, View, StyleSheet, SectionList, ListRenderItem, Platform, Keyboard } from 'react-native';
import { Divider } from 'react-native-paper';

import { ReportStackParamList } from '../../navigation/Root/types';
import { IOrderDocument, IOrderListFormParam, IOutlet } from '../../store/types';

import ReportItem, { IReportItem } from './components/ReportItem';

export type RefListItem = IReference & { refName: string };

export interface ReportListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<IReportItem, ReportListSectionProps>[];

const ReportListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<ReportStackParamList, 'ReportList'>>();

  const { colors } = useTheme();

  const dispatch = useDispatch();

  const { filterContact, filterOutlet, filterDateBegin, filterDateEnd, filterGood } = useSelector(
    (state) => state.app.formParams as IOrderListFormParam,
  );

  const outlets = refSelectors.selectByName<IOutlet>('outlet')?.data;

  const orders = useSelector((state) => state.documents.list) as IOrderDocument[];

  useEffect(() => {
    return () => {
      dispatch(appActions.clearFormParams());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const outlet = refSelectors.selectByName<IOutlet>('outlet')?.data?.find((e) => e.id === filterOutlet?.id);

  useEffect(() => {
    if (!!filterContact && !!filterOutlet && filterContact.id !== outlet?.company.id) {
      dispatch(
        appActions.setFormParams({
          filterOutlet: undefined,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, filterContact?.id, outlet?.company.id]);

  useEffect(() => {
    // Инициализируем параметры
    dispatch(
      appActions.setFormParams({
        filterDateBegin: '',
        filterDate: '',
      }),
    );
  }, [dispatch]);

  const orderList = useMemo(() => orders?.filter((i) => i.documentType?.name === 'order'), [orders]);

  const filteredOrderList = useMemo(() => {
    if (filterContact?.id || filterOutlet?.id || filterGood?.id || filterDateBegin || filterDateEnd) {
      let dateEnd: Date | undefined;
      if (filterDateEnd) {
        dateEnd = new Date(filterDateEnd);
        dateEnd.setDate(dateEnd.getDate() + 1);
      }

      return orderList.filter(
        (i) =>
          (filterContact?.id ? i.head.contact.id === filterContact.id : true) &&
          (filterOutlet?.id ? i.head.outlet.id === filterOutlet.id : true) &&
          (filterGood?.id
            ? i.lines.find((item) => item.good.id === filterGood?.id)?.good.id === filterGood.id
            : true) &&
          (filterDateBegin
            ? new Date(filterDateBegin).getTime() <= new Date(i.documentDate.slice(0, 10)).getTime()
            : true) &&
          (dateEnd ? new Date(dateEnd).getTime() >= new Date(i.documentDate.slice(0, 10)).getTime() : true),
      );
    } else {
      return [];
    }
  }, [filterContact?.id, filterDateBegin, filterDateEnd, filterGood?.id, filterOutlet?.id, orderList]);

  const filteredOutletList: IReportItem[] = useMemo(() => {
    return filteredOrderList.length
      ? filteredOrderList
          .reduce((prev: IReportItem[], cur) => {
            const address = outlets.find((o) => cur?.head?.outlet.id === o.id)?.address;
            const is = prev.find(
              (e) =>
                orderList.find((a) => a.id === e.id)?.head.outlet.id === cur.head.outlet.id &&
                new Date(e.documentDate.slice(0, 10)).getTime() === new Date(cur.documentDate.slice(0, 10)).getTime(),
            );

            if (!is) {
              prev.push({
                id: cur.id,
                name: cur.head.outlet?.name,
                documentDate: cur.documentDate,
                address: address,
              } as IReportItem);
            }
            return prev;
          }, [])
          ?.sort(
            (a, b) =>
              new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime() && (a.name < b.name ? -1 : 1),
          )
      : [];
  }, [filteredOrderList, orderList, outlets]);

  const sections = useMemo(
    () =>
      filteredOutletList.reduce<SectionDataProps>((prev, item) => {
        const sectionTitle = getDateString(item.documentDate);
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackDrawer,
    });
  }, [navigation]);

  const [showDateBegin, setShowDateBegin] = useState(false);
  const handleApplyDateBegin = (_event: any, selectedDateBegin: Date | undefined) => {
    setShowDateBegin(false);

    if (selectedDateBegin && _event.type !== 'dismissed') {
      dispatch(appActions.setFormParams({ filterDateBegin: selectedDateBegin.toISOString().slice(0, 10) }));
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
      dispatch(appActions.setFormParams({ filterDateEnd: selectedDateEnd.toISOString().slice(0, 10) }));
    }
  };

  const handlePresentDateEnd = () => {
    Keyboard.dismiss();
    setShowDateEnd(true);
  };

  const handleSearchContact = useCallback(() => {
    navigation.navigate('SelectRefItem', {
      refName: 'contact',
      fieldName: 'filterContact',
      value: filterContact && [filterContact],
    });
  }, [filterContact, navigation]);

  const handleSearchOutlet = useCallback(() => {
    navigation.navigate('SelectRefItem', {
      refName: 'outlet',
      fieldName: 'filterOutlet',
      clause: filterContact?.id
        ? {
            companyId: filterContact?.id,
          }
        : undefined,
      value: filterOutlet && [filterOutlet],
      descrFieldName: 'address',
    });
  }, [filterContact?.id, filterOutlet, navigation]);

  const handleSearchGood = useCallback(() => {
    navigation.navigate('SelectRefItem', {
      refName: 'good',
      fieldName: 'filterGood',

      value: filterGood && [filterGood],
    });
  }, [filterGood, navigation]);

  const renderItem: ListRenderItem<IReportItem> = ({ item }) => {
    return <ReportItem key={item.id} {...item} />;
  };

  const renderSectionHeader = ({ section }: any) => (
    <SubTitle style={[styles.header, styles.sectionTitle]}>{section.title}</SubTitle>
  );

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  return (
    <AppScreen>
      <Divider />
      <View style={[localStyles.filter, { borderColor: colors.primary }]}>
        <SelectableInput label="Организация" value={filterContact?.name || ''} onPress={handleSearchContact} />
        <View style={localStyles.marginTop}>
          <SelectableInput label="Магазин" value={filterOutlet?.name || ''} onPress={handleSearchOutlet} />
        </View>
        <View style={localStyles.marginTop}>
          <SelectableInput label="Товар" value={filterGood?.name || ''} onPress={handleSearchGood} />
        </View>
        <View style={[styles.flexDirectionRow, localStyles.marginTop]}>
          <View style={localStyles.width}>
            <SelectableInput
              label="С даты"
              value={filterDateBegin ? getDateString(filterDateBegin) : ''}
              onPress={handlePresentDateBegin}
            />
          </View>
          <View style={localStyles.width}>
            <SelectableInput
              label="По дату"
              value={filterDateEnd ? getDateString(filterDateEnd || '') : ''}
              onPress={handlePresentDateEnd}
            />
          </View>
        </View>
      </View>
      <SectionList
        sections={sections}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={ItemSeparator}
        renderSectionHeader={renderSectionHeader}
        ListEmptyComponent={EmptyList}
        keyboardShouldPersistTaps="never"
      />
      {showDateBegin && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(filterDateBegin || new Date())}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleApplyDateBegin}
        />
      )}
      {showDateEnd && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(filterDateEnd || new Date())}
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
  width: { width: '50%' },
});
