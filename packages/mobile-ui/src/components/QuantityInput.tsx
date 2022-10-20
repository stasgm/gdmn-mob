import React, { useEffect, useState } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { useTheme } from '@react-navigation/native';

interface IProps {
  inputRef: React.RefObject<TextInput>;
  value: string;
  onChangeText: (newValue: string) => void;
}

const QuantityInput = (props: IProps) => {
  const { colors } = useTheme();
  const { value, onChangeText, inputRef, ...rest } = props;
  const [goodQty, setGoodQty] = useState<string>(value);

  useEffect(() => {
    if (value !== goodQty) {
      onChangeText(goodQty);
    }
  }, [goodQty]);

  const handelChange = (value: string) => {
    setGoodQty((prev) => {
      value = value.replace(',', '.');

      value = !value.includes('.') ? parseFloat(value).toString() : value;
      value = Number.isNaN(parseFloat(value)) ? '0' : value;

      const validNumber = new RegExp(/^(\d{1,6}(,|.))?\d{0,4}$/);
      return validNumber.test(value) ? value : prev;
    });
  };

  return (
    <TextInput
      ref={inputRef}
      value={goodQty}
      defaultValue={'0'}
      style={[localStyles.text, { color: colors.text }]}
      keyboardType="numeric"
      autoCapitalize="words"
      onChangeText={handelChange}
      returnKeyType="done"
      {...rest}
    />
  );
};

const localStyles = StyleSheet.create({
  text: {
    fontSize: 17,
    opacity: 0.7,
    textAlign: 'left',
  },
});

export default QuantityInput;
