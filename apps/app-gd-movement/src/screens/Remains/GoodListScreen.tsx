import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { styles } from '@lib/mobile-navigation';
import { IconButton, Searchbar } from 'react-native-paper';
import { RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { AppScreen, BackButton, ItemSeparator, SubTitle } from '@lib/mobile-ui';

import { refSelectors, useSelector } from '@lib/store';

import { IDepartment, IReferences } from '@lib/types';

import { RemainsStackParamList } from '../../navigation/Root/types';

import { IEmployee, IGood, IRemains, IRemGood } from '../../store/app/types';
import { getRemGoodListByContact } from '../../utils/helpers';

import GoodItem from './components/GoodItem';

const GoodListScreen = () => {
  const { id } = useRoute<RouteProp<RemainsStackParamList, 'GoodList'>>().params;
  const references = useSelector((state) => state.references.list) as IReferences;

  const contacts = Object.entries(references).find((item) => item[1].data.find((i) => i.id === id))?.[1].data as
    | IDepartment[]
    | IEmployee[];
  const contact = contacts?.find((i) => i.id === id);

  const remains = refSelectors.selectByName<IRemains>('remains')?.data[0];

  const goods = refSelectors.selectByName<IGood>('good')?.data;
  const [goodRemains] = useState<IRemGood[]>(() =>
    contact?.id ? getRemGoodListByContact(contacts, goods, remains, contact.id, true) : [],
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const { colors } = useTheme();
  const navigation = useNavigation();

  const filteredList = useMemo(() => {
    const res = goodRemains;
    return (
      res
        ?.filter((i) =>
          i.good.name || i.good.barcode || i.good.alias
            ? String(i.good.name).toUpperCase().includes(searchQuery.toUpperCase()) ||
              String(i.good.barcode).toUpperCase().includes(searchQuery.toUpperCase()) ||
              String(i.good.alias).toUpperCase().includes(searchQuery.toUpperCase())
            : true,
        )
        ?.sort((a, b) => (a.good.name < b.good.name ? -1 : 1)) || []
    );
  }, [goodRemains, searchQuery]);

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

  const renderItem = ({ item }: { item: IRemGood }) => <GoodItem item={item} />;

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
            />
          </View>
          <ItemSeparator />
        </>
      )}
      <FlatList
        data={filteredList}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        scrollEventThrottle={400}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={!goods || !goodRemains ? <Text style={styles.emptyList}>Список пуст</Text> : null}
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
