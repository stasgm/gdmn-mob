import React from 'react';
import { ReturnKeyTypeOptions, View } from 'react-native';
import { MD2Theme, TextInput, useTheme } from 'react-native-paper';

import styles from './styles';

interface Props {
  onChangeText?: (text: string) => void;
  onEndEditing?: () => void;
  onFocus?: () => void;
  value?: string;
  label?: string;
  secureText?: boolean;
  returnKeyType?: ReturnKeyTypeOptions;
  spellCheck?: boolean;
  maxLength?: number;
  autoCorrect?: boolean;
  required?: boolean;
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
  disabled?: boolean;
  clearInput?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | undefined;
  isIcon?: boolean;
  iconName?: any;
  onIconPress?: () => void;
}

const Input = ({
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
  disabled,
  onEndEditing,
  onFocus,
  clearInput,
  autoCapitalize,
  onIconPress,
  isIcon,
  iconName,
}: Props) => {
  const { colors } = useTheme<MD2Theme>();

  return (
    <View style={styles.container}>
      <View style={styles.containerInput}>
        <TextInput
          label={label}
          value={value || ''}
          onChangeText={onChangeText}
          onEndEditing={onEndEditing}
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
          right={
            isIcon && iconName ? (
              <TextInput.Icon icon={iconName} size={20} style={styles.marginTop} onPress={onIconPress} />
            ) : (
              !!value &&
              !!clearInput &&
              !disabled && (
                <TextInput.Icon
                  icon="close"
                  size={20}
                  style={styles.marginTop}
                  onPress={() => onChangeText && onChangeText('')}
                />
              )
            )
          }
          secureTextEntry={secureText}
          spellCheck={spellCheck}
          disabled={disabled}
          editable={editable}
          children={undefined}
          autoCapitalize={autoCapitalize}
          onFocus={onFocus}
        />
      </View>
    </View>
  );
};

export default Input;
