import { IListItem } from '@lib/mobile-types';
import React from 'react';
import { StyleSheet, View, Text, StyleProp, ViewStyle, TouchableHighlight } from 'react-native';
import { IconButton, Menu as PaperMenu, useTheme } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';

interface Props {
  options: IListItem[];
  activeOptionId?: string;
  visible?: any;
  onChange: (option: IListItem) => void;
  onPress: () => void;
  onDismiss: () => void;
  title?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  menuStyle?: StyleProp<ViewStyle>;
  isActive?: boolean;
  iconName?: IconSource;
  iconSize?: number;
}

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
  isActive = false,
  iconSize,
  iconName,
}: Props) => {
  const { colors } = useTheme();

  return (
    <View style={[style, isActive && { backgroundColor: colors.primary }]}>
      <PaperMenu
        visible={visible}
        onDismiss={onDismiss}
        anchor={
          <View style={[localStyles.menu, menuStyle]}>
            {title && (
              <Text
                style={{
                  color: isActive ? colors.background : disabled ? colors.disabled : colors.primary,
                  fontSize: 15,
                }}
              >
                {title}
              </Text>
            )}
            {iconName && (
              <IconButton
                icon={iconName}
                size={iconSize || 20}
                onPress={onPress}
                disabled={disabled}
                color={isActive ? colors.background : disabled ? colors.disabled : colors.primary}
              />
            )}
          </View>
        }
      >
        {options?.map((option) => (
          <TouchableHighlight
            activeOpacity={0.7}
            underlayColor="#DDDDDD"
            key={`${title}${option?.id}`}
            onPress={() => onChange(option)}
            disabled={disabled}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <IconButton icon={activeOptionId === option?.id ? 'check' : ''} size={20} />
              <PaperMenu.Item title={option?.value} />
            </View>
          </TouchableHighlight>
        ))}
      </PaperMenu>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  menu: {
    flexDirection: 'row',
    alignItems: 'center',
    display: 'flex',
  },
});

export default Menu;
