import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { globalStyles as styles } from '@lib/mobile-ui';

import { IBarcode } from '../store/types';

interface IProps {
  item: IBarcode;
}

export const MovementItem = ({ item }: IProps) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.item]}>
      <View style={[styles.icon]}>
        <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
      </View>
      <View style={styles.details}>
        <Text style={[styles.name, { color: colors.text }]}>{item.barcode}</Text>
      </View>
    </View>
  );
};
