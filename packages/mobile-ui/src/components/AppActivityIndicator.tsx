import React from 'react';
import { ActivityIndicator, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';

import globalStyles from '../styles/global';
interface IProps {
  size?: 'large' | 'small';
  style?: StyleProp<ViewStyle>;
}
//style={globalStyles.container}

export const AppActivityIndicator = ({ size = 'small', style }: IProps) => {
  const { colors } = useTheme();
  return <ActivityIndicator size={size} color={colors.primary} style={style ? style : globalStyles.container} />;
};
