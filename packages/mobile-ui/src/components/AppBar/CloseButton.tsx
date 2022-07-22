import React from 'react';
import { IconButton } from 'react-native-paper';

interface IProps {
  onPress: () => void;
}

export const CloseButton = ({ onPress }: IProps) => {
  return <IconButton icon="close" size={26} onPress={onPress} />;
};
