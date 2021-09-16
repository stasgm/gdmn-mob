import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { RouteProp, useRoute, useScrollToTop } from '@react-navigation/native';
import { View, FlatList, Text } from 'react-native';
import { Divider } from 'react-native-paper';
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

import { getDateString } from '../../utils/helpers';

import { RoutesStackParamList } from '../../navigation/Root/types';
import { IOrderDocument, IReturnDocument, IRouteDocument, IRouteLine, IVisitDocument } from '../../store/types';
import actions from '../../store/geo';

import { useDispatch, useSelector } from '../../store';

import RouteItem from './components/RouteItem';

const RouteViewScreen = () => {
  const navigation = useNavigation();
  const showActionSheet = useActionSheet();
  const docDispatch = useDocThunkDispatch();
  const dispatch = useDispatch();

  const id = useRoute<RouteProp<RoutesStackParamList, 'RouteView'>>().params.id;
  const route = docSelectors.selectByDocType<IRouteDocument>('route')?.find((e) => e.id === id);

  const ref = useRef<FlatList<IRouteLine>>(null);
  useScrollToTop(ref);

  const routeLineList = docSelectors.selectByDocType<IRouteDocument>('route')?.find((e) => e.id === id)?.lines;

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
      const gg = dispatch(actions.geoActions.removeMany(geoList, id));
      if (res.type === 'DOCUMENTS/REMOVE_MANY_SUCCESS') {
        navigation.goBack();
      }
    };
    deleteRoute();
    console.log('list', list);
    //dispatch(documentActions.removeDocument(id));
  }, [docDispatch, id, navigation, orderList, returnList, visitList]);

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Удалить',
        type: 'destructive',
        onPress: handleDelete,
      },
      {
        title: 'Отмена',
        type: 'cancel',
      },
    ]);
  }, [handleDelete, showActionSheet]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
      headerRight: () => <MenuButton actionsMenu={actionsMenu} />,
    });
  }, [actionsMenu, navigation]);

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
      <FlatList
        ref={ref}
        data={route.lines.sort((a, b) => a.ordNumber - b.ordNumber)}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        scrollEventThrottle={400}
        ItemSeparatorComponent={ItemSeparator}
      />
      <Text> лалала </Text>
    </AppScreen>
  );
};

export default RouteViewScreen;
