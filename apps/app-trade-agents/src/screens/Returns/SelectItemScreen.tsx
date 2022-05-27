import React, { useState, useEffect, useMemo, useLayoutEffect, useCallback } from 'react';
import { RouteProp, useNavigation, useRoute, useScrollToTop, useTheme } from '@react-navigation/native';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Searchbar, Divider } from 'react-native-paper';

import { AppScreen, ItemSeparator, SearchButton, SubTitle, globalStyles as styles } from '@lib/mobile-ui';
import { refSelectors } from '@lib/store';
import { INamedEntity } from '@lib/types';

import { generateId } from '@lib/mobile-app';

import { ReturnsStackParamList } from '../../navigation/Root/types';
import { IReturnLine } from '../../store/types';
import { navBackButton } from '../../components/navigateOptions';

const SelectItemScreen = () => {
  const navigation = useNavigation<StackNavigationProp<ReturnsStackParamList, 'SelectItemReturn'>>();
  const { colors } = useTheme();
  const { docId, name } = useRoute<RouteProp<ReturnsStackParamList, 'SelectItemReturn'>>().params;

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  const list = refSelectors.selectByName<INamedEntity>(name);

  const filteredList = useMemo(() => {
    return (
      list?.data
        .filter((i) => (i.name ? i.name.toUpperCase().includes(searchQuery.toUpperCase()) : true))
        ?.sort((a, b) => (a.name < b.name ? -1 : 1)) || []
    );
  }, [list?.data, searchQuery]);

  useEffect(() => {
    if (!filterVisible && searchQuery) {
      setSearchQuery('');
    }
  }, [filterVisible, searchQuery]);

  const renderRight = useCallback(
    () => <SearchButton visible={filterVisible} onPress={() => setFilterVisible((prev) => !prev)} />,
    [filterVisible],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
      headerRight: renderRight,
    });
  }, [navigation, renderRight]);

  const refList = React.useRef<FlatList<INamedEntity>>(null);
  useScrollToTop(refList);

  const renderItem = ({ item }: { item: INamedEntity }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ReturnLine', {
            mode: 0,
            docId,
            item: { id: generateId(), good: { id: item.id, name: item.name }, quantity: 0 } as IReturnLine,
          });
        }}
      >
        <View style={[styles.item, { backgroundColor: colors.background }]}>
          <View style={[styles.icon]}>
            <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
          </View>
          <View style={styles.details}>
            <View style={styles.rowCenter}>
              <Text style={[styles.name, { color: colors.text }]}>{item.name || item.id}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <AppScreen>
      <SubTitle style={[styles.title, { backgroundColor: colors.background }]}>{list?.name}</SubTitle>
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
              selectionColor={colors.primary}
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

export default SelectItemScreen;
