import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '@lib/mobile-navigation';
import { AppScreen, BackButton, ItemSeparator, SubTitle } from '@lib/mobile-ui';
import { docSelectors, refSelectors, useSelector } from '@lib/store';
import { RouteProp, useNavigation, useRoute, useScrollToTop, useTheme } from '@react-navigation/native';
import React, { useState, useEffect, useMemo, useLayoutEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { Searchbar, IconButton, Divider } from 'react-native-paper';

import { StackNavigationProp } from '@react-navigation/stack';

import { generateId } from '@lib/mobile-app';

import { OrdersStackParamList } from '../../navigation/Root/types';
import { IGood, IGoodMatrix, IOrderDocument } from '../../store/types';
import { getGoodMatrixByContact } from '../../utils/helpers';

const Good = ({ item }: { item: IGood }) => {
  const navigation = useNavigation<StackNavigationProp<OrdersStackParamList, 'SelectGoodItem'>>();

  const { docId } = useRoute<RouteProp<OrdersStackParamList, 'SelectGoodItem'>>().params;

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('OrderLine', {
          mode: 0,
          docId,
          item: { id: generateId(), good: item, quantity: 0 },
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
  const isUseNetPrice = useSelector((state) => state.settings.data?.isUseNetPrice?.data) as boolean;

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

  const contactId = docSelectors.selectByDocId<IOrderDocument>(docId)?.head.contact?.id;

  const goodMatrix = refSelectors.selectByName<IGoodMatrix>('goodMatrix')?.data?.[0];

  const goodRef = refSelectors.selectByName<IGood>('good');
  const goods = goodRef.data;

  const model = useMemo(
    () => (contactId ? getGoodMatrixByContact(goods, goodMatrix[contactId], isUseNetPrice, groupId) : []),
    [contactId, groupId, isUseNetPrice, goodMatrix, goods],
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
      <SubTitle style={styles.title}>{goodRef.description || goodRef.name}</SubTitle>
      <Divider />
      {filterVisible && (
        <>
          <View style={styles.flexDirectionRow}>
            <Searchbar
              placeholder="Поиск"
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={[styles.flexGrow, styles.searchBar]}
              autoFocus
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
