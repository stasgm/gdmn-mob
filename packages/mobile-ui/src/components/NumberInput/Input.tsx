import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Text, View, TextInput, Pressable } from 'react-native';
import { styles } from '@lib/mobile-navigation/src/screens/References/styles';

interface IProps {
  label: string;
  value: string;
  isFocus?: boolean;
  onPress: () => void;
}

const Input = ({ label, value, onPress, isFocus = false }: IProps) => {
  const { colors } = useTheme();

  return (
    <View style={styles.item}>
      <Pressable onPress={onPress} style={styles.details}>
        <Text style={[styles.name, { color: isFocus ? colors.primary : colors.text }]}>{label}</Text>
        <TextInput
          style={[styles.number, styles.field, { color: isFocus ? colors.primary : colors.text }]}
          // не отображается курсор
          caretHidden={true}
          // onFocus={onPress}
          // теряется фокус при нажатии на любое место кроме самого поля,
          // т.е. даже при клике по нашей клавиатуре теряет фокус
          //onBlur={onPress}
          editable={false}
          //не будет открываться стандартная клавиатура
          showSoftInputOnFocus={false}
          // autoFocus={isFocused}
          value={value}
        />
      </Pressable>
    </View>
  );
};

export { Input };
