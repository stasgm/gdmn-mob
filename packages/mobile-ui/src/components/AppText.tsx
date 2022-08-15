import React from 'react';
import { Text, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';

interface IProps {
  children?: any;
  style?: StyleProp<TextStyle>;
  selectable?: boolean;
}

export const LargeText = ({ children, style, selectable = false }: IProps) => {
  const { colors } = useTheme();
  return (
    <Text style={[localStyles.largeText, style]} selectable={selectable}>
      {children}
    </Text>
  );
};

export const MediumText = ({ children, style, selectable = false }: IProps) => {
  const { colors } = useTheme();
  return (
    <Text style={[localStyles.mediumText, { color: colors.text }, style]} selectable={selectable}>
      {children}
    </Text>
  );
};

const localStyles = StyleSheet.create({
  largeText: {
    fontSize: 17,
  },
  mediumText: {
    fontSize: 15,
  },
});
