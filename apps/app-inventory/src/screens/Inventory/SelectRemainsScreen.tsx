import React, { useState, useEffect, useMemo, useLayoutEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { Searchbar, IconButton, Divider } from 'react-native-paper';
import { v4 as uuid } from 'uuid';
import { RouteProp, useNavigation, useRoute, useScrollToTop, useTheme } from '@react-navigation/native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '@lib/mobile-navigation';

import { AppScreen, BackButton, ItemSeparator, SubTitle } from '@lib/mobile-ui';
// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import { scanStyle } from '@lib/mobile-ui/src/styles/scanStyle';

import { docSelectors, refSelectors } from '@lib/store';
import { INamedEntity } from '@lib/types';

import { useSelector as useAppInventorySelector } from '../../store/index';
import { InventorysStackParamList } from '../../navigation/Root/types';
import { IGood, IInventoryDocument, IRem } from '../../store/types';

const Good = ({ item }: { item: IRem }) => {
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
      <View style={styles.item}>
        <View style={[styles.icon]}>
          <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <View style={styles.directionRow}>
            <Text style={styles.name}>{item.name || item.id}</Text>
            {barcode && (
              <View style={scanStyle.barcode}>
                <Text style={[styles.number, styles.flexDirectionRow, { color: colors.text }]}>{item.barcode}</Text>
              </View>
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
  const [list, setList] = useState<IRem[]>([]);

  const model = useAppInventorySelector((state) => state.appInventory.model);

  const docId = useRoute<RouteProp<InventorysStackParamList, 'SelectRemainsItem'>>().params?.docId;
  const document = docSelectors
    .selectByDocType<IInventoryDocument>('inventory')
    ?.find((e) => e.id === docId) as IInventoryDocument;
  //////
  const goodRemains: IRem[] = useMemo(() => {
    const goods = model[document?.head?.department?.id || ''].goods;

    if (!goods) {
      return [];
    }

    return Object.keys(goods)
      ?.reduce((r: IRem[], e) => {
        const { remains, ...goodInfo } = goods[e];
        const goodPos: IRem = { goodkey: e, ...goodInfo, price: 0, remains: 0 };

        remains!.length > 0
          ? remains!.forEach((re) => {
              r.push({ ...goodPos, price: re.price, remains: re.q });
            })
          : r.push(goodPos);
        return r;
      }, [])
      .sort((a: IRem, b: IRem) => (a.name < b.name ? -1 : 1));
  }, [document?.head?.department?.id, model]);

  const filteredList = useEffect(() => {
    setList(
      goodRemains?.filter(
        (item) =>
          item.barcode?.toLowerCase().includes(searchText.toLowerCase()) ||
          item.name?.toLowerCase().includes(searchText.toLowerCase()),
      ),
    );
  }, [goodRemains, searchText]);

  const refList = React.useRef<FlatList<IRem>>(null);
  useScrollToTop(refList);

  const renderItem = ({ item }: { item: IRem }) => <Good item={item} />;

  ////////////
  return (
    <AppScreen>
      <Divider />
      {filterVisible && (
        <>
          <View style={styles.flexDirectionRow}>
            <Searchbar
              placeholder="Поиск по штрихкоду или наименованию..."
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
