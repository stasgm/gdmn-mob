import React from 'react';
import { View } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';

import styles from './styles';

interface Props {
  onPress?: () => void;
  value?: string;
  label?: string;
  placeholder?: string;
  editable?: boolean;
  disabled?: boolean;
  required?: boolean;
}

const truncate = (str: string, l: number | undefined = 40) => (str.length > l ? `${str.substring(0, l)}...` : str);

const SelectableInput = ({ value, onPress, label, placeholder, editable = false, disabled }: Props) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.containerInput}>
        <TextInput
          label={label}
          value={truncate(value || '', 35)}
          theme={{
            colors: {
              primary: colors.primary,
              text: colors.text,
              placeholder: colors.primary,
              background: colors.surface,
            },
          }}
          mode="outlined"
          style={styles.input}
          placeholderTextColor={colors.text}
          placeholder={placeholder}
          right={!disabled && <TextInput.Icon name="chevron-right" style={{ marginTop: 14 }} onPress={onPress} />}
          editable={editable}
          disabled={disabled}
          children={undefined}
        />
      </View>
    </View>
  );
};

export default SelectableInput;
