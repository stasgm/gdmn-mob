import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
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
}

export type Status = 'all' | 'active' | 'archive';

const FilterButtons = ({ status, onPress }: IProps) => {
  const { colors } = useTheme();

  return (
    <View style={styles.containerCenter}>
      {statusTypes.map((e) => {
        return (
          <TouchableHighlight
            activeOpacity={0.7}
            underlayColor="#DDDDDD"
            key={e.name}
            style={[styles.btnTab, e.status === status && { backgroundColor: colors.primary }]}
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
