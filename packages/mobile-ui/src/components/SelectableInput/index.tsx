import React, { useEffect, useState } from 'react';
import { StyleProp, TextStyle, View } from 'react-native';
import { MD2Theme, TextInput, useTheme } from 'react-native-paper';

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
}

const SelectableInput = ({ value, onPress, label, placeholder, editable = false, disabled, style }: Props) => {
  const { dark: isThemeDark, colors } = useTheme<MD2Theme>();
  const [shortValue, setShortValue] = useState(value);

  useEffect(() => {
    setShortValue(value && value.length > 30 ? `${value.substring(0, 30)}...` : value);
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
          mode="outlined"
          style={style ? [styles.input, style] : styles.input}
          placeholderTextColor={colors.text}
          placeholder={placeholder}
          right={
            <TextInput.Icon
              icon="chevron-right"
              size={24}
              style={styles.marginTop}
              onPress={onPress}
              disabled={disabled}
            />
          }
          editable={editable}
          disabled={disabled}
          children={undefined}
        />
      </View>
    </View>
  );
};

export default SelectableInput;
