import React, { useCallback, useState, useLayoutEffect, useMemo, useEffect } from 'react';
import { StyleSheet, SectionList, ListRenderItem, SectionListData, View, RefreshControl, Text } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { IconButton, Searchbar } from 'react-native-paper';

import {
  globalStyles as styles,
  AppScreen,
  ItemSeparator,
  Status,
  DrawerButton,
  SubTitle,
  AddButton,
  ScreenListItem,
  IListItemProps,
  Menu,
} from '@lib/mobile-ui';

import { refSelectors, useSelector } from '@lib/store';

import { StackNavigationProp } from '@react-navigation/stack';

import { getDateString } from '@lib/mobile-app';

import { IListItem } from '@lib/mobile-types';

import { IDocumentType } from '@lib/types';

import { IMovementDocument } from '../../store/types';
import SwipeListItem from '../../components/SwipeListItem';
import { DocStackParamList } from '../../navigation/Root/types';
import { statusTypes, dataTypes } from '../../utils/constants';

export interface DocListProps {
  orders: IListItemProps[];
}

export interface DocListSectionProps {
  title: string;
}
export type SectionDataProps = SectionListData<IListItemProps, DocListSectionProps>[];

export const DocListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<DocStackParamList, 'DocList'>>();

  const { loading } = useSelector((state) => state.documents);
  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  const [date, setDate] = useState(dataTypes[0]);

  const list = useSelector((state) => state.documents.list)
    ?.filter((i) =>
      i?.head?.fromContact?.name || i?.head?.toContact?.name || i.documentType.description || i.number || i.documentDate
        ? (i.documentType.remainsField === 'fromContact'
            ? i?.head?.fromContact?.name.toUpperCase().includes(searchQuery.toUpperCase())
            : i?.head?.toContact?.name.toUpperCase().includes(searchQuery.toUpperCase())) ||
          i?.documentType?.description?.toUpperCase().includes(searchQuery.toUpperCase()) ||
          i.number.toUpperCase().includes(searchQuery.toUpperCase()) ||
          getDateString(i.documentDate).toUpperCase().includes(searchQuery.toUpperCase())
        : true,
    )
    .sort((a, b) =>
      date.id === 'new'
        ? new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime()
        : new Date(a.documentDate).getTime() - new Date(b.documentDate).getTime(),
    ) as IMovementDocument[];

  const [status, setStatus] = useState<Status>('all');

  const documentTypes = refSelectors.selectByName<IDocumentType>('documentType')?.data;

  const docTypes: IListItem[] = useMemo(
    () =>
      [{ id: 'all', value: 'Все' }].concat(
        documentTypes?.map(
          (i) =>
            ({
              id: i.name,
              value: i.description || '',
            } as IListItem),
        ),
      ),
    [documentTypes],
  );

  const [type, setType] = useState(docTypes[0]);

  const filteredList: IListItemProps[] = useMemo(() => {
    if (!list.length) {
      return [];
    }
    const res =
      status === 'all'
        ? list
        : status === 'active'
        ? list.filter((e) => e.status !== 'PROCESSED')
        : status !== 'archive' && status !== 'all'
        ? list.filter((e) => e.status === status)
        : [];

    return res.map((i) => {
      return {
        id: i.id,
        title: i.documentType.description || '',
        // (i.documentType.remainsField === 'fromContact' ? i.head.fromContact?.name : i.head.toContact?.name) || '',
        documentDate: getDateString(i.documentDate),
        status: i.status,
        documentType: i.documentType.name,
        // subtitle: `№ ${i.number} на ${getDateString(i.documentDate)}`,
        isFromRoute: !!i.head.route,
        lineCount: i.lines.length,
        errorMessage: i.errorMessage,
      };
    });
  }, [status, list]);

  const f1: IListItemProps[] = useMemo(() => {
    const res = type?.id === 'all' ? filteredList : filteredList?.filter((i) => i?.documentType === type?.id);
    return res;
  }, [filteredList, type?.id]);

  const sections = useMemo(
    () =>
      f1?.reduce<SectionDataProps>((prev, item) => {
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
    [f1],
  );

  const handleAddDocument = useCallback(() => {
    navigation.navigate('DocEdit');
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

  const renderItem: ListRenderItem<IListItemProps> = ({ item }) => {
    const doc = list?.find((r) => r.id === item.id);
    return doc ? (
      <SwipeListItem renderItem={item} item={doc} routeName="DocView">
        <ScreenListItem {...item} onSelectItem={() => navigation.navigate('DocView', { id: item.id })}>
          <View>
            <Text style={[styles.field, { color: colors.text }]}>
              {
                (doc.documentType.remainsField === 'fromContact'
                  ? doc.head.fromContact?.name
                  : doc.head.toContact?.name) || ''
                // doc.documentType.description
              }
            </Text>
            <Text style={[styles.field, { color: colors.text }]}>
              № {doc.number} на {getDateString(doc.documentDate)}
            </Text>
          </View>
        </ScreenListItem>
      </SwipeListItem>
    ) : null;
  };

  return (
    <AppScreen>
      {/* <FilterButtons status={status} onPress={setStatus} style={styles.marginBottom5} /> */}
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
