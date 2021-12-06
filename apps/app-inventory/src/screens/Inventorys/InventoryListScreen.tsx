import React, { useCallback, useState, useLayoutEffect, useMemo } from 'react';
import { SectionList, ListRenderItem, SectionListData, View, RefreshControl, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {
  globalStyles as styles,
  AppScreen,
  ItemSeparator,
  Status,
  DrawerButton,
  SubTitle,
  AddButton,
  FilterButtons,
} from '@lib/mobile-ui';

import { docSelectors, useSelector } from '@lib/store';
import { getDateString } from '@lib/mobile-ui/src/components/Datapicker/index';

import { IInventoryDocument } from '../../store/types';

import { IInventoryListRenderItemProps } from './components/InventoryListItem';

import { InventorySwipeListItem } from './components/InventorySwipeListItem';

export interface InventoryListProps {
  orders: IInventoryListRenderItemProps[];
}

export interface InventoryListSectionProps {
  title: string;
}
export type SectionDataProps = SectionListData<IInventoryListRenderItemProps, InventoryListSectionProps>[];

export const InventoryListScreen = () => {
  const navigation = useNavigation();

  const { loading } = useSelector((state) => state.documents);

  const list = docSelectors
    .selectByDocType<IInventoryDocument>('inventory')
    .sort((a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime());

  const [status, setStatus] = useState<Status>('all');

  const filteredList: IInventoryListRenderItemProps[] = useMemo(() => {
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
          title: i.head.contact?.name,
          documentDate: getDateString(i.documentDate),
          status: i.status,
          subtitle: `№ ${i.number} на ${getDateString(i.documentDate)}`,
          isFromRoute: !!i.head.route,
          lineCount: i.lines.length,
          errorMessage: i.errorMessage,
        } as IInventoryListRenderItemProps),
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
    navigation.navigate('InventoryEdit');
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <DrawerButton />,
      headerRight: () => (
        <View style={styles.buttons}>
          <AddButton onPress={handleAddDocument} />
        </View>
      ),
    });
  }, [handleAddDocument, navigation]);

  const renderItem: ListRenderItem<IInventoryListRenderItemProps> = ({ item }) => {
    const doc = list.find((r) => r.id === item.id);
    return doc ? <InventorySwipeListItem renderItem={item} item={doc} /> : null;
  };

  return (
    <AppScreen>
      <FilterButtons status={status} onPress={setStatus} style={styles.marginBottom5} />
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
