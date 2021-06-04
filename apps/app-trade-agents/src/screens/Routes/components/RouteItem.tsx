import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, View, Text } from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';

import styles from '@lib/mobile-ui/src/styles/global';

import { IReference } from '@lib/types';

import { refSelectors } from '@lib/store';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { IOutlet, IRouteLine, IVisit } from '../../../store/docs/types';
import { RoutesStackParamList } from '../../../navigation/Root/types';
import { useSelector } from '../../../store';
import { getDateString } from '../../../utils/helpers';

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

  const iconsStatus = ['circle-outline', 'arrow-right-drop-circle-outline', 'check-circle-outline'];
  const visits = (useSelector((state) => state.visits)?.list as IVisit[]).filter(
    (visit) => visit.routeLineId.toString() === item.id,
  );
  const lastVisit = visits
    .filter((visit) => visit.dateEnd)
    .sort((a, b) => (a.dateEnd === b.dateEnd || !a.dateEnd || !b.dateEnd ? 0 : a.dateEnd > b.dateEnd ? 1 : -1));
  const status = visits.length === 0 ? 0 : visits.find((visit) => visit.dateEnd) ? 2 : 1;

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
        <View style={{ alignItems: 'flex-end' }}>
          <MaterialCommunityIcons name={iconsStatus[status]} size={24} color="#888" />
          <Text style={styles.field}>
            {status === 2 && lastVisit[0].dateEnd && getDateString(lastVisit[0].dateEnd)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RouteItem;
