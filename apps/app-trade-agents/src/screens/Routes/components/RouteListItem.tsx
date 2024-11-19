import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { globalStyles as styles, MediumText } from '@lib/mobile-ui';

import { getDateString } from '@lib/mobile-hooks';

import { MD2Theme, useTheme } from 'react-native-paper';

import { IRouteDocument } from '../../../store/types';
import { getStatusColor } from '../../../utils/constants';

const RouteListItem = ({ item, onPress }: { item: IRouteDocument; onPress: () => void }) => {
  const todayStr = getDateString(item.documentDate) === getDateString(new Date()) ? ' (сегодня)' : '';
  const { colors } = useTheme<MD2Theme>();

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.item}>
        <View style={[styles.icon, { backgroundColor: getStatusColor(item?.status || 'DRAFT') }]}>
          <MaterialCommunityIcons name="routes" size={15} color="#FFF" />
        </View>
        <View style={styles.details}>
          <View style={styles.directionRow}>
            <Text
              style={[{ color: colors.text }, styles.name]}
            >{`${getDateString(item.documentDate)}${todayStr}`}</Text>
            <View style={styles.directionRow}>
              <Text style={styles.field}>{item.lines.length}</Text>
              <MaterialCommunityIcons name="shopping-outline" size={18} color={colors.onSurface} />
            </View>
          </View>
          <View style={styles.directionRow}>
            <MediumText>{item.head.agent.name}</MediumText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RouteListItem;
