import React from 'react';
import { IconButton } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';

interface IProps {
  visible: boolean;
  onPress: () => void;
}

const SearchButton = ({ onPress, visible }: IProps) => {
  const { colors } = useTheme();
  return (
    <IconButton
      icon="card-search-outline"
      style={visible && { backgroundColor: colors.card }}
      size={26}
      onPress={onPress}
    />
  );
};

export default SearchButton;
