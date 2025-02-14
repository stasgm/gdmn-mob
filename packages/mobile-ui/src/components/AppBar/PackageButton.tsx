import React from 'react';
import { View } from 'react-native';
import { IconButton } from 'react-native-paper';

import styles from '../../styles/buttonRippleStyle';

interface IProps {
  onPress: () => void;
  disabled?: boolean;
  iconColor?: string | undefined;
}

export const PackageButton = ({ onPress, disabled, iconColor }: IProps) => (
  <View style={styles.viewRight_30}>
    <IconButton
      icon="package-variant"
      size={30}
      style={styles.icon_30}
      onPress={onPress}
      disabled={disabled}
      iconColor={iconColor}
    />
  </View>
);
