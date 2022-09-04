import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { RouteProp, useRoute, useScrollToTop, useTheme, useNavigation } from '@react-navigation/native';
import { View, FlatList, Alert, RefreshControl } from 'react-native';
import { Divider, Searchbar } from 'react-native-paper';

import {
  globalStyles as styles,
  ItemSeparator,
  SubTitle,
  useActionSheet,
  MenuButton,
  AppScreen,
  EmptyList,
  SearchButton,
  navBackButton,
  AppActivityIndicator,
} from '@lib/mobile-ui';
import { documentActions, docSelectors, useDocThunkDispatch, appActions, useSelector } from '@lib/store';

import { getDateString, keyExtractor, useFilteredDocList } from '@lib/mobile-app';

import { StackNavigationProp } from '@react-navigation/stack';

import { RoutesStackParamList } from '../../navigation/Root/types';
import { IOrderDocument, IRouteDocument, IRouteFormParam, IRouteLine, IVisitDocument } from '../../store/types';
import actions from '../../store/geo';

import { useDispatch, useSelector as useAppSelector } from '../../store';

import { getItemLayout, viewabilityConfig } from '../../utils/helpers';

import { ROUTE_ITEM_HEIGHT } from '../../utils/constants';

import RouteItem from './components/RouteItem';
import RouteTotal from './components/RouteTotal';

interface IFilteredList {
  searchQuery: string;
  routeLineList: IRouteLine[] | undefined;
}

const RouteViewScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RoutesStackParamList, 'RouteView'>>();
  const showActionSheet = useActionSheet();
  const docDispatch = useDocThunkDispatch();
  const dispatch = useDispatch();

  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [isGroupVisible, setIsGroupVisible] = useState(true);

  const id = useRoute<RouteProp<RoutesStackParamList, 'RouteView'>>().params.id;

  const route = docSelectors.selectByDocId<IRouteDocument>(id);
  const routeLineList = useMemo(() => route?.lines.sort((a, b) => a.ordNumber - b.ordNumber), [route?.lines]);

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

  const orders = useFilteredDocList<IOrderDocument>('order');
  const visits = useFilteredDocList<IVisitDocument>('visit');

  const geoList = useAppSelector((state) => state.geo?.list)?.filter((g) => g.routeId === id);

  //Первый элемент из списка точек маршрута
  const routeItemId = useSelector((state) => state.app.formParams as IRouteFormParam)?.routeItemId;

  //Первый элемент записывается в параметры формы при прокрутке списка точек маршрута
  //При возвращении с окна визита, переходит на этот эелемент (initialScrollIndex)
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }) => {
      if (viewableItems.length) {
        dispatch(
          appActions.setFormParams({
            routeItemId: viewableItems[0].index,
          }),
        );
      }
    },
    [dispatch],
  );

  const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }]);

  const handleDelete = useCallback(() => {
    const deleteRoute = async () => {
      const delDocList: string[] = [];

      orders.forEach((o) => {
        if (o.head.route?.id === id) {
          delDocList.push(o.id);
        }
      });

      visits.forEach((v) => {
        if (routeLineList?.find((line) => line.id === v.head.routeLineId)) {
          delDocList.push(v.id);
        }
      });

      delDocList.push(id);

      const res = await docDispatch(documentActions.removeDocuments(delDocList));
      if (res.type === 'DOCUMENTS/REMOVE_MANY_SUCCESS') {
        dispatch(actions.geoActions.removeMany(geoList));
        navigation.goBack();
      }
    };

    Alert.alert('Вы уверены, что хотите удалить маршрут и его документы?', '', [
      {
        text: 'Да',
        onPress: deleteRoute,
      },
      {
        text: 'Отмена',
      },
    ]);
  }, [dispatch, docDispatch, geoList, id, navigation, orders, routeLineList, visits]);

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

  const renderRight = useCallback(
    () => (
      <View style={styles.buttons}>
        <SearchButton onPress={() => setFilterVisible((prev) => !prev)} visible={filterVisible} />
        <MenuButton actionsMenu={actionsMenu} />
      </View>
    ),
    [actionsMenu, filterVisible],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
      headerRight: renderRight,
    });
  }, [navigation, renderRight]);

  const RC = useMemo(
    () => <RefreshControl refreshing={!filteredList.routeLineList} title="загрузка данных..." />,
    [filteredList.routeLineList],
  );

  const handlePressRouteItem = useCallback(
    (item: IRouteLine) => navigation.navigate('RouteDetails', { routeId: route?.id, id: item.id }),
    [navigation, route?.id],
  );

  const renderItem = useCallback(
    ({ item }: { item: IRouteLine }) => <RouteItem item={item} onPressItem={() => handlePressRouteItem(item)} />,
    [handlePressRouteItem],
  );

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  if (!route) {
    return (
      <View style={styles.container}>
        <SubTitle style={styles.title}>Маршрут не найден</SubTitle>
      </View>
    );
  }

  return (
    <>
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
                autoFocus
                selectionColor={colors.primary}
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
          ItemSeparatorComponent={ItemSeparator}
          refreshControl={RC}
          ListEmptyComponent={EmptyList}
          updateCellsBatchingPeriod={50}
          viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
          initialScrollIndex={routeItemId}
          getItemLayout={(_: any, index: number) => getItemLayout(index, ROUTE_ITEM_HEIGHT)}
        />
      </AppScreen>
      {!!routeLineList.length && (
        <RouteTotal
          onPress={() => setIsGroupVisible(!isGroupVisible)}
          isGroupVisible={isGroupVisible}
          routeId={route.id}
        />
      )}
    </>
  );
};

export default RouteViewScreen;
