import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableHighlight } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { globalStyles as styles } from '@lib/mobile-ui';
import { IReference } from '@lib/types';
import { docSelectors, refSelectors } from '@lib/store';

import { IOutlet, IRouteLine, IVisitDocument } from '../../../store/types';
import { RoutesStackParamList } from '../../../navigation/Root/types';
import { getDateString } from '../../../utils/helpers';

type RouteLineProp = StackNavigationProp<RoutesStackParamList, 'RouteView'>;

export interface IItem {
  routeId: string;
  item: IRouteLine;
}

type Icon = keyof typeof MaterialCommunityIcons.glyphMap;

const RouteItem = ({ item, routeId }: IItem) => {
  const navigation = useNavigation<RouteLineProp>();

  //TODO получить адрес item.outlet.id
  const outlet = (refSelectors.selectByName('outlet') as IReference<IOutlet>)?.data?.find(
    (e) => e.id === item.outlet.id,
  );

  const address = outlet ? outlet.address : '';

  const iconsStatus: Icon[] = ['circle-outline', 'arrow-right-drop-circle-outline', 'check-circle-outline'];
  // const visits = (useSelector((state) => state.visits)?.list as IVisitDocument[]).filter(
  //   (visit) => visit.head.routeLineId === item.id,
  // );
  const visits = (docSelectors.selectByDocType('visit') as IVisitDocument[])?.filter(
    (e) => e.head.routeLineId === item.id,
  );

  const lastVisit = visits
    .filter((visit) => visit.head.dateEnd)
    .sort((a, b) =>
      a.head.dateEnd === b.head.dateEnd || !a.head.dateEnd || !b.head.dateEnd
        ? 0
        : a.head.dateEnd > b.head.dateEnd
        ? 1
        : -1,
    );

  const status = visits.length === 0 ? 0 : visits.find((visit) => visit.head.dateEnd) ? 2 : 1;

  return (
    <TouchableHighlight
      activeOpacity={0.7}
      underlayColor="#DDDDDD"
      onPress={() => {
        navigation.navigate('RouteDetails', { routeId, id: item.id });
      }}
    >
      <View style={styles.item}>
        <View style={styles.icon}>
          <Text style={styles.lightText}>{item.ordNumber}</Text>
        </View>
        <View style={styles.details}>
          <View style={styles.directionRow}>
            <Text style={styles.name}>{item.outlet.name}</Text>
          </View>
          <View style={styles.directionRow}>
            <Text style={styles.field}>{address}</Text>
            <View style={styles.directionRow}>
              <Text style={styles.field}>{item.comment}</Text>
            </View>
          </View>
        </View>
        <View style={styles.bottomButtons}>
          {status ? <MaterialCommunityIcons name={iconsStatus[status]} size={24} color="#888" /> : null}
          <Text style={styles.field}>
            {status === 2 && lastVisit[0].head.dateEnd && getDateString(lastVisit[0].head.dateEnd)}
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default RouteItem;
