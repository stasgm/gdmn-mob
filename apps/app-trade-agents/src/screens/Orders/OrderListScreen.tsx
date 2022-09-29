import React, { useCallback, useState, useLayoutEffect, useMemo, useEffect } from 'react';
import { ListRenderItem, Platform, SectionList, SectionListData, View } from 'react-native';
import { useIsFocused, useNavigation, useTheme } from '@react-navigation/native';

import {
  globalStyles as styles,
  AddButton,
  FilterButtons,
  ItemSeparator,
  Status,
  AppScreen,
  SubTitle,
  ScreenListItem,
  IListItemProps,
  EmptyList,
  AppActivityIndicator,
  CloseButton,
  DeleteButton,
  navBackDrawer,
  MediumText,
  SelectableInput,
} from '@lib/mobile-ui';

import { StackNavigationProp } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';

import { deleteSelectedItems, formatValue, getDateString, getDelList, keyExtractor } from '@lib/mobile-app';

import { documentActions, refSelectors, useDispatch, useSelector } from '@lib/store';

import { IDelList } from '@lib/mobile-types';

import { IconButton, Searchbar } from 'react-native-paper';

import { IReferenceData } from '@lib/types';

import { IDebt, IOrderDocument, IOutlet } from '../../store/types';
import { OrdersStackParamList } from '../../navigation/Root/types';

import OrderListTotal from './components/OrderListTotal';

export interface OrderListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<IListItemProps, OrderListSectionProps>[];

const OrderListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<OrdersStackParamList, 'OrderList'>>();

  const dispatch = useDispatch();

  const { colors } = useTheme();

  const orders = useSelector((state) => state.documents.list) as IOrderDocument[];

  const searchStyle = useMemo(() => colors.primary, [colors.primary]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  const address = refSelectors.selectByName<IOutlet>('outlet')?.data;

  const [dateBegin, setDateBegin] = useState('');
  const [dateEnd, setDateEnd] = useState<Date | undefined>(undefined);

  const orderList = orders
    ?.filter((i) =>
      i.documentType?.name === 'order'
        ? i?.head?.contact.name ||
          i?.head?.outlet.name ||
          i.number ||
          i.documentDate ||
          i.head.onDate ||
          address.find((a) => a.id === i.head.outlet.id)?.address
          ? i?.head?.contact?.name.toUpperCase().includes(searchQuery.toUpperCase()) ||
            i?.head?.outlet?.name.toUpperCase().includes(searchQuery.toUpperCase()) ||
            i.number.toUpperCase().includes(searchQuery.toUpperCase()) ||
            getDateString(i.documentDate).toUpperCase().includes(searchQuery.toUpperCase()) ||
            getDateString(i.head.onDate).toUpperCase().includes(searchQuery.toUpperCase()) ||
            address
              .find((a) => a.id === i.head.outlet.id)
              ?.address.toUpperCase()
              .includes(searchQuery.toUpperCase())
          : true
        : false,
    )
    .sort(
      (a, b) =>
        new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime() &&
        new Date(b.head.onDate).getTime() - new Date(a.head.onDate).getTime(),
    );

  const debets = refSelectors.selectByName<IDebt>('debt')?.data;

  const [status, setStatus] = useState<Status>('all');

  const filteredListByStatus: IListItemProps[] = useMemo(() => {
    const res =
      status === 'all'
        ? orderList
        : status === 'active'
        ? orderList.filter((e) => e.status !== 'PROCESSED')
        : status === 'archive'
        ? orderList.filter((e) => e.status === 'PROCESSED')
        : [];

    return res.map(
      (i) =>
        ({
          id: i.id,
          title: i.head.outlet?.name,
          documentDate: getDateString(i.documentDate),
          status: i.status,
          subtitle: `№ ${i.number} от ${getDateString(i.documentDate)} на ${getDateString(i.head?.onDate)}`,
          isFromRoute: !!i.head.route,
          lineCount: i.lines.length,
          errorMessage: i.errorMessage,
        } as IListItemProps),
    );
  }, [status, orderList]);

  const sections = useMemo(
    () =>
      filteredListByStatus.reduce<SectionDataProps>((prev, item) => {
        const sectionTitle = item.documentDate;
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
    [filteredListByStatus],
  );

  const [delList, setDelList] = useState<IDelList>({});
  const isDelList = useMemo(() => !!Object.keys(delList).length, [delList]);

  const handleDeleteDocs = useCallback(() => {
    const docIds = Object.keys(delList);

    const deleteDocs = () => {
      dispatch(documentActions.removeDocuments(docIds));
      setDelList({});
    };

    deleteSelectedItems(delList, deleteDocs);
  }, [delList, dispatch]);

  const handleAddDocument = useCallback(() => {
    navigation.navigate('OrderEdit');
  }, [navigation]);

  useEffect(() => {
    if (!filterVisible && searchQuery) {
      setSearchQuery('');
    }
  }, [filterVisible, searchQuery]);

  const renderRight = useCallback(
    () => (
      <View style={styles.buttons}>
        {isDelList ? (
          <DeleteButton onPress={handleDeleteDocs} />
        ) : (
          <>
            <AddButton onPress={handleAddDocument} />
            <IconButton
              icon="card-search-outline"
              style={filterVisible && { backgroundColor: colors.card }}
              size={26}
              onPress={() => setFilterVisible((prev) => !prev)}
            />
          </>
        )}
      </View>
    ),
    [colors.card, filterVisible, handleAddDocument, handleDeleteDocs, isDelList],
  );

  const renderLeft = useCallback(() => isDelList && <CloseButton onPress={() => setDelList({})} />, [isDelList]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: isDelList ? renderLeft : navBackDrawer,
      headerRight: renderRight,
      title: isDelList ? `Выделено заявок: ${Object.values(delList).length}` : 'Заявки',
    });
  }, [delList, isDelList, navigation, renderLeft, renderRight]);

  const [showDateBegin, setShowDateBegin] = useState(false);
  const handleApplyDateBegin = (_event: any, selectedDateBegin: Date | undefined) => {
    setShowDateBegin(false);

    if (selectedDateBegin) {
      setDateBegin(selectedDateBegin.toISOString().slice(0, 10));
    }
  };
  const handlePresentDateBegin = () => {
    setShowDateBegin(true);
  };

  const [showDateEnd, setShowDateEnd] = useState(false);
  const handleApplyDateEnd = (_event: any, selectedDateEnd: Date | undefined) => {
    setShowDateEnd(false);

    if (selectedDateEnd) {
      setDateEnd(selectedDateEnd);
      // setDateEnd(selectedDateEnd.toISOString().slice(0, 10));
    }
  };
  const handlePresentDateEnd = () => {
    setShowDateEnd(true);
  };

  const [cont, setCont] = useState<IReferenceData | undefined>(undefined);
  const handleSearchContact = useCallback(() => {
    const a: IReferenceData | undefined = cont;
    navigation.navigate('SelectRefItem', {
      refName: 'contact',
      fieldName: 'contact',
      value: a && [a],
    });
    setCont(a);
  }, [cont, navigation]);

  console.log('dateBegin', dateBegin);
  console.log('dateEnd', dateEnd);
  const renderItem: ListRenderItem<IListItemProps> = ({ item }) => {
    const debt = debets.find((d) => d.id === orderList.find((o) => o.id === item.id)?.head?.contact.id);

    return (
      <ScreenListItem
        key={item.id}
        {...item}
        onPress={() =>
          isDelList
            ? setDelList(getDelList(delList, item.id, item.status!))
            : navigation.navigate('OrderView', { id: item.id })
        }
        onLongPress={() => setDelList(getDelList(delList, item.id, item.status!))}
        checked={!!delList[item.id]}
      >
        {!!debt?.saldoDebt && (
          <MediumText>
            {`Просрочено: ${formatValue({ type: 'currency', decimals: 2 }, debt?.saldoDebt ?? 0)}, ${debt.dayLeft} дн.`}
          </MediumText>
        )}
      </ScreenListItem>
    );
  };

  const renderSectionHeader = ({ section }: any) => (
    <SubTitle style={[styles.header, styles.sectionTitle]}>{section.title}</SubTitle>
  );

  const renderSectionFooter = useCallback(
    (item: any) => (status === 'all' && sections ? <OrderListTotal sectionOrders={item.section} /> : null),
    [sections, status],
  );

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  return (
    <AppScreen>
      <FilterButtons status={status} onPress={setStatus} style={styles.marginBottom5} />
      {filterVisible && (
        <>
          <View style={styles.flexDirectionRow}>
            <Searchbar
              placeholder="Поиск"
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={[styles.flexGrow, styles.searchBar]}
              autoFocus
              selectionColor={searchStyle}
            />
          </View>
          <View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: -10 }}
            >
              <View style={{ width: '50%' }}>
                <SelectableInput
                  label="С даты"
                  value={dateBegin ? getDateString(dateBegin) : ''}
                  // value={getDateString(dateBegin || '') || ''}
                  onPress={handlePresentDateBegin}
                />
              </View>
              <View style={{ width: '50%' }}>
                <SelectableInput
                  label="По дату"
                  value={dateEnd ? getDateString(dateEnd) : ''}
                  onPress={handlePresentDateEnd}
                />
              </View>
            </View>
            <SelectableInput label="Организация" value={cont?.name || ''} onPress={handleSearchContact} />
            <SelectableInput
              label="Магазин"
              value={dateEnd ? getDateString(dateEnd) : ''}
              onPress={handlePresentDateEnd}
            />
          </View>
          <ItemSeparator />
        </>
      )}
      <SectionList
        sections={sections}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={ItemSeparator}
        renderSectionHeader={renderSectionHeader}
        ListEmptyComponent={EmptyList}
        renderSectionFooter={renderSectionFooter}
        keyboardShouldPersistTaps={'handled'}
      />
      {showDateBegin && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(dateBegin || new Date())}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleApplyDateBegin}
        />
      )}

      {showDateEnd && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(dateEnd || new Date())}
          // value={new Date(dateEnd || '')}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleApplyDateEnd}
          // onTouchCancel={() => setShowDateBegin(false)}
        />
      )}
    </AppScreen>
  );
};

export default OrderListScreen;
