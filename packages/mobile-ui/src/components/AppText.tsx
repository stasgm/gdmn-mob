import React from 'react';
import { Text, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';

interface IProps {
  children?: any;
  style?: StyleProp<TextStyle>;
  selectable?: boolean;
  onPress?: () => void;
}

// Жирный черный цвет
export const LargeText = ({ children, style, selectable = false }: IProps) => {
  const { colors } = useTheme();
  return (
    <Text style={[{ color: colors.primary }, localStyles.largeText, style]} selectable={selectable}>
      {children}
    </Text>
  );
};

//обычный легкий светлый или темный цвет в зависимости от темы
export const MediumText = ({ children, style, selectable = false, onPress }: IProps) => {
  const { colors } = useTheme();
  return (
    <Text style={[{ color: colors.text }, localStyles.mediumText, style]} selectable={selectable} onPress={onPress}>
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
