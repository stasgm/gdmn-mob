/* eslint-disable react/no-children-prop */
import React, { useState, useEffect, useMemo, useLayoutEffect, useCallback, useRef } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { Searchbar, Divider, IconButton } from 'react-native-paper';
import { v4 as uuid } from 'uuid';
import { RouteProp, useNavigation, useRoute, useScrollToTop, useTheme } from '@react-navigation/native';

import { AppScreen, ScanButton, ItemSeparator, BackButton, globalStyles as styles, SearchButton } from '@lib/mobile-ui';
import { docSelectors, useSelector } from '@lib/store';
import { ISettingsOption } from '@lib/types';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { formatValue } from '../../utils/helpers';
import { useSelector as useAppInventorySelector } from '../../store/index';
import { InventorysStackParamList } from '../../navigation/Root/types';
import { IInventoryDocument, IRem } from '../../store/types';

const GoodRemains = ({ item }: { item: IRem }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { docId } = useRoute<RouteProp<InventorysStackParamList, 'SelectRemainsItem'>>().params;
  const barcode = !!item.barcode;

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('InventoryLine', {
          mode: 0,
          docId,
          item: {
            id: uuid(),
            good: { id: item.id, name: item.name },
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
          <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
          <View style={[styles.directionRow]}>
            <Text style={[styles.field, { color: colors.text }]}>
              {item.remains} {item.valuename} - {formatValue({ type: 'number', decimals: 2 }, item.price ?? 0)} руб.
            </Text>
            {barcode && (
              <Text style={[styles.number, styles.flexDirectionRow, { color: colors.text }]}>{item.barcode}</Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

//////////

export const SelectRemainsScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [searchText, setSearchText] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [list, setList] = useState<IRem[]>([]);

  const { data: settings } = useSelector((state) => state.settings);
  const scanUsetSetting = (settings.scannerUse as ISettingsOption<string>) || true;
  const model = useAppInventorySelector((state) => state.appInventory.model);

  const docId = useRoute<RouteProp<InventorysStackParamList, 'SelectRemainsItem'>>().params?.docId;
  const document = docSelectors
    .selectByDocType<IInventoryDocument>('inventory')
    ?.find((item) => item.id === docId) as IInventoryDocument;

  const handleScanner = useCallback(() => {
    navigation.navigate(scanUsetSetting.data ? 'ScanBarcodeReader' : 'ScanBarcode', { docId: docId });
  }, [navigation, docId, scanUsetSetting]);

  //////
  const goodRemains: IRem[] = useMemo(() => {
    const goods = model[document?.head?.department?.id || ''].goods;
    if (!goods) {
      return [];
    }

    return Object.keys(goods)
      ?.reduce((r: IRem[], e) => {
        const { remains, ...goodInfo } = goods[e];
        const goodPos = { goodkey: e, ...goodInfo, price: 0, remains: 0 };

        remains && remains.length > 0
          ? remains.forEach((re) => {
            r.push({ ...goodPos, price: re.price, remains: re.q });
          })
          : r.push(goodPos);
        return r;
      }, [])
      .sort((a: IRem, b: IRem) => (a.name < b.name ? -1 : 1));
  }, [model, document?.head?.department?.id]);
  useEffect(() => {
    if (!filterVisible && searchText) {
      setSearchText('');
    }
  }, [filterVisible, searchText]);

  useEffect(() => {
    setList(
      goodRemains?.filter(
        (item) =>
          item.barcode?.toLowerCase().includes(searchText.toLowerCase()) ||
          item.name?.toLowerCase().includes(searchText.toLowerCase()),
      ),
    );
  }, [goodRemains, searchText]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
      headerRight: () => (
        <View style={styles.buttons}>
          <SearchButton onPress={() => setFilterVisible((prev) => !prev)} visible={true} />
          <ScanButton onPress={handleScanner} />
        </View>
      ),
    });
  }, [navigation, filterVisible, colors.card, handleScanner]);

  const refList = useRef<FlatList<IRem>>(null);
  useScrollToTop(refList);

  const renderItem = ({ item }: { item: IRem }) => <GoodRemains item={item} />;

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
              children={undefined}
              autoComplete={undefined}
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
