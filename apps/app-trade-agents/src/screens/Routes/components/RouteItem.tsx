import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, View, Text } from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';

import styles from '@lib/mobile-ui/src/styles/global';

import { IReference } from '@lib/types';

import { refSelectors } from '@lib/store';

import { IOutlet, IRouteLine } from '../../../store/docs/types';
import { RoutesStackParamList } from '../../../navigation/Root/types';

type RouteLineProp = StackNavigationProp<RoutesStackParamList, 'RouteView'>;

export interface IItem {
  routeId: string;
  item: IRouteLine;
}

const RouteItem = ({ item, routeId }: IItem) => {
  const navigation = useNavigation<RouteLineProp>();

  //TODO получить адрес item.outlet.id
  const outlet = (refSelectors.selectByName('outlet') as IReference<IOutlet>)?.data?.find(
    (e) => e.id === item.outlet.id,
  );
  const address = outlet ? outlet.address : '';

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('RouteDetails', { routeId, id: item.id });
      }}
    >
      <View style={styles.item}>
        <View style={styles.icon}>
          <Text style={styles.lightField}>{item.ordNumber}</Text>
        </View>
        <View style={styles.details}>
          <View style={styles.directionRow}>
            <Text style={styles.name}>{item.outlet.name}</Text>
          </View>
          <View style={styles.directionRow}>
            <Text style={styles.field}>{address}</Text>
            <View style={styles.directionRow}>
              <Text style={styles.field}>{item.result}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RouteItem;
