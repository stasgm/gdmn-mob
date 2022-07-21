import React from 'react';
import { INamedEntity, ISettingsOption } from '@lib/types';
import { View, StyleSheet } from 'react-native';
import { Divider, useTheme } from 'react-native-paper';

import SettingsItem from './SettingsItem';
import { LargeText } from './AppText';

type Props = {
  group: INamedEntity;
  list: any[];
  onValueChange: (optionName: string, value: ISettingsOption) => void;
};

const SettingsGroup = ({ group, list, onValueChange }: Props) => {
  const { colors } = useTheme();
  return (
    <View style={localStyles.container}>
      <View>
        <LargeText style={localStyles.title}>{group.name}</LargeText>
      </View>
      <View style={[localStyles.border, { borderColor: colors.primary }]}>
        {list.map(([key, item]) => {
          return (
            <View key={key}>
              <SettingsItem
                key={key}
                label={item.description || key}
                value={item.data}
                onValueChange={(newValue) => onValueChange(key, { ...item, data: newValue })}
              />
              <Divider />
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
