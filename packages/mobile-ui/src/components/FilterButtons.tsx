import React from 'react';
import { StyleProp, Text, TouchableHighlight, View, ViewStyle, StyleSheet } from 'react-native';
import { MD2Theme, useTheme } from 'react-native-paper';

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
  const { colors } = useTheme<MD2Theme>();

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
              { borderColor: colors.primary },
            ]}
            onPress={() => onPress(e.status)}
          >
            <Text style={[{ color: e.status === status ? colors.background : colors.text }, localStyles.fontSize]}>
              {e.name}
            </Text>
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
  fontSize: { fontSize: 17 },
});
