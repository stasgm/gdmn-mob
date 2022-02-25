import React from 'react';
import { View, StyleSheet, Switch, Text } from 'react-native';

import { Input, globalStyles as styles, SelectableInput } from '@lib/mobile-ui';

import { FieldType, INamedEntity } from '@lib/types';

import { getDateString, isNamedEntity } from '../utils/helpers';

interface IProps {
  type?: FieldType;
  value?: any;
  description?: any;
  clearInput?: boolean;
  onChangeText?: (text: string) => void;
  onPress: () => void;
  disabled?: boolean;
}

const InputItem = ({ onChangeText, onPress, value, disabled, description, type, clearInput }: IProps) => {
  const v =
    type === 'boolean'
      ? !!value
      : value !== undefined
      ? type === 'date'
      : getDateString(value)
      ? type === 'ref'
        ? isNamedEntity(value)
          ? value.name
          : ''
        : value
      : undefined;

  console.log('InputItem', type, description, v);
  return (
    <View style={styles.container}>
      {type === 'date' || type === 'ref' ? (
        <SelectableInput label={description} value={v} onPress={onPress} disabled={disabled} />
      ) : type === 'boolean' ? (
        <View style={[styles.directionRow, localStyles.switchContainer]}>
          <Text>{description}:</Text>
          <Switch value={v} onValueChange={onPress} />
        </View>
      ) : (
        <Input
          label={description}
          maxLength={40}
          value={v}
          onChangeText={onPress}
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
