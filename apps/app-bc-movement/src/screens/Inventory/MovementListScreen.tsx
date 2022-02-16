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
  ScreenListItem,
  IListItemProps,
} from '@lib/mobile-ui';

import { docSelectors, useSelector } from '@lib/store';
import { getDateString } from '@lib/mobile-ui/src/components/Datapicker/index';

import { StackNavigationProp } from '@react-navigation/stack';

import { IInventoryDocument, IMovementDocument } from '../../store/types';
import SwipeListItem from '../../components/SwipeListItem';
import { InventoryStackParamList } from '../../navigation/Root/types';

export interface MovementListProps {
  orders: IListItemProps[];
}

export interface MovementListSectionProps {
  title: string;
}
export type SectionDataProps = SectionListData<IListItemProps, MovementListSectionProps>[];

export const MovementListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<InventoryStackParamList, 'MovementList'>>();

  const { loading } = useSelector((state) => state.documents);

  const list = docSelectors
    .selectByDocType<IMovementDocument>('inventory')
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
          title: `№ ${i.number} на ${getDateString(i.documentDate)}`,
          // title: i.head.department?.name,
          documentDate: getDateString(i.documentDate),
          status: i.status,
          subtitle: `Откуда: ${i.head.departmentFrom?.name || ''} \nКуда: ${i.head.departmentTo?.name || ''}`,
          // i.head.department?.name,
          // subtitle: `№ ${i.number} на ${getDateString(i.documentDate)}`,
          isFromRoute: !!i.head.route,
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

  const renderItem: ListRenderItem<IListItemProps> = ({ item }) => {
    const doc = list.find((r) => r.id === item.id);
    return doc ? (
      <SwipeListItem renderItem={item} item={doc} routeName="MovementView">
        <ScreenListItem {...item} onSelectItem={() => navigation.navigate('MovementView', { id: item.id })} />
      </SwipeListItem>
    ) : null;
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
