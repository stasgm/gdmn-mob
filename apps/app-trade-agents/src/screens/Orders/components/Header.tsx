import React from 'react';
import { Text, View } from 'react-native';

import styles from '@lib/mobile-ui/src/styles/global';
import colors from '@lib/mobile-ui/src/styles/colors';

import MaterialCommunityIcons from '@expo/vector-icons/build/MaterialCommunityIcons';

import { IOrderDocument } from '../../../store/docs/types';

interface IProps {
  item: IOrderDocument;
}

const Header = ({ item }: IProps) => {
  return (
    <View style={[styles.item]}>
      <View style={styles.details}>
        <View style={[styles.directionRow]}>
          <View style={[styles.directionRow]}>
            <Text style={[{ color: colors.text }]}>{item.head.ondate}</Text>
            <MaterialCommunityIcons name="calendar-check-outline" size={15} />
          </View>
        </View>
        <View style={[styles.directionRow]}>
          <Text style={[styles.name, { color: colors.text }]}>{item.head.outlet.name}</Text>
        </View>
      </View>
    </View>
  );
};

export default Header;
