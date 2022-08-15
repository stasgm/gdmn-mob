import React from 'react';
import { Text, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';

interface IProps {
  children?: any;
  style?: StyleProp<TextStyle>;
}

export const LargeText = ({ children, style }: IProps) => {
  return <Text style={[localStyles.largeText, style]}>{children}</Text>;
};

export const MediumText = ({ children, style }: IProps) => {
  const { colors } = useTheme();
  return <Text style={[localStyles.mediumText, { color: colors.text }, style]}>{children}</Text>;
};

const localStyles = StyleSheet.create({
  largeText: {
    fontSize: 17,
  },
  mediumText: {
    fontSize: 15,
  },
});
