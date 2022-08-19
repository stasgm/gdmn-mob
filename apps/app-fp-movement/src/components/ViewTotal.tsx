import React from 'react';
import { View, StyleSheet } from 'react-native';
import { globalStyles as styles, MediumText } from '@lib/mobile-ui';
import { Divider } from 'react-native-paper';

import { useTheme } from '@react-navigation/native';

import { round } from '@lib/mobile-app';

export interface IItem {
  quantity: number;
  weight: number;
  scan?: boolean;
}

const ViewTotal = ({ weight, quantity, scan = false }: IItem) => {
  const { colors } = useTheme();

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
              <MediumText>Общий вес, кг</MediumText>
            </View>
            <View style={localStyles.quantity}>
              <MediumText>{`${round(quantity, 3)}` || 0}</MediumText>
            </View>
          </View>
          <View style={styles.directionRow}>
            <View style={localStyles.groupWidth}>
              <MediumText>Количество позиций</MediumText>
            </View>
            <View style={localStyles.quantity}>
              <MediumText>{weight || 0}</MediumText>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ViewTotal;

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
