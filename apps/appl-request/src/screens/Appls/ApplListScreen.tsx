import React, { useState, useLayoutEffect, useMemo } from 'react';
import { ListRenderItem, SectionList, SectionListData, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { docSelectors, useSelector } from '@lib/store';
import {
  globalStyles as styles,
  DrawerButton,
  FilterButtons,
  Status,
  AppScreen,
  SubTitle,
  ItemSeparator,
} from '@lib/mobile-ui';

import { IApplDocument } from '../../store/types';
import { getDateString } from '../../utils/helpers';

import { shortenString } from '../../utils/stringOperations';

import ApplListItem, { ApplListRenderItemProps } from './components/ApplListItem';
import { IconButton, Searchbar, useTheme } from 'react-native-paper';

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

  const loading = useSelector((state) => state.documents.loading);

  const list = docSelectors
    .selectByDocType<IApplDocument>('request')
    .filter(
      (d) =>
        !!d.head &&
        (d.number || d.documentDate || d.head.headCompany.name || d.head.dept.name
          ? d.number.toUpperCase().includes(searchQuery.toUpperCase()) ||
            d.documentDate.toUpperCase().includes(searchQuery.toUpperCase()) ||
            d.head.headCompany.name.toUpperCase().includes(searchQuery.toUpperCase()) ||
            d.head.dept.name.toUpperCase().includes(searchQuery.toUpperCase())
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
          description: shortenString(i.head.justification, 90),
          lineCount: i.lines.length,
          errorMessage: i.errorMessage,
        } as ApplListRenderItemProps),
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <DrawerButton />,
      headerRight: () => (
        <IconButton
          icon="card-search-outline"
          style={filterVisible && { backgroundColor: colors.card }}
          size={26}
          onPress={() => setFilterVisible((prev) => !prev)}
        />
      ),
    });
  }, [colors.card, filterVisible, navigation]);

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
            />
          </View>
          <ItemSeparator />
        </>
      )}
      <SectionList
        sections={sections}
        renderItem={renderItem}
        keyExtractor={({ id }) => id}
        renderSectionHeader={({ section }) => <SubTitle style={[styles.header]}>{section.title}</SubTitle>}
        ListEmptyComponent={!loading ? <Text style={styles.emptyList}>Список пуст</Text> : null}
        // Performance settings
        removeClippedSubviews={true} // Unmount components when outside of window
        initialNumToRender={6}
        maxToRenderPerBatch={6} // Reduce number in each render batch
        updateCellsBatchingPeriod={100} // Increase time between renders
        windowSize={7} // Reduce the window size
      />
    </AppScreen>
  );
};

export default ApplListScreen;
