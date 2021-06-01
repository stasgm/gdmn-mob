import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';

import { StackNavigationProp } from '@react-navigation/stack';

import styles from '@lib/mobile-ui/src/styles/global';

import { IReference } from '@lib/types';

import { refSelectors } from '@lib/store';

import { IOutlet, IRouteLine } from '../../../store/docs/types';
import { RoutesStackParamList } from '../../../navigation/Root/types';

type RouteLineProp = StackNavigationProp<RoutesStackParamList, 'RouteView'>;

const RouteItem = ({ item }: { item: IRouteLine }) => {
  const { colors } = useTheme();
  const navigation = useNavigation<RouteLineProp>();

  // Получить адрес item.outlet.id
  const outlet = (refSelectors.selectByName('outlet') as IReference<IOutlet>)?.data?.find(
    (e) => e.id === item.outlet.id,
  );
  const address = outlet ? outlet.address : '';

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('RouteView', { id: item.id });
      }}
    >
      <View style={styles.item}>
        <View style={styles.icon}>
          <Text style={[styles.name, { color: colors.background }]}>{item.ordNumber}</Text>
        </View>
        <View style={styles.details}>
          <View style={[styles.directionRow]}>
            <Text style={[styles.name, { color: colors.text }]}>{item.outlet.name}</Text>
          </View>
          <View style={styles.directionRow}>
            <Text style={[styles.field, { color: colors.text }]}>{address}</Text>
            <View style={[styles.directionRow]}>
              <Text style={[styles.field, { color: colors.text }]}>{item.result}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RouteItem;
