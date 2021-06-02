import { SubTitle } from '@lib/mobile-ui/src/components';
import { docSelectors } from '@lib/store';
import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { Text, View } from 'react-native';
import { Divider } from 'react-native-paper';

import { globalStyles as styles } from '@lib/mobile-ui';

import { RoutesStackParamList } from '../../navigation/Root/types';
import { IRouteDocument } from '../../store/docs/types';

const RouteDetailScreen = () => {
  const { routeId, id } = useRoute<RouteProp<RoutesStackParamList, 'RouteDetails'>>().params;

  const point = (docSelectors.selectByDocType('route') as IRouteDocument[])
    ?.find((e) => e.id === routeId)
    ?.lines.find((i) => i.id === id);

  if (!point) {
    return (
      <View style={styles.content}>
        <SubTitle style={styles.title}>Визит не найден</SubTitle>
      </View>
    );
  }

  return (
    <View>
      <SubTitle style={styles.title}>Визит</SubTitle>
      <Divider />
      <View style={styles.item}>
        <View style={styles.details}>
          <Text style={styles.name}>{point.outlet.name}</Text>
          <Text style={[styles.number, styles.field]}>{point.ordNumber}</Text>
        </View>
      </View>
    </View>
  );
};

export default RouteDetailScreen;
