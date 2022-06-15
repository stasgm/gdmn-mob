import React, { useMemo } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { globalStyles as styles } from '@lib/mobile-ui';

import { StackNavigationProp } from '@react-navigation/stack';

import { IMoveLine } from '../../../store/types';
import { MoveStackParamList } from '../../../navigation/Root/types';

interface IProps {
  docId: string;
  item: IMoveLine;
  readonly?: boolean;
}

export const MoveItem = ({ docId, item, readonly = false }: IProps) => {
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<MoveStackParamList, 'MoveView'>>();

  const textStyle = useMemo(() => [styles.field, { color: colors.text }], [colors.text]);

  return (
    <TouchableOpacity
      onPress={() => {
        !readonly && navigation.navigate('MoveLine', { mode: 1, docId, item });
      }}
    >
      <View style={[styles.item]}>
        <View style={[styles.icon]}>
          <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <Text style={styles.name}>{item.good.name}</Text>
          <View style={[styles.directionRow]}>
            <Text style={textStyle}>{(item.weight || 0).toString()} кг</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
