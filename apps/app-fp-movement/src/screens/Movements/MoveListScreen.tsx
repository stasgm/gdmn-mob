import React, { useCallback, useState, useLayoutEffect, useMemo, useEffect } from 'react';
import { Alert, ListRenderItem, RefreshControl, SectionList, SectionListData, Text, View } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';

import { IconButton, Searchbar } from 'react-native-paper';

import { documentActions, useDispatch, useSelector } from '@lib/store';
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
  DeleteButton,
  CloseButton,
} from '@lib/mobile-ui';

import { StackNavigationProp } from '@react-navigation/stack';

import { getDateString } from '@lib/mobile-app';

import { IMoveDocument } from '../../store/types';
import { MoveStackParamList } from '../../navigation/Root/types';
import { navBackDrawer } from '../../components/navigateOptions';

export interface MoveListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<IListItemProps, MoveListSectionProps>[];

export const MoveListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<MoveStackParamList, 'MoveList'>>();
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.documents.loading);
  const movements = useSelector((state) => state.documents.list) as IMoveDocument[];
  const { colors } = useTheme();

  const textStyle = useMemo(() => [styles.field, { color: colors.text }], [colors.text]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  const list = movements
    ?.filter((i) =>
      i.documentType?.name === 'move'
        ? i?.head?.fromDepart.name || i?.head?.toDepart.name || i.number || i.documentDate
          ? i?.head?.fromDepart?.name.toUpperCase().includes(searchQuery.toUpperCase()) ||
            i?.head?.toDepart?.name.toUpperCase().includes(searchQuery.toUpperCase()) ||
            i.number.toUpperCase().includes(searchQuery.toUpperCase()) ||
            getDateString(i.documentDate).toUpperCase().includes(searchQuery.toUpperCase())
          : true
        : false,
    )
    .sort((a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime());

  const [delList, setDelList] = useState({});

  const [status, setStatus] = useState<Status>('all');

  const filteredList: IListItemProps[] = useMemo(() => {
    const res =
      status === 'all'
        ? list
        : status === 'active'
        ? list.filter((e) => e.status !== 'PROCESSED')
        : status === 'archive'
        ? list.filter((e) => e.status === 'PROCESSED')
        : [];

    return res.map(
      (i) =>
        ({
          id: i.id,
          title: i.documentType.description || '',
          documentDate: getDateString(i.documentDate),
          status: i.status,
          // subtitle: `№ ${i.number} от ${getDateString(i.documentDate)} на ${getDateString(i.head?.onDate)}`,
          lineCount: i.lines.length,
          errorMessage: i.errorMessage,
        } as IListItemProps),
    );
  }, [status, list]);

  const sections = useMemo(
    () =>
      filteredList.reduce<SectionDataProps>((prev, item) => {
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
    [filteredList],
  );

  const handleAddDocument = useCallback(() => {
    navigation.navigate('MoveEdit');
  }, [navigation]);

  const handelAddDeletelList = useCallback(
    (lineId: string, docStatus: string, checkedId: string) => {
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
        setDelList({ ...delList, [lineId]: docStatus });
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
      Alert.alert('Вы уверены, что хотите удалить документы?', '', [
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
          ? `Выделено документов ?: ${Object.values(delList).length}`
          : 'Документы ?',
    });
  }, [delList, navigation, renderLeft, renderRight]);

  const renderItem: ListRenderItem<IListItemProps> = ({ item }) => {
    const doc = list.find((r) => r.id === item.id);
    const checkedId = (delList && Object.keys(delList).find((i) => i === item.id)) || '';
    return doc ? (
      // <SwipeListItem renderItem={item} item={doc} routeName="MoveView">
      <ScreenListItem
        {...item}
        onSelectItem={() => navigation.navigate('MoveView', { id: item.id })}
        onCheckItem={() => handelAddDeletelList(item.id, item.status || '', checkedId)}
        isChecked={checkedId ? true : false}
        isDelList={delList && Object.values(delList).length > 0 ? true : false}
      >
        <View>
          <Text style={textStyle}>Откуда: {doc.head.fromDepart?.name || ''}</Text>
          <Text style={textStyle}>Куда: {doc.head.toDepart?.name || ''}</Text>
          <Text style={textStyle}>
            № {doc.number} на {getDateString(doc.documentDate)}
          </Text>
        </View>
      </ScreenListItem>
    ) : // </SwipeListItem>
    null;
  };

  const searchStyle = useMemo(() => colors.primary, [colors.primary]);

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
