import React, { useCallback, useState, useLayoutEffect, useMemo, useEffect } from 'react';
import { StyleSheet, SectionList, ListRenderItem, SectionListData, View, Text } from 'react-native';
import { useFocusEffect, useNavigation, useTheme } from '@react-navigation/native';
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
  Menu,
  DeleteButton,
  CloseButton,
  EmptyList,
  SearchButton,
  navBackDrawer,
} from '@lib/mobile-ui';

import { documentActions, refSelectors, useDispatch, useSelector } from '@lib/store';

import { StackNavigationProp } from '@react-navigation/stack';

import { deleteSelectedItems, getDateString, getDelList, keyExtractor } from '@lib/mobile-app';

import { IDelList, IListItem } from '@lib/mobile-types';

import { IDocumentType } from '@lib/types';

import { IMovementDocument } from '../../store/types';
import { DocStackParamList } from '../../navigation/Root/types';
import { statusTypes, dataTypes, docContactTypes } from '../../utils/constants';

export interface DocListProps {
  orders: IListItemProps[];
}

interface IFilteredList {
  searchQuery: string;
  list: IMovementDocument[];
}

export interface DocListSectionProps {
  title: string;
}
export type SectionDataProps = SectionListData<IListItemProps, DocListSectionProps>[];

export const DocListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<DocStackParamList, 'DocList'>>();
  const dispatch = useDispatch();

  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  const [date, setDate] = useState(dataTypes[0]);

  const textStyle = useMemo(() => [styles.field, { color: colors.text }], [colors.text]);

  const list = useSelector((state) => state.documents.list) as IMovementDocument[];

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
    navigation.navigate('DocEdit');
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
      title: isDelList ? `Выделено документов: ${Object.values(delList).length}` : 'Документы',
    });
  }, [delList, isDelList, navigation, renderLeft, renderRight]);

  const [filteredList, setFilteredList] = useState<IFilteredList>({
    searchQuery: '',
    list,
  });

  useFocusEffect(
    React.useCallback(() => {
      if (!searchQuery) {
        setFilteredList({ searchQuery, list: list.filter((i) => i.documentType.name !== 'scan') });
      }
    }, [list, searchQuery]),
  );

  useEffect(() => {
    if (searchQuery !== filteredList.searchQuery) {
      if (!searchQuery) {
        setFilteredList({
          searchQuery,
          list: list.filter((i) => i.documentType.name !== 'scan'),
        });
      } else {
        const lower = searchQuery.toLowerCase();

        const fn = ({ head, documentDate, number, documentType }: IMovementDocument) =>
          (documentType.remainsField === 'fromContact'
            ? head.fromContact?.name?.toLowerCase().includes(lower)
            : head.toContact?.name?.toLowerCase().includes(lower)) ||
          documentType?.description?.toLowerCase().includes(lower) ||
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
          const newList = list.filter((i) => i.documentType.name !== 'scan');
          gr = newList.filter(fn);
        }

        setFilteredList({
          searchQuery,
          list: gr,
        });
      }
    }
  }, [filteredList, searchQuery, list]);

  const [status, setStatus] = useState<Status>('all');

  const documentTypes = refSelectors
    .selectByName<IDocumentType>('documentType')
    ?.data.filter((i) => i.subtype === 'inventory');

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
        isFromRoute: !!i.head.route,
        lineCount: i.lines.length,
        errorMessage: i.errorMessage,
      } as IListItemProps;
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

  const handleApplyType = useCallback((option: IListItem) => {
    setVisibleType(false);
    setType(option);
  }, []);

  const handleApplyStatus = useCallback((option: any) => {
    setVisibleStatus(false);
    setStatus(option.id);
  }, []);

  const handleApplyDate = useCallback((option: IListItem) => {
    setVisibleDate(false);
    setDate(option);
  }, []);

  const renderItem: ListRenderItem<IListItemProps> = ({ item }) => {
    const doc = list?.find((r) => r.id === item.id);

    return doc ? (
      <ScreenListItem
        key={item.id}
        {...item}
        onPress={() =>
          isDelList
            ? setDelList(getDelList(delList, item.id, item.status!))
            : navigation.navigate('DocView', { id: item.id })
        }
        onLongPress={() => setDelList(getDelList(delList, item.id, item.status!))}
        checked={!!delList[item.id]}
        addInfo={
          <View>
            <Text style={textStyle}>
              {(doc.documentType.remainsField === 'fromContact'
                ? doc.head.fromContact?.name
                : doc.head.toContact?.name) || ''}
            </Text>
            <Text style={textStyle}>
              № {doc.number} на {getDateString(doc.documentDate)}
            </Text>
          </View>
        }
      />
    ) : null;
  };

  const renderSectionHeader = useCallback(
    ({ section }: any) => <SubTitle style={[styles.header, styles.sectionTitle]}>{section.title}</SubTitle>,
    [],
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
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={ItemSeparator}
        renderSectionHeader={renderSectionHeader}
        ListEmptyComponent={EmptyList}
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
