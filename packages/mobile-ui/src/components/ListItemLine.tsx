import React, { ReactNode } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import styles from '../styles/global';

interface IProps {
  onPress?: () => void;
  onLongPress?: () => void;
  checked?: boolean;
  readonly?: boolean;
  children?: ReactNode;
}

export const ListItemLine = ({ checked = false, readonly = false, onPress, onLongPress, children }: IProps) => {
  return (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress} disabled={readonly}>
      <View style={styles.item}>
        <View style={styles.iconsWithCheck}>
          <View style={styles.icon}>
            <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
          </View>
          {checked ? (
            <View style={styles.checkedIcon}>
              <MaterialCommunityIcons name="check" size={11} color={'#FFF'} />
            </View>
          ) : null}
        </View>
        {children}
      </View>
    </TouchableOpacity>
  );
};
