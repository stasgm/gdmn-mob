import React, { useState, useMemo, useLayoutEffect, useEffect } from 'react';
import { SubTitle, ItemSeparator, BackButton, SearchButton } from '@lib/mobile-ui';
import { refSelectors } from '@lib/store';
import { INamedEntity, IReference } from '@lib/types';
import { useScrollToTop, RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { View, FlatList } from 'react-native';
import { Searchbar, useTheme } from 'react-native-paper';

import { ReferenceStackParamList } from '../../navigation/Root/types';

import { styles } from './styles';
import ReferenceItem from './components/ReferenceItem';

const ReferenceViewScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  const refName = useRoute<RouteProp<ReferenceStackParamList, 'ReferenceView'>>().params?.name;

  const list = refSelectors.selectByName(refName) as IReference<INamedEntity>;

  const filteredList = useMemo(() => {
    return (
      list?.data
        .filter((i) => (i.name ? i.name.toUpperCase().includes(searchQuery.toUpperCase()) : true))
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
      headerRight: () => <SearchButton visible={filterVisible} onPress={() => setFilterVisible((prev) => !prev)} />,
    });
  }, [navigation, filterVisible]);

  if (!list) {
    return (
      <View style={[styles.content, { backgroundColor: colors.background }]}>
        <SubTitle style={[styles.title, { backgroundColor: colors.background }]}>Справочник не найден</SubTitle>
      </View>
    );
  }

  const ref = React.useRef<FlatList<INamedEntity>>(null);

  useScrollToTop(ref);

  const renderItem = ({ item }: { item: INamedEntity }) => <ReferenceItem item={item} refName={refName} />;

  return (
    <View style={[styles.content, { backgroundColor: colors.background }]}>
      <SubTitle style={[styles.title, { backgroundColor: colors.background }]}>{list?.name}</SubTitle>
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
        ref={ref}
        data={filteredList}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        scrollEventThrottle={400}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};

export default ReferenceViewScreen;
