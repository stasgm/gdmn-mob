import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '@lib/mobile-navigation';
import { globalStyles, AppScreen, ItemSeparator, SubTitle } from '@lib/mobile-ui';
import { docSelectors, refSelectors, useSelector } from '@lib/store';
import { RouteProp, useNavigation, useRoute, useScrollToTop, useTheme } from '@react-navigation/native';
import React, { useState, useEffect, useMemo, useLayoutEffect, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, Text, Alert } from 'react-native';
import { Searchbar, IconButton, Divider } from 'react-native-paper';

import { StackNavigationProp } from '@react-navigation/stack';

import { generateId } from '@lib/mobile-app';

import { OrdersStackParamList } from '../../navigation/Root/types';
import { IGood, IGoodMatrix, IOrderDocument } from '../../store/types';
import { getGoodMatrixByContact } from '../../utils/helpers';
import { navBackButton } from '../../components/navigateOptions';

const Good = ({ item }: { item: IGood }) => {
  const navigation = useNavigation<StackNavigationProp<OrdersStackParamList, 'SelectGoodItem'>>();

  const { docId } = useRoute<RouteProp<OrdersStackParamList, 'SelectGoodItem'>>().params;

  const doc = docSelectors.selectByDocId<IOrderDocument>(docId);

  const good = doc.lines?.find((i) => i.good.id === item.id);

  const iconStyle = { backgroundColor: good ? '#06567D' : '#E91E63' };

  const handleNavigate = () => {
    if (good) {
      Alert.alert('Внимание!', 'Данный товар уже добавлен в позицию документа', [
        {
          text: 'Отмена',
        },
        {
          text: 'Добавить',
          onPress: () =>
            navigation.navigate('OrderLine', { mode: 0, docId, item: { id: generateId(), good: item, quantity: 0 } }),
        },

        {
          text: 'Редактировать',
          onPress: () => navigation.navigate('OrderLine', { mode: 1, docId, item: good }),
        },
      ]);
    } else {
      navigation.navigate('OrderLine', { mode: 0, docId, item: { id: generateId(), good: item, quantity: 0 } });
    }
  };

  return (
    <TouchableOpacity onPress={handleNavigate}>
      <View style={styles.item}>
        <View style={[styles.icon, iconStyle]}>
          <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <View style={styles.directionRow}>
            <Text style={styles.name}>{item.name || item.id}</Text>
          </View>
          {good ? (
            <View style={styles.flexDirectionRow}>
              <MaterialCommunityIcons name="shopping-outline" size={18} />
              <Text style={globalStyles.field}>{good?.quantity} кг</Text>
            </View>
          ) : null}
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

  const searchStyle = useMemo(() => colors.primary, [colors.primary]);

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
              selectionColor={searchStyle}
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
