import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '@lib/mobile-navigation/src/screens/References/styles';
import { BackButton, ItemSeparator, SubTitle } from '@lib/mobile-ui';
import { documentActions, refSelectors } from '@lib/store';
import { INamedEntity, IReference } from '@lib/types';
import { RouteProp, useNavigation, useRoute, useScrollToTop, useTheme } from '@react-navigation/native';
import React, { useState, useEffect, useMemo, useLayoutEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { Searchbar, IconButton } from 'react-native-paper';

import { OrdersStackParamList } from '../../navigation/Root/types';

const SelectItemScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  const { docId, name } = useRoute<RouteProp<OrdersStackParamList, 'SelectItem'>>().params;

  const list = refSelectors.selectByName(name) as IReference<INamedEntity>;

  const filteredList = useMemo(() => {
    return (
      list?.data
        .filter((i) => (i.name ? i.name.toUpperCase().includes(searchQuery.toUpperCase()) : true))
        ?.sort((a, b) => (a.name < b.name ? -1 : 1)) || []
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list, searchQuery]);

  useEffect(() => {
    if (!filterVisible && searchQuery) {
      setSearchQuery('');
    }
  }, [filterVisible, searchQuery]);

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

  const refList = React.useRef<FlatList<INamedEntity>>(null);
  useScrollToTop(refList);

  const renderItem = ({ item }: { item: INamedEntity }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          // dispatch(documentActions.);
          navigation.navigate('OrderLine', {
            docId,
            item: { id: 1, good: { id: item.id, name: item.name }, quantity: 1 },
          });
        }}
      >
        <View style={[styles.item, { backgroundColor: colors.background }]}>
          <View style={[styles.icon]}>
            <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
          </View>
          <View style={styles.details}>
            <View style={styles.directionRow}>
              <Text style={[styles.name, { color: colors.text }]}>{item.name || item.id}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.content, { backgroundColor: colors.background }]}>
      <SubTitle style={[styles.title, { backgroundColor: colors.background }]}>{list.name}</SubTitle>
      <ItemSeparator />
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
    </View>
  );
};

export default SelectItemScreen;
