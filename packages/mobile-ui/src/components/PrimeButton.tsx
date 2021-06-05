import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

import React from 'react';
import { StyleProp, TouchableOpacity, View, StyleSheet, ViewStyle, Text } from 'react-native';
import { useTheme } from 'react-native-paper';

import styles from '../styles/global';

interface IProps {
  style?: StyleProp<ViewStyle>;
  icon?: keyof typeof Icon.glyphMap;
  disabled?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
}

const PrimeButton = ({ onPress, style, children, icon, disabled }: IProps) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled}
      style={[styles.rectangularButton, { backgroundColor: colors.primary }, style]}
    >
      <View style={localStyles.buttons}>
        {icon && <Icon name={icon} size={16} color={colors.background} />}
        <Text style={[localStyles.text, { color: colors.background }]}>
          {'  '}
          {typeof children === 'string' ? children.toUpperCase() : children}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default PrimeButton;

const localStyles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 1,
  },
});
