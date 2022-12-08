import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { globalStyles as styles, LargeText, MediumText } from '@lib/mobile-ui';

import { IApplLine } from '../../../store/types';

interface IProps {
  item: IApplLine;
}

const ApplItem = ({ item }: IProps) => {
  return (
    <View style={[styles.item]}>
      <View style={[styles.icon]}>
        <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
      </View>
      <View style={styles.details}>
        <LargeText style={styles.textBold}>{item.goodName}</LargeText>
        <MediumText style={[styles.number]}>{`${item.quantity} ${item.value.name}`}</MediumText>
      </View>
    </View>
  );
};

export default ApplItem;
