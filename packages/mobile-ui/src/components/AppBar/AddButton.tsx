import React from 'react';
import { IconButton } from 'react-native-paper';

interface IProps {
  onPress: () => void;
}

const AddButton = ({ onPress }: IProps) => {
  return <IconButton icon="plus" size={30} onPress={onPress} />;
};

export default AddButton;
