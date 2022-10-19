import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles as styles, MediumText } from '@lib/mobile-ui';

import { formatValue } from '@lib/mobile-hooks';

import { useTheme } from 'react-native-paper';

import { IDebt } from '../../../store/types';

export interface IDebtItem {
  item: IDebt;
}

const DebetItem = ({ item }: IDebtItem) => {
  const { colors } = useTheme();
  const debtTextStyle = { color: item.saldoDebt && item.saldoDebt > 0 ? colors.error : colors.text };

  return (
    <View style={styles.item}>
      <View style={styles.icon}>
        <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
      </View>
      <View style={styles.details}>
        <View style={styles.directionRow}>
          <Text style={styles.name}>{item.name}</Text>
        </View>
        <MediumText>
          {item.saldo < 0
            ? `Предоплата: ${formatValue({ type: 'currency', decimals: 2 }, Math.abs(item.saldo))}`
            : `Задолженность: ${formatValue({ type: 'currency', decimals: 2 }, item.saldo)}`}
        </MediumText>
        {!!item.saldoDebt && (
          <MediumText style={debtTextStyle}>{`Просрочено: ${formatValue(
            { type: 'currency', decimals: 2 },
            item.saldoDebt,
          )}, ${item.dayLeft} дн.`}</MediumText>
        )}
      </View>
    </View>
  );
};
export default DebetItem;
