import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useTheme } from '@react-navigation/native';

import globalStyles from '../styles/global';

interface IProps {
  size?: 'large' | 'small';
}

export const AppActivityIndicator = ({ size = 'small' }: IProps) => {
  const { colors } = useTheme();
  return <ActivityIndicator size={size} color={colors.primary} style={globalStyles.container} />;
};
