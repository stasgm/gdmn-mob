import React, { useState, useEffect, useMemo, useLayoutEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { Divider, Searchbar } from 'react-native-paper';
import { v4 as uuid } from 'uuid';
import { RouteProp, useNavigation, useRoute, useScrollToTop, useTheme } from '@react-navigation/native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '@lib/mobile-navigation';
import { AppScreen, BackButton, ItemSeparator, SearchButton, SubTitle } from '@lib/mobile-ui';
import { refSelectors } from '@lib/store';
import { INamedEntity } from '@lib/types';

import { StackNavigationProp } from '@react-navigation/stack';

import { InventoryStackParamList } from '../../navigation/Root/types';
import { IGood } from '../../store/app/types';

const Good = ({ item }: { item: INamedEntity }) => {
  const navigation = useNavigation<StackNavigationProp<InventoryStackParamList, 'SelectGoodItem'>>();
  const { docId } = useRoute<RouteProp<InventoryStackParamList, 'SelectGoodItem'>>().params;

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('InventoryLine', {
          mode: 0,
          docId,
          item: { id: uuid(), good: { id: item.id, name: item.name }, quantity: 0 },
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
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const SelectGoodScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  const goods = refSelectors.selectByName<IGood>('good');
  const list = goods.data;

  const filteredList = useMemo(() => {
    return (
      list
        ?.filter((i) => (i.name ? i.name.toUpperCase().includes(searchQuery.toUpperCase()) : true))
        ?.sort((a, b) => (a.name < b.name ? -1 : 1)) || []
    );
  }, [list, searchQuery]);

  useEffect(() => {
    if (!filterVisible && searchQuery) {
      setSearchQuery('');
    }
  }, [filterVisible, searchQuery]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
      headerRight: () => <SearchButton onPress={() => setFilterVisible((prev) => !prev)} visible={true} />,
    });
  }, [navigation, filterVisible, colors.card]);

  const refList = React.useRef<FlatList<INamedEntity>>(null);
  useScrollToTop(refList);

  const renderItem = ({ item }: { item: INamedEntity }) => <Good item={item} />;

  return (
    <AppScreen>
      <SubTitle style={styles.title}>{goods.description || goods.name}</SubTitle>
      <Divider />
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
      <FlatList
        ref={refList}
        data={filteredList}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
      />
    </AppScreen>
  );
};
