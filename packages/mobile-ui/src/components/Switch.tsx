import React from 'react';
import { View } from 'react-native';
import { useTheme, Switch as SwitchComponent } from 'react-native-paper';

type Props = {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
  disabled?: boolean;
};

const Switch = ({ value, onValueChange, disabled }: Props) => {
  const { colors } = useTheme();
  return (
    <View>
      <SwitchComponent
        thumbColor={value ? colors.placeholder : colors.background}
        trackColor={{ false: colors.disabled, true: colors.accent }}
        value={value}
        onValueChange={() => onValueChange(!value)}
        disabled={disabled}
      />
    </View>
  );
};

export default Switch;
