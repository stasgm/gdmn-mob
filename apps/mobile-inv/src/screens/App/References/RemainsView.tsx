import { useScrollToTop, useTheme, useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  RefreshControl,
} from 'react-native';
import { Text, Searchbar, Avatar } from 'react-native-paper';

import { IGood, IMDGoodRemain, IModelData, IReference, IRem } from '../../../../../common/base';
import ItemSeparator from '../../../components/ItemSeparator';
import SubTitle from '../../../components/SubTitle';
import { formatValue } from '../../../helpers/utils';
import { useAppStore } from '../../../store';

interface IField extends IGood {
  remains?: number;
  price?: number;
}

const RemainsViewScreen = ({ route, navigation }) => {
  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredList, setFilteredList] = useState<IField[]>();

  const [goodRemains, setGoodRemains] = useState<IField[]>(undefined);

  const { item: contactItem }: { item: IReference } = route.params;

  const { state } = useAppStore();

  useEffect(() => {
    const data = (state.models?.remains?.data as unknown) as IModelData<IMDGoodRemain>;

    const goods = data[contactItem?.id]?.goods;

    const goodList =
      Object.keys(goods)
        ?.reduce((r: IRem[], e) => {
          const { remains, ...goodInfo } = goods[e];
          const goodPos: IRem = { goodkey: e, ...goodInfo, price: 0, remains: 0 };

          remains.forEach((re) => {
            r.push({ ...goodPos, price: re.price, remains: re.q });
          });
          return r;
        }, [])
        .sort((a: IField, b: IField) => (a.name < b.name ? -1 : 1)) || [];

    setGoodRemains(goodList);
  }, [state.models?.remains?.data, contactItem?.id]);

  const LineItem = useCallback(
    ({ item }: { item: IField }) => {
      return (
        <TouchableOpacity
          style={localStyles.item}
          onPress={() => {
            navigation.navigate('ReferenceDetail', { item });
          }}
        >
          <View style={{ backgroundColor: colors.card }}>
            <Avatar.Icon size={38} icon="cube-outline" style={{ backgroundColor: colors.primary }} />
          </View>
          <View style={localStyles.details}>
            <Text style={[localStyles.name, { color: colors.text }]}>{item.name}</Text>
            <Text style={localStyles.itemInfo}>
              {item.remains} {item.value} - {formatValue({ type: 'number', decimals: 2 }, item.price ?? 0)} руб.
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    [colors.card, colors.primary, colors.text, navigation],
  );

  useEffect(() => {
    setFilteredList(
      goodRemains?.filter(
        (item) =>
          item.barcode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.name?.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    );
  }, [goodRemains, searchQuery]);

  const ref = React.useRef<FlatList<IField>>(null);

  useScrollToTop(ref);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={[localStyles.content, { backgroundColor: colors.card }]}>
        <SubTitle styles={[localStyles.title, { backgroundColor: colors.background }]}>{contactItem?.name}</SubTitle>
        <ItemSeparator />
        {!!goodRemains && (
          <>
            <View style={localStyles.flexDirectionRow}>
              <Searchbar
                placeholder="Поиск"
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={[localStyles.flexGrow, localStyles.searchBar]}
              />
            </View>
            <ItemSeparator />
          </>
        )}
        <FlatList
          ref={ref}
          data={filteredList}
          refreshControl={<RefreshControl refreshing={!goodRemains} title="загрузка данных..." />}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item }) => <LineItem item={item} />}
          ItemSeparatorComponent={ItemSeparator}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export { RemainsViewScreen };

const localStyles = StyleSheet.create({
  content: {
    height: '100%',
  },
  details: {
    flexDirection: 'column',
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 3,
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  flexGrow: {
    flexGrow: 10,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 4,
    minHeight: 50,
  },
  itemInfo: {
    fontSize: 12,
    opacity: 0.5,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  searchBar: {
    elevation: 0,
    shadowOpacity: 0,
  },
  title: {
    padding: 10,
  },
});
