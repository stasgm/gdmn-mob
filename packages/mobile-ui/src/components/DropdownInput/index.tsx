import React from 'react';
import { StyleProp, TextStyle, View } from 'react-native';
import { IconButton, MD2Theme, TextInput, TextInputProps, useTheme } from 'react-native-paper';

import buttonStyles from '../../styles/buttonRippleStyle';

import styles from './styles';

interface Props {
  onPress?: () => void;
  value?: string;
  label?: string;
  placeholder?: string;
  editable?: boolean;
  disabled?: boolean;
  required?: boolean;
  style?: StyleProp<TextStyle>;
  iconViewStyle?: StyleProp<TextStyle>;
  mode?: 'flat' | 'outlined';
  props?: TextInputProps;
  isShownList?: boolean;
}

const truncate = (str: string, l: number | undefined = 40) => (str.length > l ? `${str.substring(0, l)}...` : str);

const DropdownInput = ({
  value,
  onPress,
  label,
  placeholder,
  editable = false,
  disabled,
  style,
  iconViewStyle,
  mode = 'outlined',
  isShownList = false,
}: Props) => {
  const { colors } = useTheme<MD2Theme>();

  return (
    <View style={styles.container}>
      <View style={styles.containerInput}>
        <TextInput
          label={label}
          // value={shortValue}
          value={truncate(value || '', 19)}
          theme={{
            colors: {
              primary: colors.primary,
              text: colors.text,
              placeholder: colors.primary,
              background: colors.surface,
            },
          }}
          mode={mode ? mode : 'outlined'}
          style={style ? [styles.input, style] : styles.input}
          placeholderTextColor={colors.text}
          placeholder={placeholder}
          editable={editable}
          disabled={disabled}
          children={undefined}
        />
      </View>
      <View style={iconViewStyle ? iconViewStyle : buttonStyles.viewRight_24}>
        <IconButton
          icon={isShownList ? 'chevron-up' : 'chevron-down'}
          size={24}
          style={buttonStyles.icon_24}
          onPress={onPress}
          disabled={disabled}
        />
      </View>
    </View>
  );
};

export default DropdownInput;
