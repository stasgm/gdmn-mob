import React, { useCallback, useState, useLayoutEffect, useMemo, useEffect } from 'react';
import { ListRenderItem, RefreshControl, SectionList, SectionListData, Text, View } from 'react-native';
import { useIsFocused, useNavigation, useTheme } from '@react-navigation/native';

import { IconButton, Searchbar } from 'react-native-paper';

import { docSelectors, refSelectors, useSelector } from '@lib/store';
import {
  globalStyles as styles,
  FilterButtons,
  ItemSeparator,
  Status,
  AppScreen,
  SubTitle,
  ScreenListItem,
  IListItemProps,
  AppActivityIndicator,
  Menu,
} from '@lib/mobile-ui';

import { StackNavigationProp } from '@react-navigation/stack';

import { getDateString } from '@lib/mobile-app';

import { IDocumentType, IReference } from '@lib/types';

import { IListItem } from '@lib/mobile-types';

import { ISellbillDocument } from '../../store/types';
import SwipeListItem from '../../components/SwipeListItem';
import { SellbillStackParamList } from '../../navigation/Root/types';
import { navBackDrawer } from '../../components/navigateOptions';

// import { getBarcode } from '../../utils/helpers';

export interface SellbillListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<IListItemProps, SellbillListSectionProps>[];

export const SellbillListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<SellbillStackParamList, 'SellbillList'>>();

  const loading = useSelector((state) => state.documents.loading);

  const { colors } = useTheme();

  // const textStyle = useMemo(() => [styles.field, { color: colors.text }], [colors.text]);

  // const movements = useSelector((state) => state.documents.list) as ITempDocument[];
  // const temps = useSelector((state) => state.documents.list) as ITempDocument[];
  const temps = docSelectors.selectByDocType<ISellbillDocument>('otves');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  // const otvesTypes = refSelectors
  // .selectByName<IReference<IDocumentType>>('documentType')
  // ?.data.filter((i) => i.);

  const list = temps
    ?.filter((i) =>
      i.documentType?.name === 'otves'
        ? i?.head?.contact.name || i?.head?.outlet.name || i.number || i.documentDate
          ? i?.head?.contact?.name.toUpperCase().includes(searchQuery.toUpperCase()) ||
            i?.head?.outlet?.name.toUpperCase().includes(searchQuery.toUpperCase()) ||
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
          subtitle: `№ ${i.number} на ${getDateString(i.head?.onDate)}`,
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

  const handleAddDocument = useCallback(
    (name) => {
      navigation.navigate('ScanOrder', { id: name });
      setVisible(false);
    },
    [navigation],
  );

  const typeList: IDocumentType[] = refSelectors.selectByName<IReference<IDocumentType>>('documentType')?.data;

  const a: IListItem[] = typeList
    .filter((i) => i.isShip && i.name !== 'shipFree')
    .map((i) => {
      return { id: i.name || '', value: i.description || '' };
    });

  const [visible, setVisible] = useState(false);

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
        <Menu
          key={'MenuType'}
          visible={visible}
          onChange={handleAddDocument}
          onDismiss={() => setVisible(false)}
          onPress={() => setVisible(true)}
          options={a}
          iconName={'plus'}
          iconSize={30}
        />
      </View>
    ),
    [a, colors.card, filterVisible, handleAddDocument, visible],
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
      <SwipeListItem renderItem={item} item={doc} routeName="SellbillView">
        <ScreenListItem {...item} onSelectItem={() => navigation.navigate('SellbillView', { id: item.id })} />
      </SwipeListItem>
    ) : null;
  };

  const searchStyle = useMemo(() => colors.primary, [colors.primary]);

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
