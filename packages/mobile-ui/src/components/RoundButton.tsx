import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

import React from 'react';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

import styles from '../styles/global';

interface IProps {
  style?: StyleProp<ViewStyle>;
  icon: keyof typeof Icon.glyphMap;
  disabled?: boolean;
  onPress?: () => void;
}

const RoundButton = ({ onPress, style, icon, disabled }: IProps) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.rectangularButton, style]}
      disabled={disabled}
    >
      <View style={[styles.roundButton, disabled && { backgroundColor: colors.disabled }]}>
        <Icon name={icon} size={30} color={colors.background} />
      </View>
      {/*       <View style={localStyles.buttons}>
        {icon && <Icon name={icon} size={16} color={colors.background} />}
        <Text style={[localStyles.text, { color: colors.background }]}>
          {'  '}
          {typeof children === 'string' ? children.toUpperCase() : children}
        </Text>
      </View> */}
    </TouchableOpacity>
  );
};

export default RoundButton;
