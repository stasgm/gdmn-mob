import React from 'react';
import { Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/build/MaterialCommunityIcons';

import { globalStyles as styles } from '@lib/mobile-ui';

import { getDateString } from '@lib/mobile-hooks';

import { IApplDocument } from '../../../store/types';

interface IProps {
  item: IApplDocument;
}

const Header = ({ item }: IProps) => {
  return (
    <View style={[styles.item]}>
      <View style={[styles.icon]}>
        <MaterialCommunityIcons name="view-list" size={20} color={'#FFF'} />
      </View>
      <View style={styles.details}>
        <View style={[styles.rowCenter]}>
          <View style={[styles.rowCenter]}>
            <Text style={styles.field}>{getDateString(item.head.verificationDate || new Date())}</Text>
            <MaterialCommunityIcons name="calendar-check-outline" size={15} />
          </View>
        </View>
        <View style={styles.rowCenter}>
          <Text style={styles.name}>{item.head.dept.name}</Text>
        </View>
      </View>
    </View>
  );
};

export default Header;
