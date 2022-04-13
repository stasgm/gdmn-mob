import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { FlatList, View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import { styles } from '@lib/mobile-navigation';
import { IconButton, Searchbar, Menu } from 'react-native-paper';
import { RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { AppScreen, BackButton, ItemSeparator, SubTitle, globalStyles } from '@lib/mobile-ui';

import { refSelectors, useSelector } from '@lib/store';

import { IDepartment, IReferences } from '@lib/types';

import { IListItem } from '@lib/mobile-types';

import { RemainsStackParamList } from '../../navigation/Root/types';

import { IEmployee, IGood, IRemains, IRemGood } from '../../store/app/types';
import { getRemGoodListByContact } from '../../utils/helpers';

import GoodItem from './components/GoodItem';

interface IFilteredList {
  searchQuery: string;
  goodRemains: IRemGood[];
}

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
    contact?.id ? getRemGoodListByContact(goods, remains[contact.id], true) : [],
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const { colors } = useTheme();
  const navigation = useNavigation();

  const [visibleMenu, setVisibleMenu] = useState(false);

  const remainsList: IListItem[] = useMemo(
    () => [
      {
        id: 'all',
        value: 'Все',
      },
      {
        id: 'notNull',
        value: 'Ненулевые',
      },
    ],
    [],
  );

  const [rem, setRem] = useState(remainsList[0]);

  const [filteredList, setFilteredList] = useState<IFilteredList>({
    searchQuery: '',
    goodRemains,
  });

  const handleApply = useCallback(
    (option) => {
      setVisibleMenu(false);
      setFilteredList({
        searchQuery,
        goodRemains: option.id === 'all' ? goodRemains : goodRemains.filter((item) => item.remains > 0),
      });

      setRem(option);
    },
    [goodRemains, searchQuery],
  );

  useEffect(() => {
    if (searchQuery !== filteredList.searchQuery) {
      if (!searchQuery) {
        setFilteredList({
          searchQuery,
          goodRemains,
        });
      } else {
        const lower = searchQuery.toLowerCase();

        const fn = isNaN(Number(lower))
          ? ({ good }: IRemGood) => good.name?.toLowerCase().includes(lower)
          : ({ good }: IRemGood) => good.barcode?.includes(searchQuery) || good.name?.toLowerCase().includes(lower);

        let gr;

        if (
          filteredList.searchQuery &&
          searchQuery.length > filteredList.searchQuery.length &&
          searchQuery.startsWith(filteredList.searchQuery)
        ) {
          gr = filteredList.goodRemains.filter(fn);
        } else {
          gr = goodRemains.filter(fn);
        }

        setFilteredList({
          searchQuery,
          goodRemains: gr,
        });
      }
    }
  }, [goodRemains, filteredList, searchQuery]);

  useEffect(() => {
    if (!filterVisible && searchQuery) {
      setSearchQuery('');
    }
  }, [filterVisible, searchQuery]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
      headerRight: () => (
        <View style={globalStyles.buttons}>
          <IconButton
            icon="card-search-outline"
            style={filterVisible && { backgroundColor: colors.card }}
            size={26}
            onPress={() => setFilterVisible((prev) => !prev)}
          />
          <Menu
            visible={visibleMenu}
            onDismiss={() => setVisibleMenu(false)}
            anchor={
              <View style={localStyles.menu}>
                <IconButton
                  icon="filter-outline"
                  style={filterVisible && { backgroundColor: colors.card }}
                  size={26}
                  onPress={() => setVisibleMenu(true)}
                />
              </View>
            }
          >
            {remainsList?.map((option) => (
              <TouchableHighlight
                activeOpacity={0.7}
                underlayColor="#DDDDDD"
                key={`${option?.id}`}
                onPress={() => handleApply(option)}
              >
                <View style={localStyles.container}>
                  <IconButton icon={rem.id === option?.id ? 'check' : ''} size={20} />
                  <Menu.Item title={option?.value} />
                </View>
              </TouchableHighlight>
            ))}
          </Menu>
        </View>
      ),
    });
  }, [navigation, filterVisible, colors.card, visibleMenu, remainsList, rem.id, handleApply]);

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
        data={filteredList.goodRemains}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        scrollEventThrottle={400}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={!goods || !goodRemains.length ? <Text style={styles.emptyList}>Список пуст</Text> : null}
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
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menu: {
    justifyContent: 'center',
    marginLeft: 6,
    width: '100%',
  },
});
