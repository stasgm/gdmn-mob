import React from 'react';
import { IconButton } from 'react-native-paper';

interface IProps {
  onPress: () => void;
}

export const DeleteButton = ({ onPress }: IProps) => {
  return <IconButton icon="delete-outline" size={26} onPress={onPress} />;
};
