import React from 'react';
import { Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/build/MaterialCommunityIcons';

import { globalStyles as styles } from '@lib/mobile-ui';

import { IReturnDocument } from '../../../store/types';
import { getDateString } from '../../../utils/helpers';

interface IProps {
  item: IReturnDocument;
}

const Header = ({ item }: IProps) => {
  return (
    <View style={[styles.item]}>
      <View style={[styles.icon]}>
        <MaterialCommunityIcons name="view-list" size={20} color={'#FFF'} />
      </View>
      <View style={styles.details}>
        <View style={[styles.directionRow]}>
          <View style={[styles.directionRow]}>
            <Text style={styles.field}>{getDateString(item.documentDate)}</Text>
            <MaterialCommunityIcons name="calendar-check-outline" size={15} />
          </View>
        </View>
        <View style={styles.directionRow}>
          <Text style={styles.name}>{item.head.outlet.name}</Text>
        </View>
      </View>
    </View>
  );
};

export default Header;
