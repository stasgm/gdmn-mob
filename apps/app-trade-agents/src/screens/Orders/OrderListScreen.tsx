import React, { useCallback, useState, useLayoutEffect, useMemo, useEffect } from 'react';
import { ListRenderItem, RefreshControl, SectionList, SectionListData, Text, View } from 'react-native';
import { useFocusEffect, useNavigation, useTheme } from '@react-navigation/native';

import { IconButton, Searchbar } from 'react-native-paper';

import { docSelectors, useSelector } from '@lib/store';
import {
  globalStyles as styles,
  AddButton,
  DrawerButton,
  FilterButtons,
  ItemSeparator,
  Status,
  AppScreen,
  SubTitle,
  ScreenListItem,
  IListItemProps,
} from '@lib/mobile-ui';

import { StackNavigationProp } from '@react-navigation/stack';

import { getDateString } from '@lib/mobile-app';

import { IOrderDocument } from '../../store/types';
import SwipeListItem from '../../components/SwipeListItem';
import { OrdersStackParamList } from '../../navigation/Root/types';

interface IFilteredList {
  searchQuery: string;
  list: IOrderDocument[];
}
export interface OrderListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<IListItemProps, OrderListSectionProps>[];

const OrderListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<OrdersStackParamList, 'OrderList'>>();

  const { loading } = useSelector((state) => state.documents);
  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  const list = docSelectors
    .selectByDocType<IOrderDocument>('order')
    // ?.filter((i) =>
    //   i?.head?.contact.name || i?.head?.outlet.name || i.number || i.documentDate || i.head.onDate
    //     ? i?.head?.contact?.name.toUpperCase().includes(searchQuery.toUpperCase()) ||
    //       i?.head?.outlet?.name.toUpperCase().includes(searchQuery.toUpperCase()) ||
    //       i.number.toUpperCase().includes(searchQuery.toUpperCase()) ||
    //       getDateString(i.documentDate).toUpperCase().includes(searchQuery.toUpperCase()) ||
    //       getDateString(i.head.onDate).toUpperCase().includes(searchQuery.toUpperCase())
    //     : true,
    // )
    .sort((a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime());

  const [filteredList, setFilteredList] = useState<IFilteredList>({
    searchQuery: '',
    list,
  });

  useFocusEffect(
    React.useCallback(() => {
      if (!searchQuery) {
        setFilteredList({ searchQuery, list });
      }
    }, [list, searchQuery]),
  );

  useEffect(() => {
    if (searchQuery !== filteredList.searchQuery) {
      if (!searchQuery) {
        setFilteredList({
          searchQuery,
          list,
        });
      } else {
        const lower = searchQuery.toLowerCase();

        const fn = ({ head, documentDate, number }: IOrderDocument) =>
          head.contact.name?.toLowerCase().includes(lower) ||
          head.outlet?.name?.toLowerCase().includes(lower) ||
          number.toLowerCase().includes(lower) ||
          getDateString(documentDate).toLowerCase().includes(lower);

        let gr;

        if (
          filteredList.searchQuery &&
          searchQuery.length > filteredList.searchQuery.length &&
          searchQuery.startsWith(filteredList.searchQuery)
        ) {
          gr = filteredList.list.filter(fn);
        } else {
          gr = list.filter(fn);
        }

        setFilteredList({
          searchQuery,
          list: gr,
        });
      }
    }
  }, [filteredList, searchQuery, list]);

  const [status, setStatus] = useState<Status>('all');

  const newFilteredList: IListItemProps[] = useMemo(() => {
    const res =
      status === 'all'
        ? filteredList.list
        : status === 'active'
        ? filteredList.list.filter((e) => e.status !== 'PROCESSED')
        : status === 'archive'
        ? filteredList.list.filter((e) => e.status === 'PROCESSED')
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
  }, [status, filteredList.list]);

  const sections = useMemo(
    () =>
      newFilteredList.reduce<SectionDataProps>((prev, item) => {
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
    [newFilteredList],
  );

  const handleAddDocument = useCallback(() => {
    navigation.navigate('OrderEdit');
  }, [navigation]);

  useEffect(() => {
    if (!filterVisible && searchQuery) {
      setSearchQuery('');
    }
  }, [filterVisible, searchQuery]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <DrawerButton />,
      headerRight: () => (
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
    });
  }, [colors.card, filterVisible, handleAddDocument, navigation]);

  const renderItem: ListRenderItem<IListItemProps> = ({ item }) => {
    const doc = list.find((r) => r.id === item.id);
    return doc ? (
      <SwipeListItem renderItem={item} item={doc} routeName="OrderView">
        <ScreenListItem {...item} onSelectItem={() => navigation.navigate('OrderView', { id: item.id })} />
      </SwipeListItem>
    ) : null;
  };

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
            />
          </View>
          <ItemSeparator />
        </>
      )}
      <SectionList
        sections={sections}
        renderItem={renderItem}
        keyExtractor={({ id }) => id}
        ItemSeparatorComponent={ItemSeparator}
        renderSectionHeader={({ section }) => (
          <SubTitle style={[styles.header, styles.sectionTitle]}>{section.title}</SubTitle>
        )}
        refreshControl={<RefreshControl refreshing={loading} title="загрузка данных..." />}
        ListEmptyComponent={!loading ? <Text style={styles.emptyList}>Список пуст</Text> : null}
      />
    </AppScreen>
  );
};

export default OrderListScreen;
