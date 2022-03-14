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

import { refSelectors, useSelector } from '@lib/store';
import { getDateString } from '@lib/mobile-ui/src/components/Datapicker/index';

import { StackNavigationProp } from '@react-navigation/stack';

import { IDocumentType } from '@lib/types';

import { IDocDocument } from '../../store/types';
import SwipeListItem from '../../components/SwipeListItem';
import { DocStackParamList } from '../../navigation/Root/types';

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

  const list = useSelector((state) => state.documents.list).sort(
    (a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime(),
  ) as IDocDocument[];

  const docTypes = refSelectors.selectByName<IDocumentType>('documentType')?.data;

  const [status, setStatus] = useState<Status>('all');

  const filteredList: IListItemProps[] = useMemo(() => {
    const res =
      status === 'all'
        ? list
        : status === 'active'
        ? list?.filter((e) => e.status !== 'PROCESSED')
        : status === 'archive'
        ? list?.filter((e) => e.status === 'PROCESSED')
        : [];

    return res?.map((i) => {
      const docType = docTypes.find((e) => e.id === i?.documentType.id);
      return {
        id: i.id,
        title: (docType?.remainsField === 'fromContact' ? i.head.fromContact?.name : i.head.toContact?.name) || '',
        documentDate: getDateString(i.documentDate),
        status: i.status,
        subtitle: `№ ${i.number} на ${getDateString(i.documentDate)}`,
        isFromRoute: !!i.head.route,
        lineCount: i.lines.length,
        errorMessage: i.errorMessage,
      } as IListItemProps;
    });
  }, [status, list, docTypes]);

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
    navigation.navigate('DocEdit');
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
    const doc = list?.find((r) => r.id === item.id);
    return doc ? (
      <SwipeListItem renderItem={item} item={doc} routeName="DocView">
        <ScreenListItem {...item} onSelectItem={() => navigation.navigate('DocView', { id: item.id })} />
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
