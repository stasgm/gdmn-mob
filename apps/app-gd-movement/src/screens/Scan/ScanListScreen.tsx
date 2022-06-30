import React, { useCallback, useState, useLayoutEffect, useMemo, useEffect } from 'react';
import { SectionList, ListRenderItem, SectionListData, View, RefreshControl, Text } from 'react-native';
import { useFocusEffect, useNavigation, useTheme } from '@react-navigation/native';
import { IconButton, Searchbar } from 'react-native-paper';

import {
  globalStyles as styles,
  AppScreen,
  ItemSeparator,
  Status,
  SubTitle,
  AddButton,
  ScreenListItem,
  IListItemProps,
  FilterButtons,
} from '@lib/mobile-ui';

import { useSelector } from '@lib/store';

import { StackNavigationProp } from '@react-navigation/stack';

import { getDateString } from '@lib/mobile-app';

import { IScanDocument } from '../../store/types';
import SwipeListItem from '../../components/SwipeListItem';
import { ScanStackParamList } from '../../navigation/Root/types';
import { navBackDrawer } from '../../components/navigateOptions';

export interface DocListProps {
  orders: IListItemProps[];
}

interface IFilteredList {
  searchQuery: string;
  list: IScanDocument[];
}

export interface ScanListSectionProps {
  title: string;
}
export type SectionDataProps = SectionListData<IListItemProps, ScanListSectionProps>[];

export const ScanListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<ScanStackParamList, 'ScanList'>>();

  const { loading } = useSelector((state) => state.documents);
  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  const textStyle = useMemo(() => [styles.field, { color: colors.text }], [colors.text]);

  const list = useSelector((state) => state.documents.list) as IScanDocument[];

  // const list = docSelectors.selectByDocType<IScanDocument>('scan');

  const handleAddDocument = useCallback(() => {
    navigation.navigate('ScanEdit');
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

  const [filteredList, setFilteredList] = useState<IFilteredList>({
    searchQuery: '',
    list,
  });

  useFocusEffect(
    React.useCallback(() => {
      if (!searchQuery) {
        // setFilteredList({ searchQuery, list: list.filter((i) => i.documentType.name !== 'scan') });
        setFilteredList({ searchQuery, list: list.filter((i) => i.documentType.name === 'scan') });
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

        const fn = ({ head, documentDate, number }: IScanDocument) =>
          head.contact?.name?.toLowerCase().includes(lower) ||
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
    if (!filteredList.list.length) {
      return [];
    }
    const res =
      status === 'all'
        ? filteredList.list
        : status === 'active'
        ? filteredList.list.filter((e) => e.status !== 'PROCESSED')
        : status !== 'archive' && status !== 'all'
        ? filteredList.list.filter((e) => e.status === status)
        : [];

    return res.map((i) => {
      return {
        id: i.id,
        title: i.documentType.description || '',
        documentDate: getDateString(i.documentDate),
        status: i.status,
        documentType: i.documentType.name,
        lineCount: i.lines.length,
        errorMessage: i.errorMessage,
      };
    });
  }, [filteredList.list, status]);

  const sections = useMemo(
    () =>
      newFilteredList?.reduce<SectionDataProps>((prev, item) => {
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

  const renderItem: ListRenderItem<IListItemProps> = useCallback(
    ({ item }) => {
      const doc = list?.find((r) => r.id === item.id);
      return doc ? (
        <SwipeListItem renderItem={item} item={doc} routeName="ScanView">
          <ScreenListItem {...item} onSelectItem={() => navigation.navigate('ScanView', { id: item.id })}>
            <View>
              <Text style={textStyle}>{doc.head.contact?.name || ''}</Text>
              <Text style={textStyle}>
                № {doc.number} на {getDateString(doc.documentDate)}
              </Text>
            </View>
          </ScreenListItem>
        </SwipeListItem>
      ) : null;
    },
    [list, navigation, textStyle],
  );

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
              selectionColor={colors.primary}
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
        refreshControl={<RefreshControl refreshing={loading} title="идет загрузка данных..." />}
        ListEmptyComponent={!loading ? <Text style={styles.emptyList}>Список пуст</Text> : null}
      />
    </AppScreen>
  );
};
