import React, { useCallback, useState, useLayoutEffect, useMemo, useEffect } from 'react';
import { SectionList, ListRenderItem, SectionListData, View, RefreshControl, Text, Alert } from 'react-native';
import { useFocusEffect, useIsFocused, useNavigation, useTheme } from '@react-navigation/native';
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
  DeleteButton,
  CloseButton,
  EmptyList,
  AppActivityIndicator,
} from '@lib/mobile-ui';

import { documentActions, useDispatch, useSelector } from '@lib/store';

import { StackNavigationProp } from '@react-navigation/stack';

import { getDateString, keyExtractor } from '@lib/mobile-app';

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
  const { loading } = useSelector((state) => state.documents);
  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  const textStyle = useMemo(() => [styles.field, { color: colors.text }], [colors.text]);

  const list = useSelector((state) => state.documents.list) as IScanDocument[];

  // const list = docSelectors.selectByDocType<IScanDocument>('scan');
  const [delList, setDelList] = useState({});

  const handleAddDocument = useCallback(() => {
    navigation.navigate('ScanEdit');
  }, [navigation]);

  const handelAddDeletelList = useCallback(
    (lineId: string, status: string, checkedId: string) => {
      if (checkedId) {
        const newList = Object.entries(delList).reduce((sum, cur) => {
          const curId = cur[0];
          const curStatus = cur[1];
          if (curId !== checkedId) {
            return { ...sum, [curId]: curStatus };
          } else {
            return { ...sum };
          }
        }, {});
        setDelList(newList);
      } else {
        setDelList({ ...delList, [lineId]: status });
      }
    },
    [delList],
  );

  const handleDeleteDocs = useCallback(() => {
    const docIds = Object.keys(delList);
    const statusList = Object.values(delList).find((i) => i === 'READY' || i === 'SENT');

    if (statusList) {
      Alert.alert('Внимание!', 'Среди выделенных документов есть необработанные документы. Продолжить удаление?', [
        {
          text: 'Да',
          onPress: () => {
            dispatch(documentActions.removeDocuments(docIds));
            setDelList([]);
          },
        },
        {
          text: 'Отмена',
        },
      ]);
    } else {
      Alert.alert('Вы уверены, что хотите удалить позиции документа?', '', [
        {
          text: 'Да',
          onPress: () => {
            dispatch(documentActions.removeDocuments(docIds));
            setDelList([]);
          },
        },
        {
          text: 'Отмена',
        },
      ]);
    }
  }, [delList, dispatch]);

  useEffect(() => {
    if (!filterVisible && searchQuery) {
      setSearchQuery('');
    }
  }, [filterVisible, searchQuery]);

  const renderRight = useCallback(
    () => (
      <View style={styles.buttons}>
        {delList && Object.values(delList).length > 0 ? (
          <DeleteButton onPress={handleDeleteDocs} />
        ) : (
          <>
            <IconButton
              icon="card-search-outline"
              style={filterVisible && { backgroundColor: colors.card }}
              size={26}
              onPress={() => setFilterVisible((prev) => !prev)}
            />
            <AddButton onPress={handleAddDocument} />
          </>
        )}
      </View>
    ),
    [colors.card, delList, filterVisible, handleAddDocument, handleDeleteDocs],
  );

  const renderLeft = useCallback(
    () => delList && Object.values(delList).length > 0 && <CloseButton onPress={() => setDelList([])} />,
    [delList],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: delList && Object.values(delList).length > 0 ? renderLeft : navBackDrawer,
      headerRight: renderRight,
      title:
        delList && Object.values(delList).length > 0
          ? `Выделено документов: ${Object.values(delList).length}`
          : 'Сканирование',
    });
  }, [delList, navigation, renderLeft, renderRight]);

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
      const checkedId = (delList && Object.keys(delList).find((i) => i === item.id)) || '';
      return doc ? (
        <ScreenListItem
          {...item}
          onSelectItem={() => navigation.navigate('ScanView', { id: item.id })}
          onCheckItem={() => handelAddDeletelList(item.id, item.status || '', checkedId)}
          isChecked={checkedId ? true : false}
          isDelList={delList && Object.values(delList).length > 0 ? true : false}
        >
          <View>
            <Text style={textStyle}>{doc.head.department?.name || ''}</Text>
            <Text style={textStyle}>
              № {doc.number} на {getDateString(doc.documentDate)}
            </Text>
          </View>
        </ScreenListItem>
      ) : null;
    },
    [delList, handelAddDeletelList, list, navigation, textStyle],
  );

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
