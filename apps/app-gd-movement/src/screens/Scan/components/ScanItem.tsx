import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { globalStyles as styles } from '@lib/mobile-ui';

import { IScanLine } from '../../../store/types';

interface IProps {
  docId: string;
  item: IScanLine;
  readonly?: boolean;
  index: number;
}

export const ScanItem = ({ item, index }: IProps) => {
  return (
    <View style={[styles.item]}>
      <View style={[styles.icon]}>
        <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
      </View>
      <View style={styles.details}>
        <Text style={styles.name}>Сканирование {(index + 1)?.toString()}</Text>
        <Text style={styles.field}>{item.barcode}</Text>
      </View>
    </View>
  );
};
