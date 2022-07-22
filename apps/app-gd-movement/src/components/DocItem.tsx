import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { globalStyles as styles, LargeText, MediumText } from '@lib/mobile-ui';
import { refSelectors } from '@lib/store';

import { IMovementLine } from '../store/types';
import { IGood } from '../store/app/types';

interface IProps {
  item: IMovementLine;
  checked?: boolean;
  readonly?: boolean;
  onPress: () => void;
  onLongPress?: () => void;
  isDelList?: boolean;
}

export const DocItem = ({ item, checked, readonly = false, onPress, onLongPress, isDelList }: IProps) => {
  const good = refSelectors.selectByName<IGood>('good')?.data?.find((e) => e.id === item?.good.id);

  return (
    <TouchableOpacity onPress={isDelList ? onLongPress : onPress} onLongPress={onLongPress} disabled={readonly}>
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
          <LargeText style={styles.textBold}>{item.good.name}</LargeText>
          <View style={styles.directionRow}>
            <MediumText>
              {item.quantity} {good?.valueName} x {(item.price || 0).toString()} р.
            </MediumText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
