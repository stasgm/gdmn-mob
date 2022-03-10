import React, { useState, useEffect, useMemo, useLayoutEffect, useCallback, useRef } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { Searchbar, Divider } from 'react-native-paper';
import { v4 as uuid } from 'uuid';
import { RouteProp, useNavigation, useRoute, useScrollToTop, useTheme } from '@react-navigation/native';

import { AppScreen, ScanButton, ItemSeparator, BackButton, globalStyles as styles, SearchButton } from '@lib/mobile-ui';
import { docSelectors, refSelectors, useSelector } from '@lib/store';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { formatValue, getRemGoodListByContact } from '../../utils/helpers';
import { useSelector as useAppInventorySelector } from '../../store/index';
import { DocStackParamList } from '../../navigation/Root/types';
import { IDepartment, IDocDocument } from '../../store/types';
import { IGood, IRem, IRemainsNew, IRemGood } from '../../store/app/types';

const GoodRemains = ({ item }: { item: IRemGood }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { docId } = useRoute<RouteProp<DocStackParamList, 'SelectRemainsItem'>>().params;
  const barcode = !!item.good.barcode;

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('DocLine', {
          mode: 0,
          docId,
          item: {
            id: uuid(),
            good: { id: item.good.id, name: item.good.name },
            quantity: 0,
            remains: item.remains,
            price: item.price,
            buyingPrice: item.buyingPrice,
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
              {item.remains} {item.good.valuename} - {formatValue({ type: 'number', decimals: 2 }, item.price ?? 0)}{' '}
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
  const [searchText, setSearchText] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [list, setList] = useState<IRemGood[]>([]);

  const isScanerReader = useSelector((state) => state.settings?.data?.scannerUse?.data);
  const model = useAppInventorySelector((state) => state.appInventory.model);

  const docId = useRoute<RouteProp<DocStackParamList, 'SelectRemainsItem'>>().params?.docId;
  // const document = docSelectors
  //   .selectByDocType<IDocDocument>('inventory')
  //   ?.find((item) => item.id === docId) as IDocDocument;

  const document = useSelector((state) => state.documents.list).find((item) => item.id === docId) as IDocDocument;

  const handleScanner = useCallback(() => {
    navigation.navigate('ScanBarcode', { docId: docId });
  }, [navigation, docId]);

  // const goods = useMemo(
  //   () => (document?.head?.toDepartment?.id ? model[document.head.toDepartment.id].goods : {}),
  //   [document?.head?.toDepartment?.id, model],
  // );

  const remainss = refSelectors.selectByName<IRemainsNew>('remain').data;
  const goodss = refSelectors.selectByName<IGood>('good').data;
  console.log('newg', goodss);
  const contacts = refSelectors.selectByName<IDepartment>(document?.head?.fromContactType?.id || 'department').data;

  const [goodRemains] = useState<IRemGood[]>(() =>
    document?.head?.fromContact?.id
      ? getRemGoodListByContact(contacts, goodss, remainss, document?.head?.fromContact.id)
      : [],
  );

  // const goodRemains: IRem[] = useMemo(() => {
  //   return Object.keys(goods)
  //     ?.reduce((r: IRem[], e) => {
  //       const { remains, ...goodInfo } = goods[e];
  //       const goodPos = { goodkey: e, ...goodInfo, price: 0, remains: 0 };

  //       remains && remains.length > 0
  //         ? remains.forEach((re) => {
  //             console.log('re1', re);
  //             r.push({ ...goodPos, price: re.price, remains: re.q });
  //           })
  //         : r.push(goodPos);
  //       return r;
  //     }, [])
  //     .sort((a: IRem, b: IRem) => (a.name < b.name ? -1 : 1));
  // }, [goods]);

  // console.log('gooodrem', goodRemains);

  useEffect(() => {
    if (!filterVisible && searchText) {
      setSearchText('');
    }
  }, [filterVisible, searchText]);

  useEffect(() => {
    setList(
      // goodRemains,
      goodRemains?.filter(
        (item) =>
          item.good.barcode?.toLowerCase().includes(searchText.toLowerCase()) ||
          item.good.name?.toLowerCase().includes(searchText.toLowerCase()),
      ),
    );
  }, [goodRemains, searchText]);

  // console.log('rems', goodRemains);
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

  return (
    <AppScreen>
      <Divider />
      {filterVisible && (
        <>
          <View style={styles.flexDirectionRow}>
            <Searchbar
              placeholder="Поиск (штрихкод, наименование)"
              onChangeText={setSearchText}
              value={searchText}
              style={[styles.flexGrow, styles.searchBar]}
            />
          </View>
          <ItemSeparator />
        </>
      )}
      <FlatList
        ref={refList}
        data={list}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
      />
    </AppScreen>
  );
};
