import { IListItem } from '@lib/mobile-types';
import React from 'react';
import { StyleSheet, View, Text, LogBox, StyleProp, ViewStyle, ColorValue } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { IconButton, Menu as PaperMenu, useTheme } from 'react-native-paper';

interface Props {
  options: any;
  activeOptionId?: string;
  visible?: any;
  onChange: (option: IListItem) => void;
  onPress: () => void;
  onDismiss: () => void;
  title: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  menuStyle?: StyleProp<ViewStyle>;
  textColor?: /*ColorValue*/ string;
}

LogBox.ignoreAllLogs();

const Menu = ({
  options,
  activeOptionId,
  onChange,
  visible,
  onPress,
  onDismiss,
  title,
  disabled,
  style,
  menuStyle,
  textColor,
}: Props) => {
  const { colors } = useTheme();
  return (
    <View style={style ? style : localStyles.container}>
      <PaperMenu
        visible={visible}
        onDismiss={onDismiss}
        anchor={
          <View style={menuStyle ? menuStyle : localStyles.menu}>
            <TouchableOpacity onPress={onPress} disabled={disabled}>
              <Text style={[{ color: textColor ? textColor : disabled ? colors.disabled : colors.primary }]}>
                {title}
              </Text>
            </TouchableOpacity>
            <IconButton
              icon={'chevron-down'}
              size={25}
              onPress={onPress}
              disabled={disabled}
              color={textColor ? textColor : disabled ? colors.disabled : colors.primary}
            />
          </View>
        }
      >
        {options.map((option: any) => (
          <View key={option?.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <IconButton
              icon={activeOptionId === option?.id ? 'check' : ''}
              size={20}
              onPress={onPress}
              disabled={disabled}
            />
            <PaperMenu.Item onPress={() => onChange(option)} title={option?.value} key={option?.id} />
          </View>
        ))}
      </PaperMenu>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    // paddingLeft: 10,
  },
  menu: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default Menu;
