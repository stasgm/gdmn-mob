import React from 'react';
import { View } from 'react-native';
import { useTheme, Switch as SwitchComponent, MD2Theme } from 'react-native-paper';

type Props = {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
  disabled?: boolean;
};

const Switch = ({ value, onValueChange, disabled }: Props) => {
  const { colors } = useTheme<MD2Theme>();
  return (
    <View>
      <SwitchComponent
        thumbColor={value ? (disabled ? colors.background : colors.placeholder) : colors.background}
        trackColor={{ false: colors.disabled, true: disabled ? colors.disabled : colors.accent }}
        value={value}
        onValueChange={() => onValueChange(!value)}
        disabled={disabled}
      />
    </View>
  );
};

export default Switch;
