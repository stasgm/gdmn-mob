import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles as styles, LargeText, MediumText } from '@lib/mobile-ui';
import { IEntity, INamedEntity } from '@lib/types';

import { Chip } from 'react-native-paper';

import { useTheme } from '@react-navigation/native';

import { IReportTotalLine } from '../../../store/types';

export interface IReportItem {
  // export interface IReportItem extends IEntity {
  address: string;
  onDate: string;
  goodGuantity?: IReportTotalLine[];
  outlet: INamedEntity;
}

const ReportItem = ({ outlet, address, goodGuantity }: IReportItem) => {
  const { colors } = useTheme();

  return (
    <View style={styles.item}>
      <View style={styles.icon}>
        <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
      </View>
      <View style={styles.details}>
        <View style={styles.directionRow}>
          <LargeText style={styles.textBold}>{outlet.name}</LargeText>
        </View>
        <MediumText>{address}</MediumText>
        {goodGuantity?.length ? (
          <View style={localStyles.quantity}>
            {goodGuantity.map((item, key) => (
              <Chip key={key} style={[localStyles.margin, { borderColor: colors.primary }]}>
                {item.package.name}: {item.quantity} кг
              </Chip>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
};
export default ReportItem;

const localStyles = StyleSheet.create({
  quantity: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 },
  margin: { margin: 2 },
});
