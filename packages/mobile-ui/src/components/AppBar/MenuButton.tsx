import React from 'react';
import { Platform, View } from 'react-native';
import { IconButton } from 'react-native-paper';

import styles from '../../styles/buttonRippleStyle';

interface IProps {
  actionsMenu: () => void;
  disabled?: boolean;
}

const MenuButton = ({ actionsMenu, disabled }: IProps) => (
  <View style={styles.viewRight_30}>
    <IconButton
      icon={Platform.OS === 'android' ? 'dots-vertical' : 'dots-horizontal'}
      size={30}
      style={styles.icon_30}
      onPress={actionsMenu}
      disabled={disabled}
    />
  </View>
);

export default MenuButton;
