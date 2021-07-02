import React from 'react';
import { StyleProp, Text, TouchableHighlight, View, ViewStyle, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

import styles from '../styles/global';

interface StatusTypes {
  name: string;
  status: Status;
}

const statusTypes: StatusTypes[] = [
  {
    name: 'Все',
    status: 'all',
  },
  {
    name: 'Активные',
    status: 'active',
  },
  {
    name: 'Архив',
    status: 'archive',
  },
];

interface IProps {
  status: Status;
  onPress: (status: Status) => void;
  style?: StyleProp<ViewStyle>;
}

export type Status = 'all' | 'active' | 'archive';

const FilterButtons = ({ status, onPress, style }: IProps) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.containerCenter, localStyles.container, style]}>
      {statusTypes.map((e, i) => {
        return (
          <TouchableHighlight
            activeOpacity={0.7}
            underlayColor="#DDDDDD"
            key={e.name}
            style={[
              styles.btnTab,
              i === 0 && styles.firstBtnTab,
              i === statusTypes.length - 1 && styles.lastBtnTab,
              e.status === status && { backgroundColor: colors.primary },
            ]}
            onPress={() => onPress(e.status)}
          >
            <Text style={{ color: e.status === status ? colors.background : colors.text }}>{e.name}</Text>
          </TouchableHighlight>
        );
      })}
    </View>
  );
};

export default FilterButtons;

const localStyles = StyleSheet.create({
  container: {
    marginBottom: 5,
  },
});
