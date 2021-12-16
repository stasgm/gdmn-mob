import { SettingValue } from '@lib/types';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Subheading, Switch } from 'react-native-paper';

import Input from './Input';

type Props = {
  label: string;
  value: SettingValue;
  onValueChange: (newValue: any) => void;
};

const SettingsItem = ({ label, value, onValueChange }: Props) => {
  //console.log('Svalue', value);
  //console.log('Slabel', label);
  //console.log('Sfuction', onValueChange);

  const [currentValue, setCurrentValue] = useState(value);
  //console.log('valueS', value);
  return (
    <View>
      {typeof currentValue === 'boolean' ? (
        <View style={localStyles.container}>
          <Subheading numberOfLines={5} style={localStyles.subHeading}>
            {label}
          </Subheading>
          <Switch value={currentValue} onValueChange={(item) => onValueChange(item)} children={undefined} />
        </View>
      ) : (
        <View style={localStyles.settingsContainer}>
          {typeof currentValue === 'number' ? (
            <Input
              label={label}
              value={currentValue === 0 ? '' : currentValue.toString()}
              onChangeText={(text) => setCurrentValue(text !== '' ? Number(text) : 0)}
              onEndEditing={() => onValueChange(currentValue)}
              keyboardType={'numeric'}
            />
          ) : (
            <Input
              label={label}
              value={currentValue}
              onChangeText={(text) => setCurrentValue(text)}
              keyboardType={'default'}
              onEndEditing={() => onValueChange(currentValue)}
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
    // justifyContent: 'space-between',
    paddingHorizontal: 12,
    // width: '100%',
  },
  settingsContainer: {
    // alignItems: 'center',
    flexDirection: 'column',
    // justifyContent: 'space-between',
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
