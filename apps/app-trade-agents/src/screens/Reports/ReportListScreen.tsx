import { getDateString } from '@lib/mobile-hooks';
import {
  AppActivityIndicator,
  AppScreen,
  globalStyles as styles,
  navBackDrawer,
  FilterButton,
  PrimeButton,
  SelectableInput,
  Checkbox,
  Menu,
} from '@lib/mobile-ui';
import { appActions, refSelectors, useDispatch, useSelector } from '@lib/store';
import { IReference } from '@lib/types';
import { useIsFocused, useNavigation, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';

import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { SectionListData, View, StyleSheet, Platform, Keyboard } from 'react-native';

import { IListItem } from '@lib/mobile-types';

import { ReportStackParamList } from '../../navigation/Root/types';
import { IReportListFormParam, IOutlet, IReportItem } from '../../store/types';

import { reports, statusTypes } from '../../utils/constants';

import { ReportListByContact } from './components/ReportListByContact';
import { ReportListByGroup } from './components/ReportIListByGroup';
import { ReportListByGood } from './components/ReportIListByGood';

export type RefListItem = IReference & { refName: string };

export interface ReportListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<IReportItem, ReportListSectionProps>[];

const ReportListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<ReportStackParamList, 'ReportList'>>();
  const [visibleReport, setVisibleReport] = useState(false);

  const { colors } = useTheme();
  const dispatch = useDispatch();

  const {
    filterReportContact,
    filterReportOutlet,
    filterReportDB,
    filterReportDE,
    filterReportOnDB,
    filterReportOnDE,
    filterReportGroup,
    filterReportGood,
    filterReportStatusList = [],
  } = useSelector((state) => state.app.formParams as IReportListFormParam);

  const [report, setReport] = useState(reports[0]);

  const handleCleanFormParams = useCallback(() => {
    dispatch(
      appActions.setFormParams({
        filterReportContact: undefined,
        filterReportOutlet: undefined,
        filterReportDB: '',
        filterReportDE: '',
        filterReportOnDB: '',
        filterReportOnDE: '',
        filterReportGroup: undefined,
        filterReportGood: undefined,
        filterReportStatusList: undefined,
      }),
    );
  }, [dispatch]);

  const outlet = refSelectors.selectByName<IOutlet>('outlet')?.data?.find((e) => e.id === filterReportOutlet?.id);

  useEffect(() => {
    if (!!filterReportContact && !!filterReportOutlet && filterReportContact.id !== outlet?.company.id) {
      dispatch(
        appActions.setFormParams({
          filterReportOutlet: undefined,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, filterReportContact?.id, outlet?.company.id]);

  useEffect(() => {
    // Инициализируем параметры
    handleCleanFormParams();
  }, [handleCleanFormParams]);

  const withParams =
    !!filterReportContact ||
    !!filterReportOutlet ||
    !!filterReportGroup ||
    !!filterReportGood ||
    !!filterReportDB ||
    !!filterReportDE ||
    !!filterReportOnDB ||
    !!filterReportOnDE ||
    filterReportStatusList.length > 0;

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
      dispatch(appActions.setFormParams({ filterReportDB: selectedDateBegin.toISOString().slice(0, 10) }));
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
      dispatch(appActions.setFormParams({ filterReportDE: selectedDateEnd.toISOString().slice(0, 10) }));
    }
  };

  const handlePresentDateEnd = () => {
    Keyboard.dismiss();
    setShowDateEnd(true);
  };

  const [showOnDateBegin, setShowOnDateBegin] = useState(false);

  const handleApplyOnDateBegin = (_event: any, selectedDateBegin: Date | undefined) => {
    setShowOnDateBegin(false);

    if (selectedDateBegin && _event.type !== 'dismissed') {
      dispatch(appActions.setFormParams({ filterReportOnDB: selectedDateBegin.toISOString().slice(0, 10) }));
    }
  };

  const handlePresentOnDateBegin = () => {
    Keyboard.dismiss();
    setShowOnDateBegin(true);
  };

  const [showOnDateEnd, setShowOnDateEnd] = useState(false);

  const handleApplyOnDateEnd = (_event: any, selectedDateEnd: Date | undefined) => {
    setShowOnDateEnd(false);

    if (selectedDateEnd && _event.type !== 'dismissed') {
      dispatch(appActions.setFormParams({ filterReportOnDE: selectedDateEnd.toISOString().slice(0, 10) }));
    }
  };

  const handlePresentOnDateEnd = () => {
    Keyboard.dismiss();
    setShowOnDateEnd(true);
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

  const handleSearchGroup = useCallback(() => {
    navigation.navigate('SelectRefItem', {
      refName: 'goodGroup',
      fieldName: 'filterReportGroup',
      isMulti: true,
      clause: {
        groupParent: 'notNull',
      },
      value: filterReportGroup,
    });
  }, [filterReportGroup, navigation]);

  const handleFilterStatus = useCallback(
    (value: IListItem) => {
      dispatch(
        appActions.setFormParams({
          filterReportStatusList: filterReportStatusList.find((item) => item.id === value.id)
            ? filterReportStatusList.filter((i) => i.id !== value.id)
            : [...filterReportStatusList, value],
        }),
      );
    },
    [dispatch, filterReportStatusList],
  );

  const handleReport = useCallback(
    (option: IListItem) => {
      if (!(option.id === report?.id)) {
        setReport(option);
      }
      setVisibleReport(false);
    },
    [report?.id],
  );

  const handlePressReport = () => {
    setVisibleReport(true);
  };

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  return (
    <AppScreen style={styles.contentTop}>
      {filterVisible && (
        <View style={[localStyles.filter, { borderColor: colors.primary }]}>
          <View style={localStyles.report}>
            <Menu
              key={'report'}
              options={reports}
              onChange={handleReport}
              onPress={handlePressReport}
              onDismiss={() => setVisibleReport(false)}
              title={report?.value || ''}
              visible={visibleReport}
              activeOptionId={report?.id}
              style={localStyles.btnTab}
              iconName={'chevron-down'}
            />
          </View>
          <SelectableInput label="Организация" value={filterReportContact?.name || ''} onPress={handleSearchContact} />
          <View style={localStyles.marginTop}>
            <SelectableInput label="Магазин" value={filterReportOutlet?.name || ''} onPress={handleSearchOutlet} />
          </View>
          {report?.id === 'byGroup' && (
            <View style={localStyles.marginTop}>
              <SelectableInput
                label="Группы"
                value={filterReportGroup?.map((gr) => gr.name).join(',')}
                onPress={handleSearchGroup}
              />
            </View>
          )}
          {report?.id === 'byContact' && (
            <View style={localStyles.marginTop}>
              <SelectableInput label="Товар" value={filterReportGood?.name || ''} onPress={handleSearchGood} />
            </View>
          )}
          <View style={[styles.flexDirectionRow, localStyles.marginTop]}>
            <View style={localStyles.width}>
              <SelectableInput
                label="С даты"
                value={filterReportDB ? getDateString(filterReportDB) : ''}
                onPress={handlePresentDateBegin}
                style={!filterReportDB && localStyles.fontSize}
              />
            </View>
            <View style={localStyles.width}>
              <SelectableInput
                label="По дату"
                value={filterReportDE ? getDateString(filterReportDE || '') : ''}
                onPress={handlePresentDateEnd}
                style={[!filterReportDE && localStyles.fontSize, localStyles.marginInput]}
              />
            </View>
          </View>
          <View style={[styles.flexDirectionRow, localStyles.marginTop]}>
            <View style={localStyles.width}>
              <SelectableInput
                label="С даты отгрузки"
                value={filterReportOnDB ? getDateString(filterReportOnDB) : ''}
                onPress={handlePresentOnDateBegin}
                style={!filterReportOnDB && localStyles.fontSize}
              />
            </View>
            <View style={localStyles.width}>
              <SelectableInput
                label="По дату отгрузки"
                value={filterReportOnDE ? getDateString(filterReportOnDE || '') : ''}
                onPress={handlePresentOnDateEnd}
                style={[!filterReportOnDE && localStyles.fontSize, localStyles.marginInput]}
              />
            </View>
          </View>
          <View style={[localStyles.marginTop, localStyles.status]}>
            {statusTypes.map((elem) => (
              <View key={elem.id}>
                <Checkbox
                  key={elem.id}
                  title={elem.value}
                  selected={!!filterReportStatusList.find((i) => i.id === elem.id)}
                  onSelect={() => handleFilterStatus(elem)}
                />
              </View>
            ))}
          </View>
          <View style={localStyles.container}>
            <PrimeButton icon={'delete-outline'} onPress={handleCleanFormParams} disabled={!withParams}>
              {'Очистить'}
            </PrimeButton>
          </View>
        </View>
      )}
      {withParams &&
        (report?.id === 'byContact' ? (
          <ReportListByContact />
        ) : report?.id === 'byGroup' ? (
          <ReportListByGroup />
        ) : report?.id === 'byGood' ? (
          <ReportListByGood />
        ) : null)}
      {showDateBegin && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(filterReportDB || new Date())}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleApplyDateBegin}
        />
      )}
      {showDateEnd && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(filterReportDE || new Date())}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleApplyDateEnd}
        />
      )}
      {showOnDateBegin && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(filterReportOnDB || new Date())}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleApplyOnDateBegin}
        />
      )}
      {showOnDateEnd && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(filterReportOnDE || new Date())}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleApplyOnDateEnd}
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
  report: {
    marginRight: 12,
  },
  btnTab: {
    alignItems: 'flex-end',
  },
});
