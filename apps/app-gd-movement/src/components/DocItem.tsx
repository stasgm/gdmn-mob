import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { globalStyles as styles } from '@lib/mobile-ui';
import { refSelectors } from '@lib/store';

import { IMovementLine } from '../store/types';
import { IGood } from '../store/app/types';

interface IProps {
  docId: string;
  item: IMovementLine;
  readonly?: boolean;
}

export const DocItem = ({ docId, item, readonly = false }: IProps) => {
  const { colors } = useTheme();
  const navigation = useNavigation() as any;

  const good = refSelectors.selectByName<IGood>('good')?.data?.find((e) => e.id === item?.good.id);

  return (
    <TouchableOpacity
      onPress={() => {
        !readonly && navigation.navigate('DocLine', { mode: 1, docId, item });
      }}
    >
      <View style={[styles.item]}>
        <View style={[styles.icon]}>
          <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <Text style={[styles.name, { color: colors.text }]}>{item.good.name}</Text>
          <View style={[styles.directionRow]}>
            <Text style={[styles.field, { color: colors.text }]}>
              {item.quantity} {good?.valueName} x {(item.price || 0).toString()} р.
            </Text>
            {/* <Text style={[styles.field, { color: colors.text }]}>
              {Math.floor(item.quantity * (good?.invWeight ?? 1) * (good?.scale ?? 1) * 1000) / 1000} кг
            </Text>             */}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
