import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { globalStyles as styles } from '@lib/mobile-ui';

import { IOrderDocument } from '../../../store/docs/types';
import { getStatusColor } from '../../../utils/constants';
import { getDateString } from '../../../utils/helpers';
import { OrdersStackParamList } from '../../../navigation/Root/types';

const OrderListItem = ({ item }: { item: IOrderDocument }) => {
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<OrdersStackParamList, 'OrderList'>>();

  const info = `№ ${item.number} от ${getDateString(item.documentDate)} на ${getDateString(item.head?.onDate)}`;

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('OrderView', { id: item.id });
      }}
    >
      <View style={styles.item}>
        <View style={[styles.icon, { backgroundColor: getStatusColor(item?.status || 'DRAFT') }]}>
          <MaterialCommunityIcons name="view-list" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <View style={styles.directionRow}>
            <Text style={styles.name}>{item.head.outlet.name}</Text>
          </View>
          <View style={styles.directionRow}>
            <Text style={[styles.field, { color: colors.text }]}>{info}</Text>
            <View style={styles.directionRow}>
              <Text style={[styles.field, { color: colors.text }]}>{item.lines.length}</Text>
              <MaterialCommunityIcons name="shopping-outline" size={15} />
              {item.head.route ? <MaterialCommunityIcons name="routes" size={15} /> : null}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OrderListItem;
