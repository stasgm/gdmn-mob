import React, { useCallback, useState, useLayoutEffect, useMemo, useEffect } from 'react';
import { Alert, ListRenderItem, SectionList, SectionListData, View } from 'react-native';
import { useIsFocused, useNavigation, useTheme } from '@react-navigation/native';

import { IconButton, Searchbar } from 'react-native-paper';

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
  EmptyList,
  AppActivityIndicator,
  CloseButton,
  DeleteButton,
} from '@lib/mobile-ui';

import { StackNavigationProp } from '@react-navigation/stack';

import { getDateString, keyExtractor } from '@lib/mobile-app';

import { documentActions, useDispatch, useSelector } from '@lib/store';

import { IOrderDocument } from '../../store/types';
import { OrdersStackParamList } from '../../navigation/Root/types';
import { navBackDrawer } from '../../components/navigateOptions';

import OrderListTotal from './components/OrderListTotal';

export interface OrderListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<IListItemProps, OrderListSectionProps>[];

// interface IFilteredList {
//   searchQuery: string;
//   orders: IOrderDocument[];
// }

const OrderListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<OrdersStackParamList, 'OrderList'>>();

  const dispatch = useDispatch();

  // const orderList = useFilteredDocList<IOrderDocument>('order').sort(
  //   (a, b) =>
  //     new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime() &&
  //     new Date(b.head.onDate).getTime() - new Date(a.head.onDate).getTime(),
  // );

  const orderList = (
    useSelector((state) => state.documents.list).filter((i) => i.documentType.name === 'order') as IOrderDocument[]
  ).sort(
    (a, b) =>
      new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime() &&
      new Date(b.head.onDate).getTime() - new Date(a.head.onDate).getTime(),
  );

  // const list = useSelector((state) => state.documents.list) as IMovementDocument[];

  // const orderList = list.sort(
  //   (a, b) =>
  //     new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime() &&
  //     new Date(b.head.onDate).getTime() - new Date(a.head.onDate).getTime(),
  // );

  const { colors } = useTheme();

  const searchStyle = colors.primary;

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  // const [filteredList, setFilteredList] = useState<IFilteredList>({
  //   searchQuery: '',
  //   orders: orderList,
  // });

  // useFocusEffect(
  //   React.useCallback(() => {
  //     if (!searchQuery && filteredList?.orders?.length && filteredList?.orders?.length !== orderList.length) {
  //       setFilteredList({ searchQuery, orders: orderList });
  //     }
  //   }, [filteredList.orders.length, orderList, searchQuery]),
  // );

  // useEffect(
  //   // React.useCallback(
  //   () => {
  //     if (!searchQuery && filteredList?.orders?.length && filteredList?.orders?.length !== orderList.length) {
  //       setFilteredList({ searchQuery, orders: orderList });
  //     }
  //   },
  //   [filteredList.orders.length, orderList, searchQuery],
  //   // ),
  // );

  // console.log('123', orderList[0]);

  // useEffect(
  //   // React.useCallback(
  //   () => {
  //     if (searchQuery !== filteredList.searchQuery) {
  //       if (!searchQuery) {
  //         setFilteredList({
  //           searchQuery,
  //           orders: orderList,
  //         });
  //       } else {
  //         const lower = searchQuery.toLowerCase();

  //         const fn = (i: IOrderDocument) =>
  //           i?.head?.contact?.name.toUpperCase().includes(lower) ||
  //           i?.head?.outlet?.name.toUpperCase().includes(lower) ||
  //           i.number.toUpperCase().includes(lower) ||
  //           getDateString(i.documentDate).toUpperCase().includes(lower) ||
  //           getDateString(i.head.onDate).toUpperCase().includes(lower);

  //         let newList;

  //         if (
  //           filteredList.searchQuery &&
  //           searchQuery.length > filteredList.searchQuery.length &&
  //           searchQuery.startsWith(filteredList.searchQuery)
  //         ) {
  //           newList = filteredList.orders?.filter(fn);
  //         } else {
  //           newList = orderList?.filter(fn);
  //         }

  //         setFilteredList({
  //           searchQuery,
  //           orders: newList,
  //         });
  //       }
  //     }
  //   },
  //   [filteredList, orderList, searchQuery],
  // );

  const [status, setStatus] = useState<Status>('all');

  const filteredListByStatus: IListItemProps[] = useMemo(() => {
    const res =
      status === 'all'
        ? orderList
        : status === 'active'
        ? orderList.filter((e) => e.status !== 'PROCESSED')
        : status === 'archive'
        ? orderList.filter((e) => e.status === 'PROCESSED')
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
  }, [status, orderList]);

  const sections = useMemo(
    () =>
      filteredListByStatus.reduce<SectionDataProps>((prev, item) => {
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
    [filteredListByStatus],
  );

  const [delList, setDelList] = useState({});

  const handleAddDeletelList = useCallback(
    (lineId: string, lineStatus: string, checkedId: string) => {
      if (checkedId) {
        const newList = Object.entries(delList).reduce((sum, cur) => {
          const curId = cur[0];
          const curStatus = cur[1];
          if (curId !== checkedId) {
            return { ...sum, [curId]: curStatus };
          } else {
            return { ...sum };
          }
        }, {});
        setDelList(newList);
      } else {
        setDelList({ ...delList, [lineId]: lineStatus });
      }
    },
    [delList],
  );

  const handleDeleteDocs = useCallback(() => {
    const docIds = Object.keys(delList);
    const statusList = Object.values(delList).find((i) => i === 'READY' || i === 'SENT');

    if (statusList) {
      Alert.alert('Внимание!', 'Среди выделенных документов есть необработанные документы. Продолжить удаление?', [
        {
          text: 'Да',
          onPress: () => {
            dispatch(documentActions.removeDocuments(docIds));
            setDelList([]);
          },
        },
        {
          text: 'Отмена',
        },
      ]);
    } else {
      Alert.alert('Вы уверены, что хотите удалить документы?', '', [
        {
          text: 'Да',
          onPress: () => {
            dispatch(documentActions.removeDocuments(docIds));
            setDelList([]);
          },
        },
        {
          text: 'Отмена',
        },
      ]);
    }
  }, [delList, dispatch]);

  const handleAddDocument = useCallback(() => {
    navigation.navigate('OrderEdit');
  }, [navigation]);

  useEffect(() => {
    if (!filterVisible && searchQuery) {
      setSearchQuery('');
    }
  }, [filterVisible, searchQuery]);

  const renderRight = useCallback(
    () => (
      <View style={styles.buttons}>
        {delList && Object.values(delList).length > 0 ? (
          <DeleteButton onPress={handleDeleteDocs} />
        ) : (
          <>
            <IconButton
              icon="card-search-outline"
              style={filterVisible && { backgroundColor: colors.card }}
              size={26}
              onPress={() => setFilterVisible((prev) => !prev)}
            />
            <AddButton onPress={handleAddDocument} />
          </>
        )}
      </View>
    ),
    [colors.card, delList, filterVisible, handleAddDocument, handleDeleteDocs],
  );

  const renderLeft = useCallback(
    () => delList && Object.values(delList).length > 0 && <CloseButton onPress={() => setDelList([])} />,
    [delList],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: delList && Object.values(delList).length > 0 ? renderLeft : navBackDrawer,
      headerRight: renderRight,
      title:
        delList && Object.values(delList).length > 0 ? `Выделено заявок: ${Object.values(delList).length}` : 'Заявки',
    });
  }, [delList, navigation, renderLeft, renderRight]);

  const handlePressOrder = useCallback((id: string) => navigation.navigate('OrderView', { id }), [navigation]);

  const renderItem: ListRenderItem<IListItemProps> = useCallback(
    ({ item }) => {
      const checkedId = (delList && Object.keys(delList).find((i) => i === item.id)) || '';
      return (
        <ScreenListItem
          key={item.id}
          {...item}
          onSelectItem={() => handlePressOrder(item.id)}
          onCheckItem={() => handleAddDeletelList(item.id, item.status || '', checkedId)}
          isChecked={checkedId ? true : false}
          isDelList={delList && Object.values(delList).length > 0 ? true : false}
        />
      );
    },
    [delList, handleAddDeletelList, handlePressOrder],
  );

  const renderSectionHeader = useCallback(
    ({ section }) => <SubTitle style={[styles.header, styles.sectionTitle]}>{section.title}</SubTitle>,
    [],
  );

  const renderSectionFooter = useCallback(
    (item) => (status === 'all' && sections ? <OrderListTotal sectionOrders={item.section} /> : null),
    [sections, status],
  );

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  // const RC = useMemo(() => <RefreshControl refreshing={loading} title="загрузка данных..." />, [loading]);

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
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={ItemSeparator}
        renderSectionHeader={renderSectionHeader}
        // refreshControl={RC}
        ListEmptyComponent={EmptyList}
        renderSectionFooter={renderSectionFooter}
      />
    </AppScreen>
  );
};

export default OrderListScreen;
