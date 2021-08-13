import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Subheading, Switch, TextInput, useTheme } from 'react-native-paper';

import Input from './Input';

type Props = {
  label: string;
  value: boolean | number | undefined;
  onValueChange: (newValue: any) => void;
};

const SettingsItem = ({ label, value, onValueChange }: Props) => {
  const { colors } = useTheme();

  return (
    <View style={localStyles.container}>
      <Subheading numberOfLines={5} style={localStyles.subHeading}>
        {label}
      </Subheading>
      {typeof value === 'boolean' ? (
        <Switch value={value} onValueChange={(value) => onValueChange(value)} />
      ) : typeof value === 'number' ? (
        <TextInput
          value={value === 0 ? '' : value.toString()}
          onChangeText={(text) => onValueChange(text !== '' ? Number(text) : 0)}
          mode="outlined"
          keyboardType={'numeric'}
          style={localStyles.input}
          theme={{
            colors: {
              primary: colors.primary,
              text: colors.text,
              placeholder: colors.primary,
              background: colors.surface,
            },
          }}
        />
      ) : (
        <TextInput
          value={value}
          onChangeText={(text) => onValueChange(text)}
          mode="outlined"
          keyboardType={'default'}
        />
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    width: '100%',
  },
  input: {
    height: 32,
  },
  subHeading: {
    width: '85%',
    fontSize: 14,
  },
});

export default SettingsItem;
