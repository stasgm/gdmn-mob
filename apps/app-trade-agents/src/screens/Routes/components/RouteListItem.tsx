import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableHighlight } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';

import { globalStyles as styles } from '@lib/mobile-ui';

import { getDateString } from '@lib/mobile-app';

import { IRouteDocument } from '../../../store/types';
import { getStatusColor } from '../../../utils/constants';
import { RoutesStackParamList } from '../../../navigation/Root/types';

const RouteListItem = ({ item }: { item: IRouteDocument }) => {
  const navigation = useNavigation<StackNavigationProp<RoutesStackParamList, 'RouteList'>>();

  const todayStr = new Date(item.documentDate).getDate() === new Date().getDate() ? ' (сегодня)' : '';

  return (
    <TouchableHighlight
      activeOpacity={0.7}
      underlayColor="#DDDDDD"
      onPress={() => {
        navigation.navigate('RouteView', { id: item.id });
      }}
    >
      <View style={styles.item}>
        <View style={[styles.icon, { backgroundColor: getStatusColor(item?.status || 'DRAFT') }]}>
          <MaterialCommunityIcons name="routes" size={15} color="#FFF" />
        </View>
        <View style={styles.details}>
          <View style={styles.directionRow}>
            <Text style={styles.name}>{`${getDateString(item.documentDate)}${todayStr}`}</Text>
            <View style={styles.directionRow}>
              <Text style={styles.field}>{item.lines.length}</Text>
              <MaterialCommunityIcons name="shopping-outline" size={15} />
            </View>
          </View>
          <View style={styles.directionRow}>
            <Text style={styles.field}>{item.head.agent.name}</Text>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default RouteListItem;
