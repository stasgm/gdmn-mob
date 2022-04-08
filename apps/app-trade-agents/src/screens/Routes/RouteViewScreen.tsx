import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { RouteProp, useRoute, useScrollToTop, useTheme } from '@react-navigation/native';
import { View, FlatList, Alert } from 'react-native';
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

import { RoutesStackParamList } from '../../navigation/Root/types';
import { IOrderDocument, IReturnDocument, IRouteDocument, IRouteLine, IVisitDocument } from '../../store/types';
import actions from '../../store/geo';

import { useDispatch, useSelector } from '../../store';

import RouteItem from './components/RouteItem';
import RouteTotal from './components/RouteTotal';

const RouteViewScreen = () => {
  const navigation = useNavigation();
  const showActionSheet = useActionSheet();
  const docDispatch = useDocThunkDispatch();
  const dispatch = useDispatch();

  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  const id = useRoute<RouteProp<RoutesStackParamList, 'RouteView'>>().params.id;
  const route = docSelectors.selectByDocType<IRouteDocument>('route')?.find((e) => e.id === id);
  const routeLineList = route?.lines
    .filter((i) => (i.outlet.name ? i?.outlet.name.toUpperCase().includes(searchQuery.toUpperCase()) : true))
    .sort((a, b) => a.ordNumber - b.ordNumber);

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

  const geoList = useSelector((state) => state.geo)?.list?.filter((g) => g.routeId === id);

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
        data={routeLineList}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        scrollEventThrottle={400}
        ItemSeparatorComponent={ItemSeparator}
      />
      <RouteTotal routeId={id} />
    </AppScreen>
  );
};

export default RouteViewScreen;
