import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { IListItem } from '@lib/mobile-types';
import React, { ReactNode, useCallback } from 'react';
import { StyleSheet, View, Text, LogBox } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { IconButton, Menu, useTheme } from 'react-native-paper';

import colors from '../styles/colors';

interface IProps {
  sheetRef?: React.RefObject<BottomSheetModalMethods>;
  children?: ReactNode;
  title?: string;
  snapPoints?: string[];
  onDismiss?: () => void;
  onApply?: () => void;
}

type Props = {
  options: IListItem[];
  activeOptionId?: string;
  visible?: any;
  onChange: (option: IListItem) => void;
  onPress?: () => void;
  onDismiss?: () => void;
  title?: string;
  disabled?: boolean;
};

LogBox.ignoreAllLogs();

// const Menu = ({ sheetRef, children, title, snapPoints = ['40%', '90%'], onDismiss, onApply }: IProps) => {
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
            <View>
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
