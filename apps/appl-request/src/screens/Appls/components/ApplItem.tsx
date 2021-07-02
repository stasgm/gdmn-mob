import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { globalStyles as styles } from '@lib/mobile-ui';

import { IApplLine } from '../../../store/types';

interface IProps {
  docId: string;
  item: IApplLine;
}

const ApplItem = ({ item }: IProps) => {
  return (
    <TouchableOpacity>
      <View style={[styles.item]}>
        <View style={[styles.icon]}>
          <MaterialCommunityIcons name="information-outline" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <Text style={styles.name}>{item.goodName}</Text>
          <Text
            style={[styles.field, styles.number, styles.rightAlignmentSelf]}
          >{`${item.quantity} ${item.value.name}`}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ApplItem;
