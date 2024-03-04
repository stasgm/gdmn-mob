import React, { useEffect, useState } from 'react';
import { TextInput, StyleSheet } from 'react-native';
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goodQty]);

  const handleChange = (text: string) => {
    setGoodQty((prev) => {
      text = text.replace(',', '.');

      text = !text.includes('.') ? parseFloat(text).toString() : text;
      text = Number.isNaN(parseFloat(text)) ? '0' : text;

      const validNumber = new RegExp(/^(\d{1,6}(,|.))?\d{0,4}$/);
      return validNumber.test(text) ? text : prev;
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
      onChangeText={handleChange}
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
