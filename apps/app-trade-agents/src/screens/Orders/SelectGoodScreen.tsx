import { v4 as uuid } from 'uuid';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '@lib/mobile-navigation/src/screens/References/styles';
import { AppScreen, BackButton, ItemSeparator, SubTitle } from '@lib/mobile-ui';
import { refSelectors } from '@lib/store';
import { INamedEntity, IReference } from '@lib/types';
import { RouteProp, useNavigation, useRoute, useScrollToTop, useTheme } from '@react-navigation/native';
import React, { useState, useEffect, useMemo, useLayoutEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { Searchbar, IconButton, Divider } from 'react-native-paper';

import { OrdersStackParamList } from '../../navigation/Root/types';
import { IGood } from '../../store/docs/types';

const Good = ({ item }: { item: INamedEntity }) => {
  const navigation = useNavigation();

  const { docId } = useRoute<RouteProp<OrdersStackParamList, 'SelectGoodItem'>>().params;

  return (
    <TouchableOpacity
      onPress={() => {
        // dispatch(documentActions.);
        navigation.navigate('OrderLine', {
          mode: 0,
          docId,
          item: { id: uuid(), good: { id: item.id, name: item.name }, quantity: 0 },
        });
      }}>
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

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  const { groupId } = useRoute<RouteProp<OrdersStackParamList, 'SelectGoodItem'>>().params;

  const goods = refSelectors.selectByName('good') as IReference<IGood>;

  const list = goods.data?.filter((good) => good.goodgroup.id === groupId);

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

  const renderItem = ({ item }: { item: INamedEntity }) => <Good item={item} />;

  return (
    <AppScreen>
      {/*<SubTitle style={styles.title}>{list?.name}</SubTitle>*/}
      <SubTitle style={styles.title}>{goods.name}</SubTitle>
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
