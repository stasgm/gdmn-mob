import React, { useEffect, useState } from 'react';

import { View, StyleSheet } from 'react-native';
import { SettingValue } from '@lib/types';

import Input from './Input';
import { MediumText } from './AppText';
import Switch from './Switch';
import Checkbox from './Checkbox';

type Props = {
  label: string;
  value: SettingValue;
  disabled?: boolean;
  onValueChange: (newValue: SettingValue) => void;
  onEndEditing: (newValue: SettingValue) => void;
};

const SettingsItem = ({ label, value, disabled = false, onValueChange, onEndEditing }: Props) => {
  const [itemValue, setItemValue] = useState(value);

  const handleChangeText = (text: string) => {
    let newValue = text.replace(',', '.');
    newValue = !newValue.includes('.') ? parseFloat(newValue).toString() : newValue;
    newValue = Number.isNaN(parseFloat(newValue)) ? '0' : newValue;
    const validNumber = new RegExp(/^(\d{1,6}(,|.))?\d{0,4}$/);
    setItemValue(validNumber.test(newValue) ? newValue : itemValue);
  };

  useEffect(() => {
    setItemValue(value);
  }, [value]);

  return (
    <View>
      {typeof value === 'object' && Array.isArray(value) ? (
        <View>
          <MediumText style={localStyles.title}>{label}</MediumText>
          <View style={localStyles.status}>
            {value?.map((elem) => (
              <View key={elem.id}>
                <Checkbox
                  key={elem.id}
                  title={elem.value}
                  selected={elem.selected}
                  onSelect={() => {
                    onValueChange(value.map((v) => (v.id === elem.id ? { ...elem, selected: !elem.selected } : v)));
                  }}
                />
              </View>
            ))}
          </View>
        </View>
      ) : typeof value === 'boolean' ? (
        <View style={localStyles.container}>
          <MediumText>{label}</MediumText>
          <Switch
            value={value}
            onValueChange={() => {
              onValueChange(!value);
              onEndEditing(!value);
            }}
            disabled={disabled}
          />
        </View>
      ) : (
        <View style={localStyles.settingsContainer}>
          {typeof value === 'number' ? (
            <Input
              label={label}
              value={itemValue === 0 ? '' : itemValue.toString()}
              onChangeText={handleChangeText}
              keyboardType={'numeric'}
              clearInput={true}
              autoCapitalize="none"
              disabled={disabled}
              onEndEditing={() => {
                onValueChange(Number(itemValue));
                onEndEditing(Number(itemValue));
              }}
            />
          ) : (
            <Input
              label={label}
              value={value}
              onChangeText={(text) => onValueChange(text)}
              keyboardType={'default'}
              clearInput={true}
              disabled={disabled}
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
  status: {
    margin: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  title: {
    margin: 3,
    textAlign: 'center',
  },
});

export default SettingsItem;
