import React from 'react';
import { View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';

import styles from '../../styles/buttonRippleStyle';

interface IProps {
  visible: boolean;
  withParams?: boolean;
  onPress: () => void;
}

const FilterButton = ({ onPress, visible, withParams = false }: IProps) => {
  const { colors } = useTheme();
  return (
    <View style={styles.viewRight_30}>
      <IconButton
        icon={withParams ? 'filter-check-outline' : 'filter-outline'}
        size={30}
        style={[styles.icon_30, visible && { backgroundColor: colors.background, opacity: 0.8 }]}
        onPress={onPress}
      />
    </View>
  );
};

export default FilterButton;
