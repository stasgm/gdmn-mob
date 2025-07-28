import React from 'react';
import { View, StyleSheet } from 'react-native';
import { globalStyles as styles, MediumText } from '@lib/mobile-ui';
import { Divider } from 'react-native-paper';

import { useTheme } from '@react-navigation/native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface IItem {
  lineCount?: number;
  scan?: boolean;
  sumWNds?: boolean;
}

const WaybillTotal = ({ lineCount, scan = false }: IItem) => {
  const { colors } = useTheme();

  return (
    <View>
      {!scan ? (
        <View style={styles.directionRow}>
          <View style={[localStyles.margins, localStyles.total]}>
            <MediumText style={styles.textTotal}>Итого:</MediumText>
          </View>
          <View style={localStyles.lineCount}>
            <MediumText>{lineCount}</MediumText>
            <MaterialCommunityIcons name="shopping-outline" size={15} color={colors.text} />
          </View>
        </View>
      ) : null}
      <Divider style={{ backgroundColor: colors.primary }} />
      {/*количество одобренных /добавленных / неопознанных  кодов маркировки*/}
      {/* <View style={styles.itemNoMargin}>
        <View style={styles.details}>
          <View style={styles.directionRow}>
            <View style={localStyles.groupWidth}>
              <MediumText>Количество</MediumText>
            </View>
            <View style={localStyles.quantity}>
              <MediumText>{`${round(quantity || 0, 3)}` || 0}</MediumText>
            </View>
          </View>
        </View>
      </View> */}
    </View>
  );
};

export default WaybillTotal;

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
  lineCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
