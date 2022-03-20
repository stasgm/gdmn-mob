import React, { useCallback, useState, useLayoutEffect, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  SectionList,
  ListRenderItem,
  SectionListData,
  View,
  RefreshControl,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useTheme as useSearchTheme } from '@react-navigation/native';
import { IconButton, Searchbar, useTheme } from 'react-native-paper';

import {
  globalStyles as styles,
  AppScreen,
  ItemSeparator,
  Status,
  DrawerButton,
  SubTitle,
  AddButton,
  FilterButtons,
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
import { statusTypes } from '../../utils/constants';

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
  const notSearchColors = useTheme().colors;
  const { colors } = useSearchTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

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
    .sort((a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime()) as IMovementDocument[];

  const [status, setStatus] = useState<Status>('all');

  const documentTypes = refSelectors.selectByName<IDocumentType>('documentType')?.data;

  const docTypes: IListItem[] = useMemo(() => {
    const res = [{ id: 'all', value: 'Все' }];

    return res.concat(
      documentTypes?.map((i) => {
        return {
          id: i.name,
          value: i.description,
          // (i.documentType.remainsField === 'fromContact' ? i.head.fromContact?.name : i.head.toContact?.name) || '',,
        } as IListItem;
      }),
    );
  }, [documentTypes]);

  const statuss = statusTypes;

  const [type, setType] = useState(docTypes[0]);
  const [date, setDate] = useState(docTypes[0]);

  const filteredList: IListItemProps[] = useMemo(() => {
    if (!list.length) {
      return [];
    }
    const res =
      status === 'all'
        ? list
        : status === 'active'
        ? list.filter((e) => e.status !== 'PROCESSED')
        : status === 'archive'
        ? list.filter((e) => e.status === 'PROCESSED')
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

  console.log('dt', docTypes);
  console.log('st', statuss);

  const handleType = () => {
    return setVisibleType(true);
  };
  const handleStatus = () => {
    return setVisibleStatus(true);
  };

  const handleDate = () => {
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

  const handleT = useCallback((option) => {
    setVisibleType(false);
    setType(option);
  }, []);

  const handleS = useCallback((option) => {
    setVisibleStatus(false);
    setStatus(option.id);
  }, []);
  const handleD = useCallback((option) => {
    setVisibleDate(false);
    setDate(option.id);
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
      <View style={[localStyles.container, styles.marginBottom5]}>
        <Menu
          title="Тип"
          visible={visibleType}
          onChange={handleT}
          onDismiss={handleDismissType}
          onPress={handleType}
          options={docTypes}
          activeOptionId={type?.id}
          style={[
            localStyles.btnTab,
            localStyles.firstBtnTab,
            type.id !== 'all' && { backgroundColor: notSearchColors.primary },
          ]}
          textColor={type.id === 'all' ? notSearchColors.primary : notSearchColors.background}
          menuStyle={localStyles.menu}
        />
        <Menu
          title="Статус"
          visible={visibleStatus}
          onChange={handleS}
          onDismiss={handleDismissStatus}
          onPress={handleStatus}
          options={statuss}
          activeOptionId={status}
          style={[localStyles.btnTab, status !== 'all' && { backgroundColor: notSearchColors.primary }]}
          textColor={status === 'all' ? notSearchColors.primary : notSearchColors.background}
        />
        <Menu
          title="Дата"
          visible={visibleDate}
          onChange={handleD}
          onDismiss={handleDismissDate}
          onPress={handleDate}
          options={statuss}
          activeOptionId={date.id}
          style={[localStyles.btnTab, localStyles.lastBtnTab]}
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    // marginHorizontal: 5,
    // paddingLeft: 10,
  },
  menu: {
    // flex: 1,
    // display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  btnTab: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 0.5,
    // padding: 10,
    marginHorizontal: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,

    width: '30%',
  },
  firstBtnTab: {
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  lastBtnTab: {
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
});
