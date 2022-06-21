import React from 'react';
import { IconButton } from 'react-native-paper';

interface IProps {
  onPress: () => void;
  disabled?: boolean;
}

const SaveButton = ({ onPress, disabled }: IProps) => {
  return <IconButton icon="check" size={30} onPress={onPress} disabled={disabled} />;
};

export default SaveButton;
