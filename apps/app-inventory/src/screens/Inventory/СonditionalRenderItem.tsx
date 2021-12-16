/* eslint-disable react-native/no-unused-styles */
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
//import { Divider, Subheading, Switch } from 'react-native-paper';

import { ISettingsOptionDoc, SettingsDoc, SettingValueDoc } from '@lib/types';
import { Input, globalStyles as styles, AppInputScreen, SubTitle } from '@lib/mobile-ui';

type Props = {
  type: string;
  value: any;
  sortOrder: number;
  description: string;
  disabled: boolean;
  clearInput: boolean;
  onChangeText: (optionName: string, value: ISettingsOptionDoc) => void;
};

export const ConditionalRenderItem = ({
  type,
  description,
  disabled,
  clearInput,
  sortOrder,
  onChangeText,
  value,
}: Props) => {

  return (
    <View>
      {typeof value === 'string' ? (
        <View style={styles.container}>
          <Input
            label={description}
            value={value}
            onChangeText={() => onChangeText}
            disabled={disabled}
            clearInput={clearInput}
          />
        </View>
      ) : (
        <Input />
      )}
    </View>
  );
};
