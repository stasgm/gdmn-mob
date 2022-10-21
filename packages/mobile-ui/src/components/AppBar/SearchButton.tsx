import React from 'react';
import { IconButton } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';

import { View } from 'react-native';

import styles from '../../styles/buttonRippleStyle';

interface IProps {
  visible: boolean;
  onPress: () => void;
}

const SearchButton = ({ onPress, visible }: IProps) => {
  const { colors } = useTheme();
  return (
    <View style={styles.viewRight_30}>
      <IconButton
        icon="card-search-outline"
        size={30}
        style={[styles.icon_30, visible && { backgroundColor: colors.background, opacity: 0.8 }]}
        onPress={onPress}
      />
    </View>
  );
};

export default SearchButton;
