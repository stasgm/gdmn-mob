import React from 'react';
import { IconButton } from 'react-native-paper';

interface IProps {
  onPress: () => void;
}

const SaveButton = ({ onPress }: IProps) => {
  return <IconButton icon="check" size={30} onPress={onPress} />;
};

export default SaveButton;
