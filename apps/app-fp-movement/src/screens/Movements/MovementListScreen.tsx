import React, { useCallback, useState, useLayoutEffect, useMemo, useEffect } from 'react';
import { ListRenderItem, RefreshControl, SectionList, SectionListData, Text, View } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';

import { IconButton, Searchbar } from 'react-native-paper';

import { useSelector } from '@lib/store';
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
} from '@lib/mobile-ui';

import { StackNavigationProp } from '@react-navigation/stack';

import { getDateString } from '@lib/mobile-app';

import { IMovementDocument } from '../../store/types';
import SwipeListItem from '../../components/SwipeListItem';
import { MovementStackParamList } from '../../navigation/Root/types';
import { navBackDrawer } from '../../components/navigateOptions';
import { getBarcode } from '../../utils/helpers';

export interface MovementListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<IListItemProps, MovementListSectionProps>[];

export const MovementListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<MovementStackParamList, 'MovementList'>>();

  const loading = useSelector((state) => state.documents.loading);
  const movements = useSelector((state) => state.documents.list) as IMovementDocument[];
  const { colors } = useTheme();

  const textStyle = useMemo(() => [styles.field, { color: colors.text }], [colors.text]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  const list = movements
    ?.filter((i) =>
      i.documentType?.name === 'movement'
        ? i?.head?.fromDepart.name || i?.head?.toDepart.name || i.number || i.documentDate
          ? i?.head?.fromDepart?.name.toUpperCase().includes(searchQuery.toUpperCase()) ||
            i?.head?.toDepart?.name.toUpperCase().includes(searchQuery.toUpperCase()) ||
            i.number.toUpperCase().includes(searchQuery.toUpperCase()) ||
            getDateString(i.documentDate).toUpperCase().includes(searchQuery.toUpperCase())
          : true
        : false,
    )
    .sort((a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime());

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
    navigation.navigate('MovementEdit');
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

  const renderItem: ListRenderItem<IListItemProps> = ({ item }) => {
    const doc = list.find((r) => r.id === item.id);
    return doc ? (
      <SwipeListItem renderItem={item} item={doc} routeName="MovementView">
        <ScreenListItem {...item} onSelectItem={() => navigation.navigate('MovementView', { id: item.id })}>
          <View>
            <Text style={textStyle}>Откуда: {doc.head.fromDepart?.name || ''}</Text>
            <Text style={textStyle}>Куда: {doc.head.toDepart?.name || ''}</Text>
            <Text style={textStyle}>
              № {doc.number} на {getDateString(doc.documentDate)}
            </Text>
          </View>
        </ScreenListItem>
      </SwipeListItem>
    ) : null;
  };

  const searchStyle = useMemo(() => colors.primary, [colors.primary]);

  const a = '000728150222185822562386150222';
  const b = getBarcode(a);
  console.log('b', b);

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
