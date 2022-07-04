import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { globalStyles as styles } from '@lib/mobile-ui';
import { refSelectors } from '@lib/store';

import { StackNavigationProp } from '@react-navigation/stack';

import { IMovementLine } from '../store/types';
import { IGood } from '../store/app/types';
import { DocStackParamList } from '../navigation/Root/types';

interface IProps {
  item: IMovementLine;
  checked?: boolean;
  docId: string;
  readonly?: boolean;
  onCheckItem: () => void;
  isDelList?: boolean;
}

export const DocItem = ({ item, checked, docId, readonly = false, onCheckItem, isDelList }: IProps) => {
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<DocStackParamList, 'ScanBarcode'>>();

  const good = refSelectors.selectByName<IGood>('good')?.data?.find((e) => e.id === item?.good.id);

  const textStyle = useMemo(() => [styles.field, { color: colors.text }], [colors.text]);

  return (
    <TouchableOpacity
      onPress={() => {
        isDelList ? onCheckItem() : navigation.navigate('DocLine', { mode: 1, docId, item });
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
          <Text style={styles.name}>{item.good.name}</Text>
          <View style={[styles.directionRow]}>
            <Text style={textStyle}>
              {item.quantity} {good?.valueName} x {(item.price || 0).toString()} р.
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
