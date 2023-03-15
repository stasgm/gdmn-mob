import React, { useLayoutEffect, useMemo, useState } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';

import {
  ItemSeparator,
  FilterButtons,
  Status,
  AppScreen,
  EmptyList,
  AppActivityIndicator,
  navBackDrawer,
} from '@lib/mobile-ui';

import { keyExtractor, useFilteredDocList } from '@lib/mobile-hooks';

import { StackNavigationProp } from '@react-navigation/stack';

import { FlashList } from '@shopify/flash-list';

import { IRouteDocument } from '../../store/types';

import { RoutesStackParamList } from '../../navigation/Root/types';

import RouteListItem from './components/RouteListItem';

const RouteListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RoutesStackParamList, 'RouteList'>>();
  const [status, setStatus] = useState<Status>('active');

  const list = useFilteredDocList<IRouteDocument>('route').sort((a, b) =>
    status === 'active'
      ? new Date(a.documentDate).getTime() - new Date(b.documentDate).getTime()
      : new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime(),
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

  const renderItem = ({ item }: { item: IRouteDocument }) => (
    <RouteListItem key={item.id} item={item} onPress={() => navigation.navigate('RouteView', { id: item.id })} />
  );

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  return (
    <AppScreen>
      <FilterButtons status={status} onPress={setStatus} />
      <FlashList
        data={filteredList}
        renderItem={renderItem}
        estimatedItemSize={60}
        ItemSeparatorComponent={ItemSeparator}
        keyExtractor={keyExtractor}
        keyboardShouldPersistTaps={'handled'}
        ListEmptyComponent={EmptyList}
      />
    </AppScreen>
  );
};

export default RouteListScreen;
