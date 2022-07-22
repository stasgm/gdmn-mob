import React from 'react';
import { View, StyleSheet } from 'react-native';
import { globalStyles as styles, MediumText } from '@lib/mobile-ui';
import { Divider } from 'react-native-paper';

import { useTheme } from '@react-navigation/native';

import { round } from '@lib/mobile-app';

import { IFreeSellbillLine } from '../../../types';

export interface IItem {
  lines: IFreeSellbillLine[];
  scan?: boolean;
}

const FreeSellbillTotal = ({ lines, scan = false }: IItem) => {
  const { colors } = useTheme();

  const lineSum = lines?.reduce((sum, line) => sum + (line.weight || 0), 0);

  return (
    <View>
      {!scan ? (
        <View style={[localStyles.margins, localStyles.total]}>
          <MediumText style={styles.textTotal}>Итого:</MediumText>
        </View>
      ) : null}
      <Divider style={{ backgroundColor: colors.primary }} />
      <View style={styles.itemNoMargin}>
        <View style={styles.details}>
          <View style={styles.directionRow}>
            <View style={localStyles.groupWidth}>
              <MediumText>Общий вес (кг)</MediumText>
            </View>
            <View style={localStyles.quantity}>
              <MediumText>{`${round(lineSum, 3)}`}</MediumText>
            </View>

            {/* <MediumText>{`${formatValue({ type: 'currency', decimals: 2 }, round(, 2))}`}</MediumText> */}
          </View>

          <View style={styles.directionRow}>
            <View style={localStyles.groupWidth}>
              <MediumText>Количество позиций</MediumText>
            </View>
            <View style={localStyles.quantity}>
              <MediumText>{lines.length}</MediumText>
            </View>

            {/* <MediumText>{`${formatValue({ type: 'currency', decimals: 2 }, round(, 2))}`}</MediumText> */}
          </View>
        </View>
      </View>
    </View>
    // </View>
  );
};

export default FreeSellbillTotal;

const localStyles = StyleSheet.create({
  margins: {
    marginHorizontal: 8,
    marginVertical: 5,
  },
  groupWidth: {
    width: '62%',
  },
  quantity: {
    alignItems: 'flex-end',
    width: '35%',
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
});
