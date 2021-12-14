/* eslint-disable react/no-children-prop */
import React, { useState, useEffect, useMemo, useLayoutEffect, useCallback, useRef } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { Searchbar, Divider, Avatar, IconButton } from 'react-native-paper';
import { v4 as uuid } from 'uuid';
import { RouteProp, useNavigation, useRoute, useScrollToTop, useTheme } from '@react-navigation/native';

import { styles } from '@lib/mobile-navigation';

import { AppScreen, ScanButton, ItemSeparator, BackButton } from '@lib/mobile-ui';
// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import { scanStyle } from '@lib/mobile-ui/src/styles/scanStyle';

import { docSelectors, useSelector } from '@lib/store';
import { INamedEntity, ISettingsOption } from '@lib/types';

import { formatValue } from '../../utils/helpers';
import { useSelector as useAppInventorySelector } from '../../store/index';
import { InventorysStackParamList } from '../../navigation/Root/types';
import { IGood, IInventoryDocument, IMGoodRemain, IRem } from '../../store/types';

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
      <View style={{ backgroundColor: colors.card }}>
        <Avatar.Icon size={38} icon="cube-outline" style={{ backgroundColor: colors.primary }} children={undefined} />
      </View>
      <View style={styles.details}>
        <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
        <Text style={styles.itemInfo}>
          {item.remains} {item.valuename} - {formatValue({ type: 'number', decimals: 2 }, item.price ?? 0)} руб.
        </Text>
        {barcode && (
          <View style={styles.barcode}>
            <Text style={[styles.number, styles.fieldDesciption, { color: colors.text }]}>{item.barcode}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
//////////

export const SelectRemainsScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [searchText, setSearchText] = useState('');
  const [filterVisible, setFilterVisible] = useState(true);
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
  const goodRemains: IMGoodRemain[] = useMemo(() => {
    const goods = model[document?.head?.department?.id || ''].goods;
    //console.log('Остатки', goods);
    if (!goods) {
      return [];
    }
    const Arrr: IRem[]
    Object.keys(goods)?.forEach((e) => {
      const { remains, ...good } = goods[e];

      return {
        good: { id: good.id, name: good.name } as INamedEntity,
        price: remains!.length ? remains![0].price : 0,
        remains: remains!.length ? remains![0].q : 0,
        barcode: good.barcode,
      };
    }, []);
  }, [document?.head?.department?.id, model]);

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
        <IconButton
          icon="card-search-outline"
          style={filterVisible && { backgroundColor: colors.card }}
          size={26}
          onPress={() => setFilterVisible((prev) => !prev)}
        />
      ),
    });
  }, [navigation, filterVisible, colors.card]);

  const refList = useRef<FlatList<IRem>>(null);
  useScrollToTop(refList);

  const renderItem = ({ item }: { item: IRem }) => <GoodRemains item={item} />;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <ScanButton onPress={handleScanner} />,
    });
  }, [navigation, handleScanner]);

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
