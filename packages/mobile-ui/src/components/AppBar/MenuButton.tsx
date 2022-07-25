import React from 'react';
import { Platform } from 'react-native';
import { IconButton } from 'react-native-paper';

interface IProps {
  actionsMenu: () => void;
  disabled?: boolean;
}

const MenuButton = ({ actionsMenu, disabled }: IProps) => {
  return (
    <IconButton
      icon={Platform.OS === 'android' ? 'dots-vertical' : 'dots-horizontal'}
      size={30}
      onPress={actionsMenu}
      disabled={disabled}
    />
  );
};

export default MenuButton;
