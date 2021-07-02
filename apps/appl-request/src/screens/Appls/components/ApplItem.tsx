import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { globalStyles as styles } from '@lib/mobile-ui';

import { IApplLine } from '../../../store/docs/types';

interface IProps {
  docId: string;
  item: IApplLine;
  readonly?: boolean;
}

const ApplItem = ({ item }: IProps) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity>
      <View style={[styles.item]}>
        <View style={[styles.icon]}>
          <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <Text style={[styles.name, { color: colors.text }]}>{item.goodName}</Text>
          <View style={[styles.directionRow]}>
            <Text style={[styles.field, { color: colors.text }]}>{item.quantity}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ApplItem;
