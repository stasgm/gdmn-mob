import React from 'react';
import { IconButton } from 'react-native-paper';

interface IProps {
  onPress: () => void;
}

export const ScanButton = ({ onPress }: IProps) => {
  return <IconButton icon="barcode-scan" size={26} onPress={onPress} />;
};
