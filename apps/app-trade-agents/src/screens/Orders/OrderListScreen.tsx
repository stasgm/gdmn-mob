import React, { useCallback, useState, useRef, useLayoutEffect, useMemo } from 'react';
import { FlatList, ListRenderItem, RefreshControl, SectionList, SectionListData, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { docSelectors, documentActions, useDispatch, useSelector } from '@lib/store';
import {
  globalStyles as styles,
  useActionSheet,
  AddButton,
  DrawerButton,
  MenuButton,
  FilterButtons,
  ItemSeparator,
  Status,
  AppScreen,
  SubTitle,
} from '@lib/mobile-ui';

import { StatusType } from '@lib/types';

import { IOrderDocument } from '../../store/docs/types';

import { getDateString } from '../../utils/helpers';

// eslint-disable-next-line import/no-cycle
import OrderListItem from './components/OrderListItem';

export interface OrderListItemProps {
  title: string;
  documentDate: string;
  subtitle?: string;
  status?: StatusType;
  isFromRoute?: boolean;
  lineCount?: number;
}
export interface OrderListRenderItemProps extends OrderListItemProps {
  id: string;
  // onPress: (id: string) => void;
}

export interface OrderListProps {
  orders: OrderListRenderItemProps[];
}

export interface OrderListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<OrderListRenderItemProps, OrderListSectionProps>[];

const renderItem: ListRenderItem<OrderListRenderItemProps> = ({ item }) => {
  return <OrderListItem {...item} />;
};

const OrderListScreen = () => {
  const navigation = useNavigation();
  const showActionSheet = useActionSheet();

  const { loading } = useSelector((state) => state.documents);

  const list = (docSelectors.selectByDocType('order') as IOrderDocument[]).sort(
    (a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime(),
  );

  const [status, setStatus] = useState<Status>('all');

  const filteredList: OrderListRenderItemProps[] = useMemo(() => {
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
          title: i.head.outlet.name,
          documentDate: getDateString(i.documentDate),
          status: i.status,
          subtitle: `№ ${i.number} от ${getDateString(i.documentDate)} на ${getDateString(i.head?.onDate)}`,
          isFromRoute: !!i.head.route,
          lineCount: i.lines.length,
        } as OrderListRenderItemProps),
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
    navigation.navigate('OrderEdit');
  }, [navigation]);

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Добавить',
        onPress: handleAddDocument,
      },
      {
        title: 'Отмена',
        type: 'cancel',
      },
    ]);
  }, [showActionSheet, handleAddDocument]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <DrawerButton />,
      headerRight: () => (
        <View style={styles.buttons}>
          <MenuButton actionsMenu={actionsMenu} />
          <AddButton onPress={handleAddDocument} />
        </View>
      ),
    });
  }, [actionsMenu, handleAddDocument, navigation]);

  return (
    <AppScreen>
      <FilterButtons status={status} onPress={setStatus} style={{ marginBottom: 5 }} />
      <SectionList
        sections={sections}
        renderItem={renderItem}
        keyExtractor={({ id }) => id}
        ItemSeparatorComponent={ItemSeparator}
        renderSectionHeader={({ section }) => (
          <SubTitle style={[styles.header, { backgroundColor: '#ddd', paddingVertical: 5 }]}>{section.title}</SubTitle>
        )}
        refreshControl={<RefreshControl refreshing={loading} title="загрузка данных..." />}
        ListEmptyComponent={!loading ? <Text style={styles.emptyList}>Список пуст</Text> : null}
      />
    </AppScreen>
  );
};

export default OrderListScreen;
