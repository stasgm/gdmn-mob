import React, { useCallback, useState, useLayoutEffect, useMemo, useEffect } from 'react';
import { ListRenderItem, SectionList, SectionListData, View } from 'react-native';
import { useIsFocused, useNavigation, useTheme } from '@react-navigation/native';

import { IconButton, Searchbar } from 'react-native-paper';

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
} from '@lib/mobile-ui';

import { StackNavigationProp } from '@react-navigation/stack';

import { getDateString, keyExtractor, useFilteredDocList } from '@lib/mobile-app';

import { IOrderDocument } from '../../store/types';
import { OrdersStackParamList } from '../../navigation/Root/types';
import { navBackDrawer } from '../../components/navigateOptions';

import OrderListTotal from './components/OrderListTotal';

export interface OrderListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<IListItemProps, OrderListSectionProps>[];

interface IFilteredList {
  searchQuery: string;
  orders: IOrderDocument[];
}

const OrderListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<OrdersStackParamList, 'OrderList'>>();
  console.log('OrderListScreen');

  const orderList = useFilteredDocList<IOrderDocument>('order').sort(
    (a, b) =>
      new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime() &&
      new Date(b.head.onDate).getTime() - new Date(a.head.onDate).getTime(),
  );

  const { colors } = useTheme();

  const searchStyle = colors.primary;

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  const [filteredList, setFilteredList] = useState<IFilteredList>({
    searchQuery: '',
    orders: orderList,
  });

  useEffect(() => {
    if (searchQuery !== filteredList.searchQuery) {
      if (!searchQuery) {
        setFilteredList({
          searchQuery,
          orders: orderList,
        });
      } else {
        const lower = searchQuery.toLowerCase();

        const fn = (i: IOrderDocument) =>
          i?.head?.contact?.name.toUpperCase().includes(lower) ||
          i?.head?.outlet?.name.toUpperCase().includes(lower) ||
          i.number.toUpperCase().includes(lower) ||
          getDateString(i.documentDate).toUpperCase().includes(lower) ||
          getDateString(i.head.onDate).toUpperCase().includes(lower);

        let newList;

        if (
          filteredList.searchQuery &&
          searchQuery.length > filteredList.searchQuery.length &&
          searchQuery.startsWith(filteredList.searchQuery)
        ) {
          newList = filteredList.orders?.filter(fn);
        } else {
          newList = orderList?.filter(fn);
        }

        setFilteredList({
          searchQuery,
          orders: newList,
        });
      }
    }
  }, [filteredList, orderList, searchQuery]);

  const [status, setStatus] = useState<Status>('all');

  const filteredListByStatus: IListItemProps[] = useMemo(() => {
    const res =
      status === 'all'
        ? filteredList.orders
        : status === 'active'
        ? filteredList.orders.filter((e) => e.status !== 'PROCESSED')
        : status === 'archive'
        ? filteredList.orders.filter((e) => e.status === 'PROCESSED')
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
  }, [status, filteredList.orders]);

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
        <IconButton
          icon="card-search-outline"
          style={filterVisible && { backgroundColor: colors.card }}
          size={26}
          onPress={() => setFilterVisible((prev) => !prev)}
        />
        <AddButton onPress={handleAddDocument} />
      </View>
    ),
    [colors.card, filterVisible, handleAddDocument],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackDrawer,
      headerRight: renderRight,
    });
  }, [navigation, renderRight]);

  const handlePressOrder = useCallback((id: string) => navigation.navigate('OrderView', { id }), [navigation]);

  const renderItem: ListRenderItem<IListItemProps> = useCallback(
    ({ item }) => <ScreenListItem key={item.id} {...item} onSelectItem={() => handlePressOrder(item.id)} />,
    [handlePressOrder],
  );

  const renderSectionHeader = useCallback(
    ({ section }) => <SubTitle style={[styles.header, styles.sectionTitle]}>{section.title}</SubTitle>,
    [],
  );

  const renderSectionFooter = useCallback(
    (item) => (status === 'all' && sections ? <OrderListTotal sectionOrders={item.section} /> : null),
    [sections, status],
  );

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  // const RC = useMemo(() => <RefreshControl refreshing={loading} title="загрузка данных..." />, [loading]);

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
          <ItemSeparator />
        </>
      )}
      <SectionList
        sections={sections}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={ItemSeparator}
        renderSectionHeader={renderSectionHeader}
        // refreshControl={RC}
        ListEmptyComponent={EmptyList}
        renderSectionFooter={renderSectionFooter}
      />
    </AppScreen>
  );
};

export default OrderListScreen;
