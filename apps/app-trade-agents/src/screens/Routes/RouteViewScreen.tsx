import { ItemSeparator, SubTitle } from '@lib/mobile-ui/src/components';
import { docSelectors } from '@lib/store';
import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { View, FlatList } from 'react-native';
import { Divider } from 'react-native-paper';

import styles from '@lib/mobile-ui/src/styles/global';

import { RoutesStackParamList } from '../../navigation/Root/types';
import { IRouteDocument, IRouteLine } from '../../store/docs/types';

import RouteItem from './components/RouteItem';

const RouteViewScreen = () => {
  const id = useRoute<RouteProp<RoutesStackParamList, 'RouteView'>>().params.id;
  console.log(id);
  const list = (docSelectors.selectByDocType('route') as IRouteDocument[])?.find((e) => e.id === id);

  if (!list) {
    return (
      <View style={styles.container}>
        <SubTitle style={styles.title}>Маршрут не найден</SubTitle>
      </View>
    );
  }

  /*     const ref = React.useRef<FlatList<IRouteLine>>(null);
    useScrollToTop(ref); */

  const renderItem = ({ item }: { item: IRouteLine }) => <RouteItem item={item} />;

  return (
    <View style={[styles.container]}>
      <SubTitle style={styles.title}>{list.documentDate}</SubTitle>
      <Divider />
      <FlatList
        // ref={ref}
        data={list.lines}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        scrollEventThrottle={400}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};

export default RouteViewScreen;
