import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';

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
    <View style={styles.buttons}>
      {statusTypes.map((e) => {
        return (
          <TouchableOpacity
            key={e.name}
            style={[styles.btnTab, e.status === status && { backgroundColor: colors.primary }]}
            onPress={() => onPress(e.status)}
          >
            <Text style={{ color: e.status === status ? colors.background : colors.text }}>{e.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default FilterButtons;
