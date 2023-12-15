import React from 'react';
import { View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';

import styles from '../../styles/buttonRippleStyle';

interface IProps {
  visible: boolean;
  onPress: () => void;
}

const SearchButton = ({ onPress, visible }: IProps) => {
  const { colors } = useTheme();
  const iconStyle = visible ? { backgroundColor: colors.background, opacity: 0.8 } : {};
  return (
    <View style={styles.viewRight_30}>
      <IconButton icon="card-search-outline" size={30} style={[styles.icon_30, iconStyle]} onPress={onPress} />
    </View>
  );
};

export default SearchButton;
