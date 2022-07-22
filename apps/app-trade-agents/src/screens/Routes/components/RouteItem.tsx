import React, { useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, TouchableHighlight } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { globalStyles as styles, LargeText, MediumText } from '@lib/mobile-ui';
import { refSelectors } from '@lib/store';

import { getDateString, useFilteredDocList } from '@lib/mobile-app';

import { IOutlet, IRouteLine, IVisitDocument } from '../../../store/types';
import { RoutesStackParamList } from '../../../navigation/Root/types';

export interface IItem {
  routeId: string;
  item: IRouteLine;
}

type Icon = keyof typeof MaterialCommunityIcons.glyphMap;
const iconsStatus: Icon[] = ['circle-outline', 'arrow-right-drop-circle-outline', 'check-circle-outline'];

const RouteItem = ({ item, routeId }: IItem) => {
  const navigation = useNavigation<StackNavigationProp<RoutesStackParamList, 'RouteView'>>();

  const address = refSelectors.selectByRefId<IOutlet>('outlet', item.outlet.id)?.address;

  const visit = useFilteredDocList<IVisitDocument>('visit').find((doc) => doc.head?.routeLineId === item.id);

  const status = !visit ? 0 : visit.head.dateEnd ? 2 : 1;

  const dateEnd = useMemo(
    () => status === 2 && visit?.head.dateEnd && getDateString(visit.head.dateEnd),
    [status, visit?.head.dateEnd],
  );

  const handlePressRouteItem = useCallback(() => {
    navigation.navigate('RouteDetails', { routeId, id: item.id });
  }, [item.id, navigation, routeId]);

  return (
    <TouchableHighlight activeOpacity={0.7} underlayColor="#DDDDDD" onPress={handlePressRouteItem}>
      <View style={styles.item}>
        <View style={styles.icon}>
          <MediumText style={styles.lightText}>{item.ordNumber}</MediumText>
        </View>
        <View style={styles.details}>
          <View style={styles.directionRow}>
            <LargeText style={styles.textBold}>{item.outlet.name}</LargeText>
          </View>
          {address ? (
            <View style={styles.directionRow}>
              <MediumText>{address}</MediumText>
            </View>
          ) : null}
        </View>

        <View style={styles.bottomButtons}>
          {status ? <MaterialCommunityIcons name={iconsStatus[status]} size={24} color="#888" /> : null}
          {dateEnd ? <MediumText>{dateEnd}</MediumText> : null}
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default RouteItem;
