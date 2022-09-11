import React from 'react';
import { IconButton } from 'react-native-paper';

interface IProps {
  onPress: () => void;
  disabled?: boolean;
}

export const ScanButton = ({ onPress, disabled }: IProps) => {
  return <IconButton icon="barcode-scan" size={26} onPress={onPress} disabled={disabled} />;
};
