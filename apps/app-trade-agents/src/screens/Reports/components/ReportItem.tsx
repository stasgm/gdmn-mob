import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles as styles, LargeText, MediumText } from '@lib/mobile-ui';
import { INamedEntity } from '@lib/types';

export interface IReportItem extends INamedEntity {
  address: string;
  documentDate: string;
}

const ReportItem = ({ name, address }: IReportItem) => {
  return (
    <View style={styles.item}>
      <View style={styles.icon}>
        <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
      </View>
      <View style={styles.details}>
        <View style={styles.directionRow}>
          <LargeText style={styles.textBold}>{name}</LargeText>
        </View>
        <MediumText>{address}</MediumText>
      </View>
    </View>
  );
};
export default ReportItem;
