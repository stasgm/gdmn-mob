import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '@lib/mobile-navigation';
import {
  globalStyles,
  AppScreen,
  ItemSeparator,
  SubTitle,
  EmptyList,
  AppActivityIndicator,
  SearchButton,
  navBackButton,
} from '@lib/mobile-ui';
import { docSelectors, refSelectors, useSelector } from '@lib/store';
import { RouteProp, useIsFocused, useNavigation, useRoute, useScrollToTop, useTheme } from '@react-navigation/native';
import React, { useState, useEffect, useMemo, useLayoutEffect, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, Text, Alert } from 'react-native';
import { Searchbar, Divider } from 'react-native-paper';

import { StackNavigationProp } from '@react-navigation/stack';

import { generateId, keyExtractor } from '@lib/mobile-app';

import { OrdersStackParamList } from '../../navigation/Root/types';
import { IGood, IGoodMatrix, IOrderDocument } from '../../store/types';
import { getGoodMatrixByContact } from '../../utils/helpers';

interface IProp {
  item: IGood;
  onPress: (item: IGood) => void;
  quantity?: number;
}

const Good = ({ item, onPress, quantity }: IProp) => {
  const iconStyle = useMemo(() => [styles.icon, { backgroundColor: quantity ? '#06567D' : '#E91E63' }], [quantity]);

  return (
    <TouchableOpacity onPress={() => onPress(item)}>
      <View style={styles.item}>
        <View style={iconStyle}>
          <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <View style={styles.directionRow}>
            <Text style={styles.name}>{item.name || item.id}</Text>
          </View>
          {quantity ? (
            <View style={styles.flexDirectionRow}>
              <MaterialCommunityIcons name="shopping-outline" size={18} />
              <Text style={globalStyles.field}>{quantity} кг</Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const SelectGoodScreen = () => {
  const navigation = useNavigation<StackNavigationProp<OrdersStackParamList, 'SelectGoodItem'>>();
  const { colors } = useTheme();
  const { groupId, docId } = useRoute<RouteProp<OrdersStackParamList, 'SelectGoodItem'>>().params;
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const isUseNetPrice = useSelector((state) => state.settings.data?.isUseNetPrice?.data) as boolean;

  const doc = docSelectors.selectByDocId<IOrderDocument>(docId);

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

  const refList = React.useRef<FlatList<IGood>>(null);
  useScrollToTop(refList);

  const handlePressGood = useCallback(
    (item: IGood) => {
      const good = doc.lines?.find((i) => i.good.id === item.id);

      if (good) {
        Alert.alert(
          'Товар уже добавлен в документ!',
          "Нажмите 'Добавить', если хотите добавить новую позицию.\n\nНажмите 'Редактировать', если хотите редактировать существующую позицию.",
          [
            {
              text: 'Отмена',
            },
            {
              text: 'Редактировать',
              onPress: () => navigation.navigate('OrderLine', { mode: 1, docId, item: good }), //() => navigation.navigate('OrderLine', { mode: 1, docId, item: good }),
            },
            {
              text: 'Добавить',
              onPress: () =>
                navigation.navigate('OrderLine', {
                  mode: 0,
                  docId,
                  item: { id: generateId(), good: item, quantity: 0 },
                }),
            },
          ],
        );
      } else {
        navigation.navigate('OrderLine', { mode: 0, docId, item: { id: generateId(), good: item, quantity: 0 } });
      }
    },
    [doc.lines, docId, navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: IGood }) => {
      const good = doc.lines?.find((i) => i.good.id === item.id);
      return <Good key={item.id} item={item} onPress={() => handlePressGood(item)} quantity={good?.quantity} />;
    },
    [doc.lines, handlePressGood],
  );

  const contactId = doc.head.contact.id;

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

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

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
              selectionColor={colors.primary}
            />
          </View>
          <ItemSeparator />
        </>
      )}

      <FlatList
        ref={refList}
        data={filteredList}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        keyExtractor={keyExtractor}
        // refreshControl={RC}
        ListEmptyComponent={EmptyList}
        removeClippedSubviews={true} // Unmount compsonents when outside of window
        initialNumToRender={6}
        maxToRenderPerBatch={6} // Reduce number in each render batch
        updateCellsBatchingPeriod={100} // Increase time between renders
        windowSize={7} // Reduce the window size
      />
    </AppScreen>
  );
};

export default SelectGoodScreen;
