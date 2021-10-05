import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { FlatList, RefreshControl, Text } from 'react-native';
import { useNavigation, useScrollToTop } from '@react-navigation/native';

import { ItemSeparator, FilterButtons, Status, globalStyles as styles, DrawerButton, AppScreen } from '@lib/mobile-ui';
import { useSelector, docSelectors } from '@lib/store';

import { IRouteDocument } from '../../store/types';

import RouteListItem from './components/RouteListItem';

const RouteListScreen = () => {
  const navigation = useNavigation();
  const [status, setStatus] = useState<Status>('active');

  const { loading } = useSelector((state) => state.documents);

  const list = docSelectors
    .selectByDocType<IRouteDocument>('route')
    .sort((a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime());

  const ref = useRef<FlatList<IRouteDocument>>(null);
  useScrollToTop(ref);

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
      headerLeft: () => <DrawerButton />,
    });
  }, [navigation]);

  const renderItem = ({ item }: { item: IRouteDocument }) => <RouteListItem key={item.id} item={item} />;

  return (
    <AppScreen>
      <FilterButtons status={status} onPress={setStatus} />
      <FlatList
        ref={ref}
        data={filteredList}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        scrollEventThrottle={400}
        refreshControl={<RefreshControl refreshing={loading} title="загрузка данных..." />}
        ListEmptyComponent={!loading ? <Text style={styles.emptyList}>Список пуст</Text> : null}
      />
    </AppScreen>
  );
};

export default RouteListScreen;
