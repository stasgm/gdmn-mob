import React from 'react';
import { IconButton } from 'react-native-paper';

interface IProps {
  onPress: () => void;
  disabled?: boolean;
}

const AddButton = ({ onPress, disabled }: IProps) => {
  return <IconButton icon="plus" size={30} onPress={onPress} disabled={disabled} />;
};

export default AddButton;
