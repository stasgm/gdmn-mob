import React from 'react';
import { View } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';

// import colors from '../../styles/colors';

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

const SelectableInput: React.FC<Props> = ({
  value,
  onPress,
  label,
  placeholder,
  editable = false,
  disabled,
  required,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.containerInput}>
        <TextInput
          label={label}
          value={value}
          theme={{
            colors: {
              primary: colors.primary,
              text: colors.text,
              placeholder: colors.primary,
              background: colors.surface,
            },
          }}
          maxLength={35}
          mode="outlined"
          style={styles.input}
          placeholderTextColor={colors.text}
          placeholder={placeholder}
          right={!disabled && <TextInput.Icon name="chevron-right" style={{ marginTop: 14 }} onPress={onPress} />}
          editable={editable}
          disabled={disabled}
        />
      </View>
    </View>
  );
};

export default SelectableInput;
