import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';

import { RouteProp, useRoute, useTheme, useNavigation } from '@react-navigation/native';
import { View, Alert } from 'react-native';
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
} from '@lib/mobile-ui';
import { documentActions, docSelectors, useDocThunkDispatch } from '@lib/store';

import { getDateString, keyExtractor, useFilteredDocList } from '@lib/mobile-hooks';

import { StackNavigationProp } from '@react-navigation/stack';

import { FlashList } from '@shopify/flash-list';

import { RoutesStackParamList } from '../../navigation/Root/types';
import { IOrderDocument, IRouteDocument, IRouteLine, IVisitDocument } from '../../store/types';
import actions from '../../store/geo';

import { useDispatch, useSelector as useAppSelector } from '../../store';

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
  const [isGroupVisible, setIsGroupVisible] = useState(false);

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

  const orders = useFilteredDocList<IOrderDocument>('order');
  const visits = useFilteredDocList<IVisitDocument>('visit');

  const geoList = useAppSelector((state) => state.geo?.list)?.filter((g) => g.routeId === id);

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

  // const RC = useMemo(
  //   () => <RefreshControl refreshing={!filteredList.routeLineList} title="загрузка данных..." />,
  //   [filteredList.routeLineList],
  // );

  const handlePressRouteItem = useCallback(
    (item: IRouteLine) => {
      if (route) {
        navigation.navigate('Visit', { routeId: route.id, id: item.id });
      }
    },

    [navigation, route],
  );

  const renderItem = useCallback(
    ({ item }: { item: IRouteLine }) => <RouteItem item={item} onPressItem={() => handlePressRouteItem(item)} />,
    [handlePressRouteItem],
  );

  const RouteView = useMemo(() => {
    if (!route) {
      return (
        <View style={styles.container}>
          <SubTitle style={styles.title}>Маршрут не найден</SubTitle>
        </View>
      );
    }

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
                autoFocus
                selectionColor={colors.primary}
              />
            </View>
            <ItemSeparator />
          </>
        )}
        {/* <FlatList
          data={filteredList.routeLineList}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={ItemSeparator}
          refreshControl={RC}
          ListEmptyComponent={EmptyList}
          keyboardShouldPersistTaps={'handled'}
          maxToRenderPerBatch={50}
          windowSize={60}
          updateCellsBatchingPeriod={50}
          initialNumToRender={50}
        /> */}

        <FlashList
          data={filteredList.routeLineList}
          renderItem={renderItem}
          estimatedItemSize={60}
          ItemSeparatorComponent={ItemSeparator}
          keyExtractor={keyExtractor}
          extraData={[routeLineList, searchQuery]}
          keyboardShouldPersistTaps={'handled'}
          ListEmptyComponent={EmptyList}
        />
        {!!routeLineList?.length && !filterVisible && route?.id && (
          <RouteTotal
            onPress={() => setIsGroupVisible(!isGroupVisible)}
            isGroupVisible={isGroupVisible}
            routeId={route.id}
          />
        )}
      </AppScreen>
    );
  }, [
    colors.primary,
    filterVisible,
    filteredList.routeLineList,
    isGroupVisible,
    renderItem,
    route,
    routeLineList,
    searchQuery,
  ]);

  // const isFocused = useIsFocused();
  // if (!isFocused) {
  //   return <AppActivityIndicator />;
  // }

  return <>{RouteView}</>;
};

export default RouteViewScreen;
