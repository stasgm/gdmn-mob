import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

import React from 'react';
import { StyleProp, TouchableOpacity, View, StyleSheet, ViewStyle, Text } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';

import styles from '../styles/global';

interface IProps {
  style?: StyleProp<ViewStyle>;
  icon?: keyof typeof Icon.glyphMap;
  outlined?: boolean;
  disabled?: boolean;
  loadIcon?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
  type?: 'cancel' | 'normal';
}

const PrimeButton = ({
  onPress,
  style,
  children,
  icon,
  disabled,
  outlined,
  type = 'normal',
  loadIcon = false,
}: IProps) => {
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
          : { backgroundColor: disabled ? colors.disabled : type === 'normal' ? colors.primary : '#a91160' },
        style,
      ]}
    >
      <View style={localStyles.buttons}>
        {icon && <Icon name={icon} size={16} color={outlined ? colors.primary : colors.background} />}
        <Text
          style={[
            localStyles.text,
            { color: outlined ? (type === 'normal' ? colors.primary : colors.error) : colors.background },
          ]}
        >
          {'  '}
          {typeof children === 'string' ? children.toUpperCase() : children}
        </Text>
        {loadIcon ? (
          <ActivityIndicator
            size="small"
            color={
              !outlined
                ? disabled
                  ? colors.disabled
                  : colors.background
                : disabled
                ? colors.disabled
                : type === 'normal'
                ? colors.primary
                : '#a91160'
            }
            style={localStyles.indicator}
          />
        ) : (
          <View style={localStyles.blank} />
        )}
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
  blank: {
    // width: 20,
  },
  indicator: {
    paddingLeft: 10,
  },
});
