import React, { useState, useEffect, useMemo, useLayoutEffect, useCallback, useRef } from 'react';
import { View, FlatList, TouchableOpacity, Text, RefreshControl } from 'react-native';
import { Searchbar, Divider } from 'react-native-paper';
import { v4 as uuid } from 'uuid';
import { RouteProp, useNavigation, useRoute, useScrollToTop, useTheme } from '@react-navigation/native';

import { AppScreen, ScanButton, ItemSeparator, BackButton, globalStyles as styles, SearchButton } from '@lib/mobile-ui';
import { docSelectors, refSelectors, useSelector } from '@lib/store';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { IDepartment } from '@lib/types';

import { formatValue } from '@lib/mobile-app';

import { getRemGoodListByContact } from '../../utils/helpers';
import { InventoryStackParamList } from '../../navigation/Root/types';
import { IInventoryDocument } from '../../store/types';
import { IGood, IRemains, IRemGood } from '../../store/app/types';

interface IFilteredList {
  searchQuery: string;
  goodRemains: IRemGood[];
}

const keyExtractor = (item: IRemGood) => String(item.good.id);

const GoodRemains = ({ item }: { item: IRemGood }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { docId } = useRoute<RouteProp<InventoryStackParamList, 'SelectRemainsItem'>>().params;
  const barcode = !!item.good.barcode;

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('InventoryLine', {
          mode: 0,
          docId,
          item: {
            id: uuid(),
            good: { id: item.good.id, name: item.good.name },
            quantity: 0,
            remains: item.remains,
            price: item.price,
          },
        });
      }}
    >
      <View style={[styles.item]}>
        <View style={[styles.icon]}>
          <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <Text style={[styles.name, { color: colors.text }]}>{item.good.name}</Text>
          <View style={[styles.directionRow]}>
            <Text style={[styles.field, { color: colors.text }]}>
              {item.remains} {item.good.valueName} - {formatValue({ type: 'number', decimals: 2 }, item.price ?? 0)}{' '}
              руб.
            </Text>
            {barcode && (
              <Text style={[styles.number, styles.flexDirectionRow, { color: colors.text }]}>{item.good.barcode}</Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const SelectRemainsScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [filterVisible, setFilterVisible] = useState(false);

  const isScanerReader = useSelector((state) => state.settings?.data?.scannerUse?.data);
  const goods = refSelectors.selectByName<IGood>('good').data;
  const contacts = refSelectors.selectByName<IDepartment>('department').data;
  const remains = refSelectors.selectByName<IRemains>('remains')?.data[0];

  const docId = useRoute<RouteProp<InventoryStackParamList, 'SelectRemainsItem'>>().params?.docId;
  const document = docSelectors
    .selectByDocType<IInventoryDocument>('inventory')
    ?.find((item) => item.id === docId) as IInventoryDocument;

  const [goodRemains] = useState<IRemGood[]>(() =>
    document?.head?.department?.id
      ? getRemGoodListByContact(contacts, goods, remains, document?.head?.department.id, true)
      : [],
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredList, setFilteredList] = useState<IFilteredList>({
    searchQuery: '',
    goodRemains,
  });

  useEffect(() => {
    if (searchQuery !== filteredList.searchQuery) {
      if (!searchQuery) {
        setFilteredList({
          searchQuery,
          goodRemains,
        });
      } else {
        const lower = searchQuery.toLowerCase();

        const fn = isNaN(Number(lower))
          ? ({ good }: IRemGood) => good.name?.toLowerCase().includes(lower)
          : ({ good }: IRemGood) => good.barcode?.includes(searchQuery) || good.name?.toLowerCase().includes(lower);

        let gr;

        if (
          filteredList.searchQuery &&
          searchQuery.length > filteredList.searchQuery.length &&
          searchQuery.startsWith(filteredList.searchQuery)
        ) {
          gr = filteredList.goodRemains.filter(fn);
        } else {
          gr = goodRemains.filter(fn);
        }

        setFilteredList({
          searchQuery,
          goodRemains: gr,
        });
      }
    }
  }, [goodRemains, filteredList, searchQuery]);

  const handleScanner = useCallback(() => {
    navigation.navigate('ScanBarcode', { docId: docId });
  }, [navigation, docId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
      headerRight: () => (
        <View style={styles.buttons}>
          <SearchButton onPress={() => setFilterVisible((prev) => !prev)} visible={true} />
          {isScanerReader && <ScanButton onPress={handleScanner} />}
        </View>
      ),
    });
  }, [navigation, filterVisible, colors.card, handleScanner, isScanerReader]);

  const refList = useRef<FlatList<IRemGood>>(null);
  useScrollToTop(refList);

  const renderItem = ({ item }: { item: IRemGood }) => <GoodRemains item={item} />;

  const RC = useMemo(() => <RefreshControl refreshing={!goodRemains} title="загрузка данных..." />, [goodRemains]);
  const EC = useMemo(() => <Text style={styles.emptyList}>Список пуст</Text>, []);

  return (
    <AppScreen>
      <Divider />
      {filterVisible && (
        <>
          <View style={styles.flexDirectionRow}>
            <Searchbar
              placeholder="Поиск (штрихкод, наименование)"
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={[styles.flexGrow, styles.searchBar]}
            />
          </View>
          <ItemSeparator />
        </>
      )}
      <FlatList
        ref={refList}
        data={filteredList.goodRemains}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        refreshControl={RC}
        ListEmptyComponent={EC}
        removeClippedSubviews={true} // Unmount compsonents when outside of window
        initialNumToRender={6}
        maxToRenderPerBatch={6} // Reduce number in each render batch
        updateCellsBatchingPeriod={100} // Increase time between renders
        windowSize={7} // Reduce the window size
      />
    </AppScreen>
  );
};
