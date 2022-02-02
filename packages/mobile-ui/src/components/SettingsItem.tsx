import React from 'react';
import { SettingValue } from '@lib/types';
import { View, StyleSheet } from 'react-native';
import { Subheading, Switch } from 'react-native-paper';

import Input from './Input';

type Props = {
  label: string;
  value: SettingValue;
  onValueChange: (newValue: SettingValue) => void;
};

const SettingsItem = ({ label, value, onValueChange }: Props) => {
  return (
    <View>
      {typeof value === 'boolean' ? (
        <View style={localStyles.container}>
          <Subheading numberOfLines={5} style={localStyles.subHeading}>
            {label}
          </Subheading>
          <Switch value={value} onValueChange={() => onValueChange(!value)} />
        </View>
      ) : (
        <View style={localStyles.settingsContainer}>
          {typeof value === 'number' ? (
            <Input
              label={label}
              value={value === 0 ? '' : value.toString()}
              onChangeText={(text) => onValueChange(text !== '' ? Number(text) : 0)}
              keyboardType={'numeric'}
              clearInput={true}
            />
          ) : (
            <Input
              label={label}
              value={value}
              onChangeText={(text) => onValueChange(text)}
              keyboardType={'default'}
              clearInput={true}
            />
          )}
        </View>
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 3,
    marginVertical: 6,
  },
  settingsContainer: {
    flexDirection: 'column',
    paddingTop: 6,
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
