import React from 'react';
import { ReturnKeyTypeOptions, View } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';

import styles from './styles';

interface Props {
  onChangeText?: ((text: string) => void) | undefined;
  value?: string;
  label?: string;
  secureText?: boolean;
  returnKeyType?: ReturnKeyTypeOptions;
  spellCheck?: boolean;
  maxLength?: number;
  autoCorrect?: boolean;
  keyboardType?:
  | 'default'
  | 'email-address'
  | 'numeric'
  | 'phone-pad'
  | 'number-pad'
  | 'decimal-pad'
  | 'visible-password'
  | 'ascii-capable'
  | 'numbers-and-punctuation'
  | 'url'
  | 'name-phone-pad'
  | 'twitter'
  | 'web-search'
  | undefined;
  editable?: boolean;
}

const Input: React.FC<Props> = ({
  value,
  onChangeText,
  secureText,
  spellCheck,
  label,
  maxLength,
  autoCorrect,
  keyboardType,
  returnKeyType,
  editable,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.containerInput}>
        <TextInput
          label={label}
          value={value}
          onChangeText={onChangeText}
          theme={{
            colors: {
              primary: colors.primary,
              text: colors.text,
              placeholder: colors.primary,
              background: colors.surface,
            },
          }}
          mode="outlined"
          returnKeyType={returnKeyType}
          keyboardType={keyboardType}
          autoCorrect={autoCorrect}
          style={styles.input}
          maxLength={maxLength}
          placeholderTextColor={colors.text}
          secureTextEntry={secureText}
          spellCheck={spellCheck}
          editable={editable}
        />
      </View>
    </View>
  );
};

export default Input;
