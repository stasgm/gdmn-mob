import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { globalStyles as styles } from '@lib/mobile-ui';

interface IProps {
  docId: string;
  readonly?: boolean;
  index: number;
  checked?: boolean;
}

export const ScanItem = ({ index, checked }: IProps) => {
  return (
    <View style={[styles.item]}>
      <View style={[styles.icon]}>
        <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
      </View>
      {checked ? (
        <View style={[localStyles.icon]}>
          <MaterialCommunityIcons
            name="check-circle-outline"
            size={10}
            color={'#FFF'}
            // style={{ backgroundColor: '#80B12C' }}
          />
        </View>
      ) : null}
      <View style={styles.details}>
        <Text style={styles.name}>Сканирование {(index + 1)?.toString()}</Text>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  icon: {
    alignItems: 'center',
    backgroundColor: '#80B12C',
    borderRadius: 8,
    height: 15,
    justifyContent: 'center',
    width: 15,
    marginLeft: -5,
    marginTop: 15,
  },
});
