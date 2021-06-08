import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

import React from 'react';
import { StyleProp, TouchableOpacity, View, StyleSheet, ViewStyle, Text } from 'react-native';
import { useTheme } from 'react-native-paper';

import styles from '../styles/global';

interface IProps {
  style?: StyleProp<ViewStyle>;
  icon?: keyof typeof Icon.glyphMap;
  outlined?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
}

const PrimeButton = ({ onPress, style, children, icon, disabled, outlined }: IProps) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.rectangularButton,
        outlined
          ? {
              borderWidth: 1,
              borderColor: colors.primary,
              backgroundColor: disabled ? colors.disabled : colors.background,
            }
          : { backgroundColor: disabled ? colors.disabled : colors.primary },
        style,
      ]}
    >
      <View style={localStyles.buttons}>
        {icon && <Icon name={icon} size={16} color={outlined ? colors.primary : colors.background} />}
        <Text style={[localStyles.text, { color: outlined ? colors.primary : colors.background }]}>
          {'  '}
          {typeof children === 'string' ? children.toUpperCase() : children}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

/* const CustomButton = ({
  outlined = true,
  onPress,
  children,
  disabled = false,
  style,
}: {
  onPress?: () => void;
  disabled?: boolean;
  outlined: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  return outlined ? (
    <TouchableHighlight activeOpacity={0.7} underlayColor="#DDDDDD" onPress={onPress} disabled={disabled} style={style}>
      {children}
    </TouchableHighlight>
  ) : (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={style} disabled={disabled}>
      {children}
    </TouchableOpacity>
  );
}; */

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
