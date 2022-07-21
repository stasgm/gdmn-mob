import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles as styles } from '@lib/mobile-ui';

import { getDateString } from '@lib/mobile-app';

import { ISellbillLine, ITempLine } from '../../../store/types';

interface IProps {
  docId: string;
  item: ISellbillLine | ITempLine;
  readonly?: boolean;
}

const SellbillItem = ({ item }: IProps) => {
  const { colors } = useTheme();

  // const good = refSelectors.selectByName<IGood>('good')?.data?.find((e) => e.id === item?.good.id);

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

        <Text style={textStyle}>Дата: {getDateString(item.workDate) || ''}</Text>
      </View>
    </View>
  );
};

export default SellbillItem;
