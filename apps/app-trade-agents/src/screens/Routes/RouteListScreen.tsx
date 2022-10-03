import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useFocusEffect, useIsFocused, useNavigation, useScrollToTop } from '@react-navigation/native';

import {
  ItemSeparator,
  FilterButtons,
  Status,
  AppScreen,
  EmptyList,
  AppActivityIndicator,
  navBackDrawer,
} from '@lib/mobile-ui';

import { keyExtractor, useFilteredDocList } from '@lib/mobile-app';

import { StackNavigationProp } from '@react-navigation/stack';

import { appActions, useDispatch, useSelector } from '@lib/store';

import { FlatList } from 'react-native';

import { IRouteDocument, IRouteFormParam } from '../../store/types';

import { RoutesStackParamList } from '../../navigation/Root/types';

import RouteListItem from './components/RouteListItem';

const RouteListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RoutesStackParamList, 'RouteList'>>();
  const [status, setStatus] = useState<Status>('active');
  const dispatch = useDispatch();

  const list = useFilteredDocList<IRouteDocument>('route').sort((a, b) =>
    status === 'active'
      ? new Date(a.documentDate).getTime() - new Date(b.documentDate).getTime()
      : new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime(),
  );

  const ref = useRef<FlatList<IRouteDocument>>(null);
  useScrollToTop(ref);

  const routeItemId = useSelector((state) => state.app.formParams as IRouteFormParam)?.routeItemId;

  //Очищаем первый элемент списка точек маршрута
  useFocusEffect(
    React.useCallback(() => {
      if (routeItemId && routeItemId > 0) {
        dispatch(
          appActions.setFormParams({
            routeItemId: 0,
          }),
        );
      }
    }, [dispatch, routeItemId]),
  );

  const filteredList = useMemo(() => {
    if (status === 'all') {
      return list;
    } else if (status === 'active') {
      return list.filter((e) => new Date(e.documentDate).getTime() > new Date().setDate(new Date().getDate() - 1));
    } else if (status === 'archive') {
      return list.filter((e) => new Date(e.documentDate).getTime() <= new Date().setDate(new Date().getDate() - 1));
    }
    return [];
  }, [status, list]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackDrawer,
    });
  }, [navigation]);

  const handlePress = (itemId: string) => navigation.navigate('RouteView', { id: itemId });

  const renderItem = ({ item }: { item: IRouteDocument }) => (
    <RouteListItem key={item.id} item={item} onPress={() => handlePress(item.id)} />
  );

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  return (
    <AppScreen>
      <FilterButtons status={status} onPress={setStatus} />
      <FlatList
        ref={ref}
        data={filteredList}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        scrollEventThrottle={400}
        ListEmptyComponent={EmptyList}
        maxToRenderPerBatch={20}
      />
    </AppScreen>
  );
};

export default RouteListScreen;
