import React, { useCallback, useState, useLayoutEffect, useMemo, useEffect, useRef } from 'react';
import { ListRenderItem, RefreshControl, SectionList, SectionListData, Text, View } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';

import { IconButton, Searchbar } from 'react-native-paper';

import { useSelector } from '@lib/store';
import {
  globalStyles as styles,
  AddButton,
  DrawerButton,
  FilterButtons,
  ItemSeparator,
  Status,
  AppScreen,
  SubTitle,
  ScreenListItem,
  IListItemProps,
  BottomSheet,
  PrimeButton,
  RadioGroup,
} from '@lib/mobile-ui';

import { StackNavigationProp } from '@react-navigation/stack';

import { getDateString } from '@lib/mobile-app';

import { BottomSheetModal } from '@gorhom/bottom-sheet';

import { IListItem } from '@lib/mobile-types';

import { IOrderDocument } from '../../store/types';
import SwipeListItem from '../../components/SwipeListItem';
import { OrdersStackParamList } from '../../navigation/Root/types';

export interface OrderListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<IListItemProps, OrderListSectionProps>[];

const OrderListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<OrdersStackParamList, 'OrderList'>>();

  const loading = useSelector((state) => state.documents.loading);
  const orders = useSelector((state) => state.documents.list) as IOrderDocument[];
  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  const list = orders
    ?.filter((i) =>
      i.documentType?.name === 'order'
        ? i?.head?.contact.name || i?.head?.outlet.name || i.number || i.documentDate || i.head.onDate
          ? i?.head?.contact?.name.toUpperCase().includes(searchQuery.toUpperCase()) ||
            i?.head?.outlet?.name.toUpperCase().includes(searchQuery.toUpperCase()) ||
            i.number.toUpperCase().includes(searchQuery.toUpperCase()) ||
            getDateString(i.documentDate).toUpperCase().includes(searchQuery.toUpperCase()) ||
            getDateString(i.head.onDate).toUpperCase().includes(searchQuery.toUpperCase())
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
          title: i.head.outlet?.name,
          documentDate: getDateString(i.documentDate),
          status: i.status,
          subtitle: `№ ${i.number} от ${getDateString(i.documentDate)} на ${getDateString(i.head?.onDate)}`,
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
    navigation.navigate('OrderEdit');
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

  const renderItem: ListRenderItem<IListItemProps> = ({ item }) => {
    const doc = list.find((r) => r.id === item.id);
    return doc ? (
      <SwipeListItem renderItem={item} item={doc} routeName="OrderView">
        <ScreenListItem {...item} onSelectItem={() => navigation.navigate('OrderView', { id: item.id })} />
      </SwipeListItem>
    ) : null;
  };

  const docTypeRef = useRef<BottomSheetModal>(null);
  const handleDismissDocType = () => docTypeRef.current?.dismiss();

  const handleApplyDocType = () => {
    docTypeRef.current?.dismiss();

    switch (selectedDocType.id) {
      case 'order':
        console.log('order');
        break;
      case 'return':
        console.log('return');
        break;
      default:
        return;
    }
  };

  const listDocumentType: IListItem[] = [
    { id: 'order', value: 'Заявка' },
    { id: 'return', value: 'Возврат' },
  ];

  const [selectedDocType, setSelectedDocType] = useState(listDocumentType[0]);

  const handlePresentDocType = () => {
    setSelectedDocType(listDocumentType[0]);
    docTypeRef.current?.present();
  };

  return (
    <AppScreen>
      <PrimeButton icon="plus-circle-outline" onPress={handlePresentDocType}>
        Добавить документ
      </PrimeButton>
      <FilterButtons status={status} onPress={setStatus} style={styles.marginBottom5} />
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
        refreshControl={<RefreshControl refreshing={loading} title="загрузка данных..." />}
        ListEmptyComponent={!loading ? <Text style={styles.emptyList}>Список пуст</Text> : null}
      />
      <BottomSheet
        sheetRef={docTypeRef}
        title={'Тип документа'}
        snapPoints={['20%', '90%']}
        onDismiss={handleDismissDocType}
        onApply={handleApplyDocType}
      >
        <RadioGroup
          options={listDocumentType}
          onChange={(option) => setSelectedDocType(option)}
          activeButtonId={selectedDocType?.id}
        />
      </BottomSheet>
    </AppScreen>
  );
};

export default OrderListScreen;
