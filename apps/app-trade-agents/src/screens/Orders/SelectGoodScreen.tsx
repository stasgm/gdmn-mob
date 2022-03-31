import { v4 as uuid } from 'uuid';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '@lib/mobile-navigation';
import { AppScreen, BackButton, ItemSeparator, SubTitle } from '@lib/mobile-ui';
import { docSelectors, refSelectors } from '@lib/store';
import { RouteProp, useNavigation, useRoute, useScrollToTop, useTheme } from '@react-navigation/native';
import React, { useState, useEffect, useMemo, useLayoutEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { Searchbar, IconButton, Divider } from 'react-native-paper';

import { StackNavigationProp } from '@react-navigation/stack';

import { OrdersStackParamList } from '../../navigation/Root/types';
import { IGood, IGoodMatrix, IOrderDocument } from '../../store/types';
import { getGoodMatrixGoodByContact } from '../../utils/helpers';

const Good = ({ item }: { item: IGood }) => {
  const navigation = useNavigation<StackNavigationProp<OrdersStackParamList, 'SelectGoodItem'>>();

  const { docId } = useRoute<RouteProp<OrdersStackParamList, 'SelectGoodItem'>>().params;

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('OrderLine', {
          mode: 0,
          docId,
          item: { id: uuid(), good: item, quantity: 0 },
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

const SelectGoodScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { groupId, docId } = useRoute<RouteProp<OrdersStackParamList, 'SelectGoodItem'>>().params;
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

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

  const refList = React.useRef<FlatList<IGood>>(null);
  useScrollToTop(refList);

  const renderItem = ({ item }: { item: IGood }) => <Good item={item} />;

  const contactId =
    docSelectors.selectByDocType<IOrderDocument>('order')?.find((e) => e.id === docId)?.head.contact?.id || -1;

  const newGoodMatrix = refSelectors.selectByName<IGoodMatrix>('goodMatrix')?.data?.[0];

  const newGoods = refSelectors.selectByName<IGood>('good').data;
  const newGoods1 = refSelectors.selectByName<IGood>('good');

  const model = useMemo(
    () => getGoodMatrixGoodByContact(newGoods, newGoodMatrix[contactId], groupId),
    [contactId, groupId, newGoodMatrix, newGoods],
  );

  const filteredList = useMemo(() => {
    return (
      model
        ?.filter((i) => (i.name ? i.name.toUpperCase().includes(searchQuery.toUpperCase()) : true))
        ?.sort((a, b) => (a.name < b.name ? -1 : 1)) || []
    );
  }, [model, searchQuery]);

  return (
    <AppScreen>
      <SubTitle style={styles.title}>{newGoods1.description || newGoods1.name}</SubTitle>
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

export default SelectGoodScreen;
