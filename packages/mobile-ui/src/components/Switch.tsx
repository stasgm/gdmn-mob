import React from 'react';
import { View } from 'react-native';
import { useTheme, Switch as SwitchComponent } from 'react-native-paper';

type Props = {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
};

const Switch = ({ value, onValueChange }: Props) => {
  const { colors } = useTheme();
  return (
    <View>
      <SwitchComponent
        thumbColor={value ? colors.placeholder : colors.background}
        trackColor={{ false: colors.disabled, true: colors.accent }}
        value={value}
        onValueChange={() => onValueChange(!value)}
      />
    </View>
  );
};

export default Switch;
