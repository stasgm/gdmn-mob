import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { globalStyles as styles, LargeText, MediumText } from '@lib/mobile-ui';

import { getDateString } from '@lib/mobile-app';

import { IFreeSellbillLine } from '../../../types';

interface IProps {
  item: IFreeSellbillLine;
}

export const FreeSellbillItem = ({ item }: IProps) => {
  return (
    <View style={styles.item}>
      <View style={styles.icon}>
        <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
      </View>
      <View style={styles.details}>
        <LargeText style={styles.textBold}>{item.good.name}</LargeText>
        <View style={styles.directionRow}>
          <MediumText>Вес: {(item.weight || 0).toString()} кг</MediumText>
        </View>
        <MediumText>Номер партии: {item.numReceived || ''}</MediumText>

        <MediumText>Дата изготовления: {getDateString(item.workDate) || ''}</MediumText>
      </View>
    </View>
  );
};
