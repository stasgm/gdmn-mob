import { IListItem } from '@lib/mobile-types';
import React, { ReactNode, useCallback, useState } from 'react';
import { StyleSheet, View, Text, LogBox } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { IconButton, Menu, useTheme } from 'react-native-paper';

interface Props {
  options: IListItem[];
  activeOptionId?: string;
  visible?: any;
  onChange: (option: IListItem) => void;
  onPress: () => void;
  onDismiss: () => void;
  title: string;
  disabled?: boolean;
}

LogBox.ignoreAllLogs();

const MenuItem = ({ options, activeOptionId, onChange, visible, onPress, onDismiss, title, disabled }: Props) => {
  const { colors } = useTheme();
  return (
    <View style={localStyles.container}>
      <Menu
        visible={visible}
        onDismiss={onDismiss}
        anchor={
          <View style={localStyles.menu}>
            <TouchableOpacity onPress={onPress} disabled={disabled}>
              <Text style={[{ color: disabled ? colors.disabled : colors.primary }]}>{title}</Text>
            </TouchableOpacity>
            <IconButton icon={'chevron-down'} size={25} onPress={onPress} disabled={disabled} />
          </View>
        }
      >
        {options.map((option) => {
          return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <IconButton
                icon={activeOptionId === option.id ? 'check' : ''}
                size={20}
                onPress={onPress}
                disabled={disabled}
              />
              <Menu.Item onPress={() => onChange(option)} title={option.value} key={option.id} />
            </View>
          );
        })}
      </Menu>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  menu: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export { MenuItem };
