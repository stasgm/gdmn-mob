import React, { useCallback, useState, useLayoutEffect, useMemo, useEffect } from 'react';
import { SectionList, ListRenderItem, SectionListData, View } from 'react-native';
import { useFocusEffect, useIsFocused, useNavigation, useTheme } from '@react-navigation/native';
import { Searchbar } from 'react-native-paper';

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
  DeleteButton,
  CloseButton,
  EmptyList,
  AppActivityIndicator,
  SearchButton,
  MediumText,
} from '@lib/mobile-ui';

import { documentActions, useDispatch, useSelector } from '@lib/store';

import { StackNavigationProp } from '@react-navigation/stack';

import { deleteSelectedItems, getDateString, getDelList, keyExtractor } from '@lib/mobile-app';

import { IDelList } from '@lib/mobile-types';

import { IScanDocument } from '../../store/types';
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
  const dispatch = useDispatch();

  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  const list = useSelector((state) => state.documents.list) as IScanDocument[];

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
        {isDelList ? (
          <DeleteButton onPress={handleDeleteDocs} />
        ) : (
          <>
            <SearchButton onPress={() => setFilterVisible((prev) => !prev)} visible={filterVisible} />
            <AddButton onPress={handleAddDocument} />
          </>
        )}
      </View>
    ),
    [filterVisible, handleAddDocument, handleDeleteDocs, isDelList],
  );

  const renderLeft = useCallback(() => isDelList && <CloseButton onPress={() => setDelList({})} />, [isDelList]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: isDelList ? renderLeft : navBackDrawer,
      headerRight: renderRight,
      title: isDelList ? `Выделено документов: ${Object.values(delList).length}` : 'Сканирование',
    });
  }, [delList, isDelList, navigation, renderLeft, renderRight]);

  const [filteredList, setFilteredList] = useState<IFilteredList>({
    searchQuery: '',
    list,
  });

  useFocusEffect(
    React.useCallback(() => {
      if (!searchQuery) {
        // setFilteredList({ searchQuery, list: list.filter((i) => i.documentType.name !== 'scan') });
        setFilteredList({
          searchQuery,
          list: list
            .filter((i) => i.documentType.name === 'scan')
            .sort((a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime()),
        });
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
      } as IListItemProps;
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

  const renderItem: ListRenderItem<IListItemProps> = ({ item }) => {
    const doc = list?.find((r) => r.id === item.id);

    return doc ? (
      <ScreenListItem
        key={item.id}
        {...item}
        onPress={() =>
          isDelList
            ? setDelList(getDelList(delList, item.id, item.status!))
            : navigation.navigate('ScanView', { id: item.id })
        }
        onLongPress={() => setDelList(getDelList(delList, item.id, item.status!))}
        checked={!!delList[item.id]}
      >
        <View>
          <MediumText>{doc.head.department?.name || ''}</MediumText>
          <MediumText>
            № {doc.number} на {getDateString(doc.documentDate)}
          </MediumText>
        </View>
      </ScreenListItem>
    ) : null;
  };

  const renderSectionHeader = useCallback(
    ({ section }) => <SubTitle style={[styles.header, styles.sectionTitle]}>{section.title}</SubTitle>,
    [],
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
              selectionColor={colors.primary}
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
        // refreshControl={<RefreshControl refreshing={loading} title="идет загрузка данных..." />}
        ListEmptyComponent={EmptyList}
      />
    </AppScreen>
  );
};
