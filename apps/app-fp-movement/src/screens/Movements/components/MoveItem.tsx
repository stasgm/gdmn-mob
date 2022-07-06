import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { globalStyles as styles } from '@lib/mobile-ui';

import { getDateString } from '@lib/mobile-app';

import { IMoveLine } from '../../../store/types';

interface IProps {
  item: IMoveLine;
}

export const MoveItem = ({ item }: IProps) => {
  const { colors } = useTheme();

  const textStyle = useMemo(() => [styles.field, { color: colors.text }], [colors.text]);

  return (
    <View style={[styles.item]}>
      <View style={[styles.icon]}>
        <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
      </View>
      <View style={styles.details}>
        <Text style={styles.name}>{item.good.name}</Text>
        <View style={[styles.directionRow]}>
          <Text style={textStyle}>Вес: {(item.weight || 0).toString()} кг</Text>
        </View>
        <Text style={textStyle}>Номер партии: {item.numReceived || ''}</Text>

        <Text style={textStyle}>
          Дата изготовления: {getDateString(item.workDate) || ''} {new Date(item.workDate).toLocaleTimeString() || ''}
        </Text>
      </View>
    </View>
  );
};
