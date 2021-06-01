import React from 'react';
import { Platform } from 'react-native';
import { IconButton } from 'react-native-paper';

import colors from '../../styles/colors';

interface IProps {
  actionsMenu: () => void;
}

const MenuButton = ({ actionsMenu }: IProps) => {
  return (
    <IconButton
      color={colors.black}
      icon={Platform.OS === 'android' ? 'dots-vertical' : 'dots-horizontal'}
      size={26}
      onPress={actionsMenu}
    />
  );
};

export default MenuButton;
