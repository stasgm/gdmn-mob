/* eslint-disable valid-typeof */
/* eslint-disable react-native/no-unused-styles */
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
//import { Divider, Subheading, Switch } from 'react-native-paper';

import { ISettingsOptionDoc, RefTypeChoose, SettingsDoc, SettingValueDoc } from '@lib/types';
import { Input, globalStyles as styles, SelectableInput } from '@lib/mobile-ui';

type Props = {
  type: string;
  value: any;
  sortOrder: number;
  description: string;
  disabled?: boolean;
  clearInput?: boolean;
  onChangeText: (text: string) => void;
  onPress: () => void;
};
// optionName: string, value: ISettingsOptionDoc
export const ConditionalRenderItem = ({
  type,
  description,
  disabled,
  clearInput,
  sortOrder,
  onChangeText,
  onPress,
  value,
}: Props) => {
  return (
    <View>
      {type === 'string' ? (
        <View style={styles.container}>
          <Input
            label={description}
            value={value}
            onChangeText={onChangeText}
            disabled={disabled}
            clearInput={clearInput}
          />
        </View>
      ) : (
        <SelectableInput label={description} value={value} onPress={onPress} disabled={disabled} />
      )}
    </View>
  );
};
