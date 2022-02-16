import React from 'react';
import { View, StyleSheet, Switch, Text } from 'react-native';

import { Input, globalStyles as styles, SelectableInput } from '@lib/mobile-ui';

import { FieldType } from '@lib/types';

import { getDateString, isNamedEntity } from '../utils/helpers';

interface IProps {
  type?: FieldType;
  value?: any;
  description?: any;
  clearInput?: boolean;
  onChangeText: (text: string) => void;
  onPress: () => void;
  disabled?: boolean;
}

const InputItem = ({ onChangeText, onPress, value, disabled, description, type, clearInput }: IProps) => {
  const v = value
    ? type === 'date'
      ? getDateString(value)
      : type === 'ref'
      ? isNamedEntity(value)
        ? value.name
        : ''
      : value
    : 'boolean'
    ? !!value
    : undefined;
  // console.log('InputItem', value, description, type, clearInput, v);
  return (
    <View style={styles.container}>
      {type === 'date' || type === 'ref' ? (
        <SelectableInput label={description} value={v} onPress={onPress} disabled={disabled} />
      ) : type === 'boolean' ? (
        <View style={[styles.directionRow, localStyles.switchContainer]}>
          <Text>{description}:</Text>
          <Switch value={value} onValueChange={onPress} />
        </View>
      ) : (
        <Input
          label={description}
          maxLength={40}
          value={value}
          onChangeText={onChangeText}
          disabled={disabled}
          clearInput={clearInput}
        />
      )}
    </View>
  );
};

export const localStyles = StyleSheet.create({
  switchContainer: {
    margin: 10,
  },
});

export default InputItem;
