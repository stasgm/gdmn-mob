import { INamedEntity, ISettingsOption, Settings, SettingValue } from '@lib/types';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Divider, useTheme } from 'react-native-paper';

import { settingsActions, useDispatch } from '@lib/store';

import SettingsItem from './SettingsItem';

type Props = {
  group: INamedEntity;
  data: Settings<Record<string, SettingValue>>;
};

const SettingsGroup = ({ group, data }: Props) => {
  const dispatch = useDispatch();
  const handleUpdate = (optionName: string, value: ISettingsOption) => {
    dispatch(settingsActions.updateOption({ optionName, value }));
  };
  const { colors } = useTheme();
  return (
    <View style={[localStyles.container]}>
      <View>
        <Text style={[localStyles.title]}>{group.name}</Text>
      </View>
      <View style={[localStyles.border, { borderColor: colors.primary }]}>
        {Object.entries(data)
          .filter(([_, item]) => item?.visible && item.group?.id === group.id)
          .sort(([, itema], [, itemb]) => (itema?.sortOrder || 0) - (itemb?.sortOrder || 0))
          .map(([key, item]) => {
            return item ? (
              <View key={key}>
                <SettingsItem
                  key={key}
                  label={item.description || key}
                  value={item.data}
                  onValueChange={(newValue) => handleUpdate(key, { ...item, data: newValue })}
                />
                <Divider />
              </View>
            ) : null;
          })}
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  border: {
    borderWidth: 1,
    borderRadius: 2,
  },

  title: {
    margin: 3,
    fontSize: 18,
    textAlign: 'center',
  },
  container: {
    marginTop: 5,
  },
});

export default SettingsGroup;
