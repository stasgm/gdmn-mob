import React from 'react';
import { IconButton } from 'react-native-paper';

interface IProps {
  onPress: () => void;
  disabled?: boolean;
}

const SaveDocument = ({ onPress, disabled }: IProps) => {
  return <IconButton icon="content-save-edit-outline" size={26} onPress={onPress} disabled={disabled} />;
};

export default SaveDocument;
