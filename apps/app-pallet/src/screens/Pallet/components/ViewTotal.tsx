import React from 'react';
import { View, StyleSheet } from 'react-native';
import { globalStyles as styles, MediumText } from '@lib/mobile-ui';
import { Divider } from 'react-native-paper';

import { useTheme } from '@react-navigation/native';

export interface IItem {
  total?: number;
  scan?: boolean;
}

const ViewTotal = ({ total }: IItem) => {
  const { colors } = useTheme();

  return (
    <View>
      <Divider style={{ backgroundColor: colors.primary }} />
      <View style={[localStyles.total, styles.directionRow]}>
        <View style={localStyles.groupWidth}>
          <MediumText style={styles.textTotal}>Итого: </MediumText>
        </View>
        <View style={localStyles.quantity}>
          <MediumText>{total || 0}</MediumText>
        </View>
      </View>
    </View>
  );
};

export default ViewTotal;

const localStyles = StyleSheet.create({
  groupWidth: {
    width: '62%',
  },
  quantity: {
    alignItems: 'flex-end',
    width: '35%',
  },
  total: {
    margin: 5,
    alignItems: 'center',
  },
});
