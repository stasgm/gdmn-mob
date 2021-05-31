import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';

// import { styles } from '../styles';

import styles from '@lib/mobile-ui/src/styles/global';

import { IRouteDocument } from '../../../store/docs/types';
import { getStatusColor } from '../../../utils/constants';

const RouteListItem = ({ item }: { item: IRouteDocument }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        console.log(item.id);
        navigation.navigate('RouteView', { id: item.id });
      }}
    >
      <View style={[styles.item, { backgroundColor: colors.background }]}>
        <View style={[styles.icon, { backgroundColor: getStatusColor(item?.status || 'DRAFT') }]}>
          <MaterialCommunityIcons name="routes" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <View style={[styles.directionRow]}>
            <Text style={[styles.name, { color: colors.text }]}>{item.documentDate}</Text>
          </View>
          <View style={styles.directionRow}>
            <Text style={[styles.field, { color: colors.text }]}>{item.head.agent.name}</Text>
            <View style={[styles.directionRow]}>
              <Text style={[styles.field, { color: colors.text }]}>{item.lines.length}</Text>
              <MaterialCommunityIcons name="shopping-outline" size={15} />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RouteListItem;
