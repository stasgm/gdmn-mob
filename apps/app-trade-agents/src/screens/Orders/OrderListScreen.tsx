import React, { useCallback, useState, useLayoutEffect, useMemo } from 'react';
import { ListRenderItem, SectionList, SectionListData, View } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';

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
  navBackDrawer,
} from '@lib/mobile-ui';

import { StackNavigationProp } from '@react-navigation/stack';

import { deleteSelectedItems, getDateString, getDelList, keyExtractor } from '@lib/mobile-app';

import { documentActions, useDispatch, useSelector } from '@lib/store';

import { IDelList } from '@lib/mobile-types';

import { IOrderDocument } from '../../store/types';
import { OrdersStackParamList } from '../../navigation/Root/types';

import OrderListTotal from './components/OrderListTotal';

export interface OrderListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<IListItemProps, OrderListSectionProps>[];

const OrderListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<OrdersStackParamList, 'OrderList'>>();

  const dispatch = useDispatch();

  const orderList = (
    useSelector((state) => state.documents.list).filter((i) => i.documentType.name === 'order') as IOrderDocument[]
  ).sort(
    (a, b) =>
      new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime() &&
      new Date(b.head.onDate).getTime() - new Date(a.head.onDate).getTime(),
  );

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

  const [delList, setDelList] = useState<IDelList>({});
  const isDelList = useMemo(() => !!Object.keys(delList).length, [delList]);

  const handleDeleteDocs = useCallback(() => {
    const docIds = Object.keys(delList);

    const deleteDocs = () => {
      dispatch(documentActions.removeDocuments(docIds));
      setDelList({});
    };

    deleteSelectedItems(delList, deleteDocs);
  }, [delList, dispatch]);

  const handleAddDocument = useCallback(() => {
    navigation.navigate('OrderEdit');
  }, [navigation]);

  const renderRight = useCallback(
    () => (
      <View style={styles.buttons}>
        {isDelList ? <DeleteButton onPress={handleDeleteDocs} /> : <AddButton onPress={handleAddDocument} />}
      </View>
    ),
    [handleAddDocument, handleDeleteDocs, isDelList],
  );

  const renderLeft = useCallback(() => isDelList && <CloseButton onPress={() => setDelList({})} />, [isDelList]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: isDelList ? renderLeft : navBackDrawer,
      headerRight: renderRight,
      title: isDelList ? `Выделено заявок: ${Object.values(delList).length}` : 'Заявки',
    });
  }, [delList, isDelList, navigation, renderLeft, renderRight]);

  const renderItem: ListRenderItem<IListItemProps> = ({ item }) => (
    <ScreenListItem
      key={item.id}
      {...item}
      onPress={() =>
        isDelList
          ? setDelList(getDelList(delList, item.id, item.status!))
          : navigation.navigate('OrderView', { id: item.id })
      }
      onLongPress={() => setDelList(getDelList(delList, item.id, item.status!))}
      checked={!!delList[item.id]}
    />
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

  return (
    <AppScreen>
      <FilterButtons status={status} onPress={setStatus} style={styles.marginBottom5} />
      <SectionList
        sections={sections}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={ItemSeparator}
        renderSectionHeader={renderSectionHeader}
        ListEmptyComponent={EmptyList}
        renderSectionFooter={renderSectionFooter}
      />
    </AppScreen>
  );
};

export default OrderListScreen;
