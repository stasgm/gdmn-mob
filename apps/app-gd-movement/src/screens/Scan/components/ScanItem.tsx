import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { globalStyles as styles } from '@lib/mobile-ui';

interface IProps {
  readonly?: boolean;
  index: number;
  checked?: boolean;
  onCheckItem: () => void;
  isDelList?: boolean;
}

export const ScanItem = ({ index, checked, readonly = false, onCheckItem, isDelList }: IProps) => {
  return (
    <TouchableOpacity
      onPress={() => {
        isDelList ? onCheckItem() : null;
      }}
      onLongPress={onCheckItem}
      disabled={readonly}
    >
      <View style={[styles.item]}>
        <View style={styles.iconsWithCheck}>
          <View style={[styles.icon]}>
            <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
          </View>
          {checked ? (
            <View style={[styles.checkedIcon]}>
              <MaterialCommunityIcons name="check" size={11} color={'#FFF'} />
            </View>
          ) : null}
        </View>
        <View style={styles.details}>
          <Text style={styles.name}>Сканирование {(index + 1)?.toString()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
