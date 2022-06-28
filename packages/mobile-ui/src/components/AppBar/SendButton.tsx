import React from 'react';
import { IconButton } from 'react-native-paper';

interface IProps {
  onPress: () => void;
}

const SendButton = ({ onPress }: IProps) => {
  return <IconButton icon="file-send-outline" size={27} onPress={onPress} />;
};

export default SendButton;
