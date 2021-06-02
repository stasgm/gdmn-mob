import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { useNavigation, useScrollToTop } from '@react-navigation/native';

import { ItemSeparator, FilterButtons, Status, globalStyles as styles, DrawerButton } from '@lib/mobile-ui';
import { useSelector, docSelectors } from '@lib/store';

import { IRouteDocument } from '../../store/docs/types';

import RouteListItem from './components/RouteListItem';

const RouteListScreen = () => {
  const navigation = useNavigation();

  const { loading } = useSelector((state) => state.documents);
  const list = (docSelectors.selectByDocType('route') as IRouteDocument[]).sort(
    (a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime(),
  );

  const [status, setStatus] = useState<Status>('active');

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

  const ref = useRef<FlatList<IRouteDocument>>(null);
  useScrollToTop(ref);

  const renderItem = ({ item }: { item: IRouteDocument }) => <RouteListItem key={item.id} item={item} />;

  return (
    <View style={styles.container}>
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
    </View>
  );
};

export default RouteListScreen;
