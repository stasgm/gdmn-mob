import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { RouteProp, useRoute, useScrollToTop, useTheme } from '@react-navigation/native';
import { View, FlatList, Alert, RefreshControl, Text } from 'react-native';
import { Divider, IconButton, Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/core';

import {
  globalStyles as styles,
  ItemSeparator,
  SubTitle,
  useActionSheet,
  MenuButton,
  BackButton,
  AppScreen,
} from '@lib/mobile-ui';
import { documentActions, docSelectors, useDocThunkDispatch } from '@lib/store';

import { getDateString } from '@lib/mobile-app';

import { StackNavigationProp } from '@react-navigation/stack';

import { RoutesStackParamList } from '../../navigation/Root/types';
import { IOrderDocument, IReturnDocument, IRouteDocument, IRouteLine, IVisitDocument } from '../../store/types';
import actions from '../../store/geo';

import { useDispatch, useSelector } from '../../store';

import RouteItem from './components/RouteItem';
import RouteTotal from './components/RouteTotal';

interface IFilteredList {
  searchQuery: string;
  routeLineList: IRouteLine[] | undefined;
}

const keyExtractor = (item: IRouteLine) => String(item.id);

const RouteViewScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RoutesStackParamList, 'RouteView'>>();
  const showActionSheet = useActionSheet();
  const docDispatch = useDocThunkDispatch();
  const dispatch = useDispatch();

  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  const id = useRoute<RouteProp<RoutesStackParamList, 'RouteView'>>().params.id;

  const route = docSelectors.selectByDocType<IRouteDocument>('route')?.find((e) => e.id === id);
  const routeLineList = route?.lines.sort((a, b) => a.ordNumber - b.ordNumber);

  const [filteredList, setFilteredList] = useState<IFilteredList>({
    searchQuery: '',
    routeLineList,
  });

  useEffect(() => {
    if (searchQuery !== filteredList.searchQuery) {
      if (!searchQuery) {
        setFilteredList({
          searchQuery,
          routeLineList,
        });
      } else {
        const lower = searchQuery.toLowerCase();

        const fn = ({ outlet }: IRouteLine) => outlet?.name?.toLowerCase().includes(lower);

        let gr;

        if (
          filteredList.searchQuery &&
          searchQuery.length > filteredList.searchQuery.length &&
          searchQuery.startsWith(filteredList.searchQuery)
        ) {
          gr = filteredList.routeLineList?.filter(fn);
        } else {
          gr = routeLineList?.filter(fn);
        }

        setFilteredList({
          searchQuery,
          routeLineList: gr,
        });
      }
    }
  }, [filteredList, searchQuery, routeLineList]);

  const ref = useRef<FlatList<IRouteLine>>(null);
  useScrollToTop(ref);

  const visitList = docSelectors
    .selectByDocType<IVisitDocument>('visit')
    ?.filter((e) => routeLineList?.find((line) => line.id === e.head.routeLineId))
    .map((doc) => doc.id);

  const orderList = docSelectors
    .selectByDocType<IOrderDocument>('order')
    ?.filter((e) => e.head.route?.id === id)
    .map((doc) => doc.id);

  const returnList = docSelectors
    .selectByDocType<IReturnDocument>('return')
    ?.filter((e) => e.head.route?.id === id)
    .map((doc) => doc.id);

  const geoList = useSelector((state) => state.geo?.list?.filter((g) => g.routeId === id));

  const handleDelete = useCallback(() => {
    const deleteRoute = async () => {
      const res = await docDispatch(documentActions.removeDocuments([...visitList, ...orderList, ...returnList, id]));
      dispatch(actions.geoActions.removeMany(geoList));
      if (res.type === 'DOCUMENTS/REMOVE_MANY_SUCCESS') {
        navigation.goBack();
      }
    };

    Alert.alert('Вы уверены, что хотите удалить маршрут и его документы?', '', [
      {
        text: 'Да',
        onPress: async () => {
          deleteRoute();
        },
      },
      {
        text: 'Отмена',
      },
    ]);
  }, [dispatch, docDispatch, geoList, id, navigation, orderList, returnList, visitList]);

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Удалить маршрут и его документы',
        type: 'destructive',
        onPress: handleDelete,
      },
      {
        title: 'Отмена',
        type: 'cancel',
      },
    ]);
  }, [handleDelete, showActionSheet]);

  useEffect(() => {
    if (!filterVisible && searchQuery) {
      setSearchQuery('');
    }
  }, [filterVisible, searchQuery]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
      headerRight: () => (
        <View style={styles.buttons}>
          <IconButton
            icon="card-search-outline"
            style={filterVisible && { backgroundColor: colors.card }}
            size={26}
            onPress={() => setFilterVisible((prev) => !prev)}
          />
          <MenuButton actionsMenu={actionsMenu} />
        </View>
      ),
    });
  }, [actionsMenu, colors.card, filterVisible, navigation]);

  const RC = useMemo(
    () => <RefreshControl refreshing={!filteredList.routeLineList} title="загрузка данных..." />,
    [filteredList.routeLineList],
  );

  const EC = useMemo(() => <Text style={styles.emptyList}>Список пуст</Text>, []);

  if (!route) {
    return (
      <View style={styles.container}>
        <SubTitle style={styles.title}>Маршрут не найден</SubTitle>
      </View>
    );
  }

  const renderItem = ({ item }: { item: IRouteLine }) => <RouteItem item={item} routeId={route.id} />;

  return (
    <AppScreen>
      <SubTitle style={styles.title}>{getDateString(route.documentDate)}</SubTitle>
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
        ref={ref}
        data={filteredList.routeLineList}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        scrollEventThrottle={400}
        ItemSeparatorComponent={ItemSeparator}
        refreshControl={RC}
        ListEmptyComponent={EC}
        removeClippedSubviews={true} // Unmount compsonents when outside of window
        initialNumToRender={13}
        maxToRenderPerBatch={13} // Reduce number in each render batch
        updateCellsBatchingPeriod={50} // Increase time between renders
        windowSize={11} // Reduce the window size
      />
      <RouteTotal routeId={id} />
    </AppScreen>
  );
};

export default RouteViewScreen;
