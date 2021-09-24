import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { globalStyles as styles } from '@lib/mobile-ui';

import { getStatusColor } from '../../../utils/constants';
import { OrdersStackParamList } from '../../../navigation/Root/types';
// eslint-disable-next-line import/no-cycle
import { OrderListRenderItemProps } from '../OrderListScreen';

const OrderListItem = ({ id, title, subtitle, status, lineCount, isFromRoute, errorMessage }: OrderListRenderItemProps) => {
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<OrdersStackParamList, 'OrderList'>>();

  // const info = `№ ${item.number} от ${getDateString(item.documentDate)} на ${getDateString(item.head?.onDate)}`;

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('OrderView', { id });
      }}
    >
      <View style={styles.item}>
        <View style={[styles.icon, { backgroundColor: getStatusColor(status || 'DRAFT') }]}>
          <MaterialCommunityIcons name="view-list" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <View style={styles.directionRow}>
            <Text style={styles.name}>{title}</Text>
          </View>
          <View style={styles.directionRow}>
            <Text style={[styles.field, { color: colors.text }]}>{subtitle}</Text>
            <View style={styles.directionRow}>
              <Text style={[styles.field, { color: colors.text }]}>{lineCount}</Text>
              <MaterialCommunityIcons name="shopping-outline" size={15} color={colors.text} style={styles.field} />
              {isFromRoute && (
                <MaterialCommunityIcons name="routes" size={15} color={colors.text} style={styles.field} />
              )}
            </View>
          </View>
          <View>
            {errorMessage && <Text  style={[styles.field, { color: colors.error }]}>Отказано: {errorMessage || ''}</Text>}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OrderListItem;
