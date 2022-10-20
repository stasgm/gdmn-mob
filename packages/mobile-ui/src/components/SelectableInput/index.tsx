import React from 'react';
import { StyleProp, TextStyle, View } from 'react-native';
import { IconButton, TextInput, useTheme } from 'react-native-paper';

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
}

const truncate = (str: string, l: number | undefined = 40) => (str.length > l ? `${str.substring(0, l)}...` : str);

const SelectableInput = ({ value, onPress, label, placeholder, editable = false, disabled, style }: Props) => {
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
          style={style ? [styles.input, style] : styles.input}
          placeholderTextColor={colors.text}
          placeholder={placeholder}
          editable={editable}
          disabled={disabled}
          children={undefined}
        />
      </View>
      <View style={buttonStyles.viewRight_24}>
        <IconButton icon="chevron-right" size={24} style={buttonStyles.icon_24} onPress={onPress} disabled={disabled} />
      </View>
    </View>
  );
};

export default SelectableInput;
