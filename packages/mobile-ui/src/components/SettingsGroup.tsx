import React from 'react';
import { ISettingsOption } from '@lib/types';
import { View, StyleSheet } from 'react-native';
import { Divider, useTheme } from 'react-native-paper';

import SettingsItem from './SettingsItem';
import { LargeText } from './AppText';

type Props = {
  groupDescription?: string;
  list: any[];
  onValueChange: (optionName: string, value: ISettingsOption) => void;
};

const SettingsGroup = ({ groupDescription, list, onValueChange }: Props) => {
  return (
    <View>
      {groupDescription ? (
        <View>
          <LargeText style={localStyles.title}>{groupDescription}</LargeText>
        </View>
      ) : null}
      <View>
        {list.map(([key, item]) => {
          return (
            <View key={key}>
              <Divider />

              <SettingsItem
                key={key}
                label={item.description || key}
                value={item.data}
                onValueChange={(newValue) => onValueChange(key, { ...item, data: newValue })}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  border: {
    borderWidth: 1,
    borderRadius: 2,
    marginHorizontal: 5,
  },
  title: {
    margin: 3,
    textAlign: 'center',
  },
  container: {
    marginTop: 5,
  },
});

export default SettingsGroup;
