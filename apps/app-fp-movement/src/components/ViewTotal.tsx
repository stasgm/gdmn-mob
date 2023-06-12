import React from 'react';
import { View, StyleSheet } from 'react-native';
import { globalStyles as styles, MediumText } from '@lib/mobile-ui';
import { Divider } from 'react-native-paper';

import { useTheme } from '@react-navigation/native';

import { round } from '@lib/mobile-hooks';

export interface IItem {
  quantPack?: number;
  weight: number;
  scan?: boolean;
}

const ViewTotal = ({ weight, quantPack, scan = false }: IItem) => {
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
              <MediumText>{`${round(weight, 3)}` || 0}</MediumText>
            </View>
          </View>
          {quantPack ? (
            <View style={styles.directionRow}>
              <View style={localStyles.groupWidth}>
                <MediumText>Количество коробок</MediumText>
              </View>
              <View style={localStyles.quantity}>
                <MediumText>{`${round(quantPack, 3)}` || 0}</MediumText>
              </View>
            </View>
          ) : null}
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
