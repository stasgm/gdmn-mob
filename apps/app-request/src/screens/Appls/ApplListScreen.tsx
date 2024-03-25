import React, { useState, useLayoutEffect, useMemo, useCallback } from 'react';
import { ListRenderItem, SectionList, SectionListData, View } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';

import { docSelectors } from '@lib/store';
import {
  globalStyles as styles,
  FilterButtons,
  Status,
  AppScreen,
  SubTitle,
  ItemSeparator,
  SearchButton,
  EmptyList,
  navBackDrawer,
} from '@lib/mobile-ui';

import { Searchbar } from 'react-native-paper';

import { getDateString, keyExtractor, shortenString } from '@lib/mobile-hooks';

import { IApplDocument } from '../../store/types';

import ApplListItem, { ApplListRenderItemProps } from './components/ApplListItem';

export interface ApplListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<ApplListRenderItemProps, ApplListSectionProps>[];

const renderItem: ListRenderItem<ApplListRenderItemProps> = ({ item }) => {
  return <ApplListItem key={item.id} {...item} />;
};

const ApplListScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const { colors } = useTheme();

  const list = docSelectors
    .selectByDocType<IApplDocument>('request')
    .filter(
      (d) =>
        !!d.head &&
        (d.number || d.documentDate || d.head.headCompany.name || d.head.dept.name || d.head.applStatus.name
          ? d.number.toUpperCase().includes(searchQuery.toUpperCase()) ||
            getDateString(d.documentDate).includes(searchQuery.toUpperCase()) ||
            d.head.headCompany.name.toUpperCase().includes(searchQuery.toUpperCase()) ||
            d.head.dept.name.toUpperCase().includes(searchQuery.toUpperCase()) ||
            d.head.applStatus.name.toUpperCase().includes(searchQuery.toUpperCase())
          : true),
    ) //временно не выводить документы, если нет head
    .sort((a, b) => (a.number > b.number ? -1 : 1))
    .sort((a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime());

  const [status, setStatus] = useState<Status>('active');

  const filteredList: ApplListRenderItemProps[] = useMemo(() => {
    const res =
      status === 'all'
        ? list
        : status === 'active'
          ? list.filter((e) => e.status !== 'PROCESSED' && e.status !== 'ARCHIVE')
          : status === 'archive'
            ? list.filter((e) => e.status === 'PROCESSED' || e.status === 'ARCHIVE')
            : [];

    return res.map(
      (i) =>
        ({
          id: i.id,
          title: i.head.headCompany.name,
          dept: i.head.dept.name,
          documentDate: getDateString(i.documentDate),
          status: i.status,
          applStatus: `${i.head.applStatus.name} ${
            i.head.cancelReason ? '(' + shortenString(i.head.cancelReason, 50) + ')' : ''
          }`,
          subtitle: `№ ${i.number} от ${getDateString(i.documentDate)}`,
          description: shortenString(i.head.justification || '', 90),
          lineCount: i.lines.length,
          errorMessage: i.errorMessage,
        }) as ApplListRenderItemProps,
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

  const renderRight = useCallback(
    () => <SearchButton onPress={() => setFilterVisible((prev) => !prev)} visible={filterVisible} />,
    [filterVisible],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackDrawer,
      headerRight: renderRight,
    });
  }, [colors.card, filterVisible, navigation, renderRight]);

  const renderSectionHeader = useCallback(
    ({ section }: any) => <SubTitle style={[styles.header]}>{section.title}</SubTitle>,
    [],
  );

  return (
    <AppScreen>
      <FilterButtons status={status} onPress={setStatus} />
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
        renderSectionHeader={renderSectionHeader}
        ListEmptyComponent={EmptyList}
        removeClippedSubviews={true}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        updateCellsBatchingPeriod={100}
        windowSize={7}
      />
    </AppScreen>
  );
};

export default ApplListScreen;
