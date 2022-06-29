import React from 'react';
import { IconButton } from 'react-native-paper';

interface IProps {
  onPress: () => void;
  disabled?: boolean;
}

const SendButton = ({ onPress, disabled }: IProps) => {
  return <IconButton icon="file-send-outline" size={27} onPress={onPress} disabled={disabled} />;
};

export default SendButton;
