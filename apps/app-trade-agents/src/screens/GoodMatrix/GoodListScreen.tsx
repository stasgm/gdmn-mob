import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { styles } from '@lib/mobile-navigation';
import { IconButton, Searchbar } from 'react-native-paper';
import { RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { AppScreen, ItemSeparator, SubTitle } from '@lib/mobile-ui';

import { refSelectors } from '@lib/store';

import { GoodMatrixStackParamList } from '../../navigation/Root/types';
import { IContact, IGood, IGoodMatrix } from '../../store/types';

import { getGoodMatrixByContact } from '../../utils/helpers';

import { navBackButton } from '../../components/navigateOptions';

import GoodItem from './components/GoodItem';

const keyExtractor = (item: IGood) => String(item.id);

const GoodListScreen = () => {
  const { id } = useRoute<RouteProp<GoodMatrixStackParamList, 'GoodList'>>().params;
  const contact = refSelectors.selectByName<IContact>('contact')?.data.find((e) => e.id === id);

  const goodMatrix = refSelectors.selectByName<IGoodMatrix>('goodMatrix')?.data?.[0];

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const { colors } = useTheme();
  const navigation = useNavigation();

  const goods = refSelectors.selectByName<IGood>('good')?.data;

  const goodRemains = useMemo(
    () => (contact?.id ? getGoodMatrixByContact(goods, goodMatrix[contact.id], true) : []),
    [contact?.id, goodMatrix, goods],
  );

  const filteredList = useMemo(() => {
    return (
      goodRemains
        ?.filter((i) =>
          i.name || i.priceFsn
            ? String(i.name).toUpperCase().includes(searchQuery.toUpperCase()) ||
              String(i.priceFsn).toUpperCase().includes(searchQuery.toUpperCase())
            : true,
        )
        ?.sort((a, b) => (a.name < b.name ? -1 : 1)) || []
    );
  }, [goodRemains, searchQuery]);

  useEffect(() => {
    if (!filterVisible && searchQuery) {
      setSearchQuery('');
    }
  }, [filterVisible, searchQuery]);

  const renderRight = useCallback(
    () => (
      <IconButton
        icon="card-search-outline"
        style={filterVisible && { backgroundColor: colors.card }}
        size={26}
        onPress={() => setFilterVisible((prev) => !prev)}
      />
    ),
    [colors.card, filterVisible],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
      headerRight: renderRight,
    });
  }, [navigation, renderRight]);

  const renderItem = ({ item }: { item: IGood }) => <GoodItem item={item} />;

  const EC = useMemo(() => <Text style={styles.emptyList}>Список пуст</Text>, []);

  return (
    <AppScreen>
      <SubTitle style={[localStyles.title]}>{contact?.name}</SubTitle>
      {filterVisible && (
        <>
          <View style={styles.flexDirectionRow}>
            <Searchbar
              placeholder="Поиск"
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={[styles.flexGrow, styles.searchBar]}
              autoFocus
              selectionColor={colors.primary}
            />
          </View>
          <ItemSeparator />
        </>
      )}
      <FlatList
        data={filteredList}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        scrollEventThrottle={400}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={EC}
      />
    </AppScreen>
  );
};

export default GoodListScreen;

const localStyles = StyleSheet.create({
  title: {
    fontSize: 20,
    textAlign: 'center',
    padding: 5,
  },
});
