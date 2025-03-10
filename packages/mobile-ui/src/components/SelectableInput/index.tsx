import React, { useEffect, useState } from 'react';
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
}

// const truncate = (str: string, l: number | undefined = 40) => (str.length > l ? `${str.substring(0, l)}...` : str);

const SelectableInput = ({
  value,
  onPress,
  label,
  placeholder,
  editable = false,
  disabled,
  style,
  iconViewStyle,
  mode = 'outlined',
}: Props) => {
  const { dark: isThemeDark, colors } = useTheme<MD2Theme>();
  const [shortValue, setShortValue] = useState(value);

  useEffect(() => {
    setShortValue(value && value.length > 30 ? `${value.substring(0, 30)}...` : value || '');
  }, [value]);

  return (
    <View style={styles.container}>
      <View style={styles.containerInput}>
        <TextInput
          label={label}
          value={shortValue}
          theme={{
            dark: isThemeDark,
            mode: 'adaptive',
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
          right={<TextInput.Icon icon="chevron-right" size={24} onPress={onPress} disabled={disabled} />}
          editable={editable}
          disabled={disabled}
          children={undefined}
        />
      </View>
      <View style={iconViewStyle ? iconViewStyle : buttonStyles.viewRight_24}>
        <IconButton icon="chevron-right" size={24} style={buttonStyles.icon_24} onPress={onPress} disabled={disabled} />
      </View>
    </View>
  );
};

export default SelectableInput;
