import React, { useEffect, useRef, useState } from 'react';
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

  // const ref = useRef<TextInput>(null);

  // useEffect(() => {
  // ref.current?.focus();
  //TODO временное решение
  // ref?.current &&
  //   setTimeout(() => {
  //     ref.current?.focus();
  //   }, 1000);
  // }, []);

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

  const textStyle = [localStyles.text, { color: colors.text }];

  return (
    <TextInput
      ref={inputRef}
      value={goodQty}
      style={textStyle}
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
