import React from 'react';

import { View, StyleSheet } from 'react-native';
import { SettingValue } from '@lib/types';

import { HelperText } from 'react-native-paper';

import { IListItem } from '@lib/mobile-types';

import Input from './Input';
import { MediumText } from './AppText';
import Switch from './Switch';

type Props = {
  label: string;
  value: SettingValue;
  disabled?: boolean;
  onValueChange: (newValue: SettingValue) => void;
  onEndEditing: () => void;
};

const SettingsItem = ({ label, value, disabled = false, onValueChange, onEndEditing }: Props) => {
  return (
    <View>
      {typeof value === 'boolean' ? (
        <View style={localStyles.container}>
          <MediumText>{label}</MediumText>
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
              autoCapitalize="none"
              disabled={disabled}
              onEndEditing={onEndEditing}
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
    fontSize: 20,
    justifyContent: 'space-between',
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
    fontSize: 15,
  },
});

export default SettingsItem;
