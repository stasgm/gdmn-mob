import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { styles } from '@lib/mobile-navigation';
import { Searchbar } from 'react-native-paper';
import { RouteProp, useIsFocused, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import {
  AppActivityIndicator,
  AppScreen,
  EmptyList,
  ItemSeparator,
  navBackButton,
  SearchButton,
  SubTitle,
} from '@lib/mobile-ui';

import { refSelectors } from '@lib/store';

import { keyExtractor } from '@lib/mobile-hooks';

import { GoodMatrixStackParamList } from '../../navigation/Root/types';
import { IContact, IGood, IGoodMatrix } from '../../store/types';

import { getGoodMatrixByContact } from '../../utils/helpers';

import GoodItem from './components/GoodItem';

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
    () => <SearchButton onPress={() => setFilterVisible((prev) => !prev)} visible={filterVisible} />,
    [filterVisible],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
      headerRight: renderRight,
    });
  }, [navigation, renderRight]);

  const renderItem = ({ item }: { item: IGood }) => <GoodItem item={item} />;

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

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
              keyboardType="url"
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
        ListEmptyComponent={EmptyList}
        keyboardShouldPersistTaps={'handled'}
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
