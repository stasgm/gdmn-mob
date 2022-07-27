import React, { useCallback, useState, useLayoutEffect, useMemo, useEffect } from 'react';
import { Alert, ListRenderItem, SectionList, SectionListData, View, StyleSheet } from 'react-native';
import { useIsFocused, useNavigation, useTheme } from '@react-navigation/native';

import { Searchbar } from 'react-native-paper';

import { documentActions, refSelectors, useDispatch, useSelector } from '@lib/store';
import {
  globalStyles as styles,
  AddButton,
  ItemSeparator,
  Status,
  AppScreen,
  SubTitle,
  ScreenListItem,
  IListItemProps,
  DeleteButton,
  CloseButton,
  AppActivityIndicator,
  EmptyList,
  MediumText,
  SearchButton,
  Menu,
} from '@lib/mobile-ui';

import { StackNavigationProp } from '@react-navigation/stack';

import { getDateString, keyExtractor } from '@lib/mobile-app';

import { INamedEntity } from '@lib/types';

import { IListItem } from '@lib/mobile-types';

import { IMoveDocument } from '../../store/types';
import { MoveStackParamList } from '../../navigation/Root/types';
import { navBackDrawer } from '../../components/navigateOptions';
import { dateTypes, docDepartTypes, statusTypes } from '../../utils/constants';

export interface MoveListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<IListItemProps, MoveListSectionProps>[];

export const MoveListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<MoveStackParamList, 'MoveList'>>();
  const dispatch = useDispatch();

  // const movements = useSelector((state) => state.documents.list) as IMoveDocument[];
  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  const list = (
    useSelector((state) => state.documents.list)?.filter((i) => i.documentType?.name === 'movement') as IMoveDocument[]
  ).sort((a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime());

  // const list = movements
  //   ?.filter((i) =>
  //     i.documentType?.name === 'move'
  //       ? i?.head?.fromDepart.name || i?.head?.toDepart.name || i.number || i.documentDate
  //         ? i?.head?.fromDepart?.name.toUpperCase().includes(searchQuery.toUpperCase()) ||
  //           i?.head?.toDepart?.name.toUpperCase().includes(searchQuery.toUpperCase()) ||
  //           i.number.toUpperCase().includes(searchQuery.toUpperCase()) ||
  //           getDateString(i.documentDate).toUpperCase().includes(searchQuery.toUpperCase())
  //         : true
  //       : false,
  //   )
  //   .sort((a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime());

  const [delList, setDelList] = useState({});

  const [date, setDate] = useState(dateTypes[0]);

  const [status, setStatus] = useState<Status>('all');

  const documentSubtypes = refSelectors.selectByName<INamedEntity>('documentSubtype')?.data;

  const docTypes: IListItem[] = useMemo(
    () =>
      documentSubtypes
        ? docDepartTypes.concat(
            documentSubtypes?.map(
              (i) =>
                ({
                  id: i.id,
                  value: i.name || '',
                } as IListItem),
            ),
          )
        : docDepartTypes,
    [documentSubtypes],
  );

  const [type, setType] = useState(docTypes[0]);

  const filteredList: IListItemProps[] = useMemo(() => {
    const res =
      status === 'all'
        ? list
        : status === 'active'
        ? list.filter((e) => e.status !== 'PROCESSED')
        : status !== 'archive' && status !== 'all'
        ? list.filter((e) => e.status === status)
        : [];

    const newRes = type?.id === 'all' ? res : res?.filter((i) => i?.head.subtype.id === type?.id);

    newRes.sort((a, b) =>
      date.id === 'new'
        ? new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime()
        : new Date(a.documentDate).getTime() - new Date(b.documentDate).getTime(),
    );

    return newRes.map(
      (i) =>
        ({
          id: i.id,
          title: i.head.subtype.name || '',
          documentDate: getDateString(i.documentDate),
          status: i.status,

          lineCount: i.lines.length,
          errorMessage: i.errorMessage,
          children: (
            <View>
              <MediumText>Откуда: {i.head.fromDepart?.name || ''}</MediumText>
              <MediumText>Куда: {i.head.toDepart?.name || ''}</MediumText>
              <MediumText>
                № {i.number} на {getDateString(i.documentDate)}
              </MediumText>
            </View>
          ),
        } as IListItemProps),
    );
  }, [status, list, type?.id, date.id]);

  console.log('stat', status);
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

  const [visibleType, setVisibleType] = useState(false);
  const [visibleStatus, setVisibleStatus] = useState(false);
  const [visibleDate, setVisibleDate] = useState(false);

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
            <SearchButton onPress={() => setFilterVisible((prev) => !prev)} visible={filterVisible} />
            <AddButton onPress={handleAddDocument} />
          </>
        )}
      </View>
    ),
    [delList, filterVisible, handleAddDocument, handleDeleteDocs],
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
          : 'Документы',
    });
  }, [delList, navigation, renderLeft, renderRight]);

  const handlePressDoc = useCallback((id: string) => navigation.navigate('MoveView', { id }), [navigation]);

  const renderItem: ListRenderItem<IListItemProps> = useCallback(
    ({ item }) => {
      const doc = list.find((r) => r.id === item.id);
      const checkedId = (delList && Object.keys(delList).find((i) => i === item.id)) || '';
      return doc ? (
        <ScreenListItem
          key={item.id}
          {...item}
          onSelectItem={() => handlePressDoc(item.id)}
          onCheckItem={() => handelAddDeletelList(item.id, item.status || '', checkedId)}
          isChecked={checkedId ? true : false}
          isDelList={delList && Object.values(delList).length > 0 ? true : false}
        />
      ) : null;
    },
    [delList, handelAddDeletelList, handlePressDoc, list],
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
      {/* <FilterButtons status={status} onPress={setStatus} style={styles.marginBottom5} /> */}
      <View style={[styles.containerCenter, localStyles.container]}>
        <Menu
          key={'MenuType'}
          title="Тип"
          visible={visibleType}
          onChange={handleApplyType}
          onDismiss={() => setVisibleType(false)}
          onPress={() => setVisibleType(true)}
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
          onDismiss={() => setVisibleStatus(false)}
          onPress={() => setVisibleStatus(true)}
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
          onDismiss={() => setVisibleDate(false)}
          onPress={() => setVisibleDate(true)}
          options={dateTypes}
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
        // refreshControl={<RefreshControl refreshing={loading} title="загрузка данных..." />}
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
