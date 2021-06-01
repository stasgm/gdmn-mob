import React from 'react';
import { IconButton } from 'react-native-paper';
import colors from '../../styles/colors';

interface IProps {
  onPress: () => void;
}

const AddButton = ({ onPress }: IProps) => {
  return <IconButton color={colors.black} icon="plus" size={26} onPress={onPress} />;
};

export default AddButton;
