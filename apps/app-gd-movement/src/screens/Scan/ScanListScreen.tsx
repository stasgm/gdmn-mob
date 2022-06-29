import React, { useCallback, useState, useLayoutEffect, useMemo, useEffect } from 'react';
import { StyleSheet, SectionList, ListRenderItem, SectionListData, View, RefreshControl, Text } from 'react-native';
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
  Menu,
} from '@lib/mobile-ui';

import { docSelectors, refSelectors, useSelector } from '@lib/store';

import { StackNavigationProp } from '@react-navigation/stack';

import { getDateString } from '@lib/mobile-app';

import { IListItem } from '@lib/mobile-types';

import { IDocumentType } from '@lib/types';

import { IScanDocument } from '../../store/types';
import SwipeListItem from '../../components/SwipeListItem';
import { ScanStackParamList } from '../../navigation/Root/types';
import { statusTypes, dataTypes, docContactTypes } from '../../utils/constants';
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

  const [date, setDate] = useState(dataTypes[0]);

  const textStyle = useMemo(() => [styles.field, { color: colors.text }], [colors.text]);

  // const list = useSelector((state) => state.documents.list) as IMovementDocument[];

  const list = docSelectors.selectByDocType<IScanDocument>('scan');

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

  // useFocusEffect(
  //   React.useCallback(() => {
  //     if (!searchQuery) {
  //       setFilteredList({ searchQuery, list });
  //     }
  //   }, [list, searchQuery]),
  // );

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

  const documentTypes = refSelectors.selectByName<IDocumentType>('documentType')?.data;

  const docTypes: IListItem[] = useMemo(
    () =>
      documentTypes
        ? docContactTypes.concat(
            documentTypes?.map(
              (i) =>
                ({
                  id: i.name,
                  value: i.description || '',
                } as IListItem),
            ),
          )
        : docContactTypes,
    [documentTypes],
  );

  const [type, setType] = useState(docTypes[0]);

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

    const newRes = type?.id === 'all' ? res : res?.filter((i) => i?.documentType.name === type?.id);

    newRes.sort((a, b) =>
      date.id === 'new'
        ? new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime()
        : new Date(a.documentDate).getTime() - new Date(b.documentDate).getTime(),
    );

    return newRes.map((i) => {
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
  }, [date.id, filteredList.list, status, type?.id]);

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

  const [visibleType, setVisibleType] = useState(false);
  const [visibleStatus, setVisibleStatus] = useState(false);
  const [visibleDate, setVisibleDate] = useState(false);

  const handleSelectType = () => {
    return setVisibleType(true);
  };
  const handleSelectStatus = () => {
    return setVisibleStatus(true);
  };

  const handleSelectDate = () => {
    return setVisibleDate(true);
  };

  const handleDismissType = () => {
    return setVisibleType(false);
  };
  const handleDismissStatus = () => {
    return setVisibleStatus(false);
  };
  const handleDismissDate = () => {
    return setVisibleDate(false);
  };

  const handleApplyType = useCallback((option) => {
    setVisibleType(false);
    setType(option);
  }, []);

  const handleApplyStatus = useCallback((option) => {
    setVisibleStatus(false);
    setStatus(option.id);
  }, []);

  const handleApplyDate = useCallback((option) => {
    setVisibleDate(false);
    setDate(option);
  }, []);

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
      <View style={[styles.containerCenter, localStyles.container]}>
        <Menu
          key={'MenuType'}
          title="Тип"
          visible={visibleType}
          onChange={handleApplyType}
          onDismiss={handleDismissType}
          onPress={handleSelectType}
          options={docTypes}
          activeOptionId={type.id}
          style={[styles.btnTab, styles.firstBtnTab]}
          menuStyle={localStyles.menu}
          isActive={type.id !== 'all'}
          iconName={'chevron-down'}
        />
        <Menu
          key={'MenuStatus'}
          title="Статус"
          visible={visibleStatus}
          onChange={handleApplyStatus}
          onDismiss={handleDismissStatus}
          onPress={handleSelectStatus}
          options={statusTypes}
          activeOptionId={status}
          style={[styles.btnTab]}
          menuStyle={localStyles.menu}
          isActive={status !== 'all'}
          iconName={'chevron-down'}
        />
        <Menu
          key={'MenuDataSort'}
          title="Дата"
          visible={visibleDate}
          onChange={handleApplyDate}
          onDismiss={handleDismissDate}
          onPress={handleSelectDate}
          options={dataTypes}
          activeOptionId={date.id}
          style={[styles.btnTab, styles.lastBtnTab]}
          menuStyle={localStyles.menu}
          isActive={date.id !== 'new'}
          iconName={'chevron-down'}
        />
      </View>
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

const localStyles = StyleSheet.create({
  container: {
    marginBottom: 5,
  },
  menu: {
    justifyContent: 'center',
    marginLeft: 6,
    width: '100%',
  },
});
