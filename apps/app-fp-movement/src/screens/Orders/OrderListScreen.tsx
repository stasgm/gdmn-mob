import React, { useCallback, useState, useLayoutEffect, useMemo, useEffect } from 'react';
import { ListRenderItem, RefreshControl, SectionList, SectionListData, Text, View } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';

import { IconButton, Searchbar } from 'react-native-paper';

import { docSelectors, documentActions, refSelectors, useDispatch, useSelector } from '@lib/store';
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
  ScanButton,
} from '@lib/mobile-ui';

import { StackNavigationProp } from '@react-navigation/stack';

import { generateId, getDateString } from '@lib/mobile-app';

import { IDocumentType, IReference } from '@lib/types';

import { IOrderDocument, IOtvesDocument, ITempDocument } from '../../store/types';
import SwipeListItem from '../../components/SwipeListItem';
import { OrderStackParamList } from '../../navigation/Root/types';
import { navBackDrawer } from '../../components/navigateOptions';
import BarcodeDialog from '../../components/BarcodeDialog';
// import { getBarcode } from '../../utils/helpers';

export interface OrderListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<IListItemProps, OrderListSectionProps>[];

export const OrderListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<OrderStackParamList, 'OrderList'>>();

  const loading = useSelector((state) => state.documents.loading);
  const movements = useSelector((state) => state.documents.list).filter(
    (i) => i.documentType.name !== 'order',
  ) as ITempDocument[];
  console.log('docs', movements);
  const { colors } = useTheme();

  const dispatch = useDispatch();

  // const textStyle = useMemo(() => [styles.field, { color: colors.text }], [colors.text]);

  // const movements = useSelector((state) => state.documents.list) as ITempDocument[];
  // const temps = useSelector((state) => state.documents.list) as ITempDocument[];
  const temps = docSelectors.selectByDocType<ITempDocument>('temp');

  // const temps = docSelectors.selectByDocType<ITempDocument>('temp');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  const list = temps
    ?.filter((i) =>
      i.documentType?.name === 'temp'
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
          subtitle: `№ ${i.number} от ${getDateString(i.documentDate)} на ${getDateString(i.head?.onDate)}`,
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
    navigation.navigate('ScanOrder');
  }, [navigation]);

  const [visibleDialog, setVisibleDialog] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [error, setError] = useState(false);

  const orders = docSelectors.selectByDocType<IOrderDocument>('order');
  const tempType = refSelectors
    .selectByName<IReference<IDocumentType>>('documentType')
    ?.data.find((t) => t.name === 'temp');
  const otvesType = refSelectors
    .selectByName<IReference<IDocumentType>>('documentType')
    ?.data.find((t) => t.name === 'otves');
  const otvesList = docSelectors.selectByDocType<IOtvesDocument>('otves');

  const handleGetBarcode = useCallback(
    (brc: string) => {
      // const barc = getBarcode(brc);
      const order = orders.find((item) => item.head.barcode === brc);

      if (order) {
        const tempDoc: ITempDocument = {
          id: generateId(),
          documentType: tempType,
          number: order.number,
          documentDate: new Date().toISOString(),
          status: 'DRAFT',
          head: {
            // comment: order.head.
            barcode: order.head.barcode,
            contact: order.head.contact,
            depart: order.head.depart,
            outlet: order.head.outlet,
            onDate: order.head.onDate,
          },
          lines: order.lines,
          creationDate: new Date().toISOString(),
          editionDate: new Date().toISOString(),
        };
        const otvesDoc: IOtvesDocument = {
          ...tempDoc,
          id: generateId(),
          documentType: otvesType,
          lines: [],
        };

        if (otvesList.find((i) => i.head.barcode === tempDoc.head.barcode)) {
          console.log('1');
          // dispatch(documentActions.removeDocument('08b6266e38'));

          return;
        }

        dispatch(documentActions.addDocument(tempDoc));
        dispatch(documentActions.addDocument(otvesDoc));

        navigation.navigate('OrderView', {
          id: tempDoc.id,
        });

        setError(false);
        setVisibleDialog(false);
        setBarcode('');
      } else {
        setError(true);
      }
    },

    [dispatch, navigation, orders, otvesList, otvesType, tempType],
  );

  const handleShowDialog = () => {
    setVisibleDialog(true);
  };

  const handleDismisDialog = () => {
    setVisibleDialog(false);
  };

  const handleSearchBarcode = () => {
    handleGetBarcode(barcode);
  };

  const handleDismissBarcode = () => {
    setVisibleDialog(false);
    setBarcode('');
    setError(false);
  };

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
        <ScanButton onPress={handleAddDocument} />
        <AddButton onPress={handleShowDialog} />
      </View>
    ),
    [colors.card, filterVisible, handleAddDocument],
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
      <SwipeListItem renderItem={item} item={doc} routeName="OrderView">
        <ScreenListItem {...item} onSelectItem={() => navigation.navigate('OrderView', { id: item.id })} />
      </SwipeListItem>
    ) : null;
  };

  const searchStyle = useMemo(() => colors.primary, [colors.primary]);

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
      <BarcodeDialog
        visibleDialog={visibleDialog}
        onDismissDialog={handleDismisDialog}
        barcode={barcode}
        onChangeBarcode={setBarcode}
        onDismiss={handleDismissBarcode}
        onSearch={handleSearchBarcode}
        error={error}
      />
    </AppScreen>
  );
};
