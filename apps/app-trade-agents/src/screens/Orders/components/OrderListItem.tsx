import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { globalStyles as styles } from '@lib/mobile-ui';

import { IOrderDocument } from '../../../store/docs/types';
import { getStatusColor } from '../../../utils/constants';
import { getDateString } from '../../../utils/helpers';

const OrderListItem = ({ item }: { item: IOrderDocument }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('OrderView', { id: item.id });
      }}
    >
      <View style={[styles.item, { backgroundColor: colors.background }]}>
        <View style={[styles.icon, { backgroundColor: getStatusColor(item?.status || 'DRAFT') }]}>
          <MaterialCommunityIcons name="view-list" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <View style={[styles.directionRow]}>
            <View>
              <Text style={[styles.name, { color: colors.text }]}>
                № {item.number} от {getDateString(item.documentDate)}
              </Text>
            </View>
            <View style={[styles.directionRow]}>
              <Text style={[styles.field, { color: colors.text }]}>{getDateString(item.head.ondate)}</Text>
              <MaterialCommunityIcons name="calendar-check-outline" size={15} />
            </View>
          </View>
          <View style={styles.directionRow}>
            <Text style={[styles.field, localStyles.line]}>{item.head.outlet.name}</Text>
            <View style={[styles.directionRow]}>
              <Text style={styles.field}>{item.lines.length}</Text>
              <MaterialCommunityIcons name="shopping-outline" size={15} />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OrderListItem;

const localStyles = StyleSheet.create({
  line: {
    maxWidth: '90%',
  },
});
