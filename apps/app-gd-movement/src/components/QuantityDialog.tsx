import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Button, Dialog, TextInput, MD2Theme, useTheme } from 'react-native-paper';

import { MediumText, globalStyles } from '@lib/mobile-ui';

import { ICellMovementLine } from '../store/types';

interface IProps {
  visible: boolean;
  line: ICellMovementLine | null;
  onConfirm: (line: ICellMovementLine) => void;
  onCancel: () => void;
}

export const QuantityDialog = ({ visible, line, onConfirm, onCancel }: IProps) => {
  const { colors } = useTheme<MD2Theme>();
  const [quantityStr, setQuantityStr] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (visible && line) {
      setQuantityStr(String(line.quantity ?? 1));
      setErrorMessage('');
    }
  }, [visible, line]);

  const handleOk = () => {
    const parsed = parseInt(quantityStr, 10);
    if (isNaN(parsed) || parsed < 1) {
      setErrorMessage('Введите корректное количество (число ≥ 1).');
      return;
    }
    if (line) {
      onConfirm({ ...line, quantity: parsed });
    }
  };

  if (!line) {
    return null;
  }

  return (
    <Dialog visible={visible} onDismiss={onCancel}>
      <Dialog.Title style={globalStyles.text18}>Количество</Dialog.Title>
      <Dialog.Content>
        <MediumText style={localStyles.goodName}>{line.good?.name ?? 'Товар'}</MediumText>
        <TextInput
          label="Количество"
          value={quantityStr}
          onChangeText={(text) => {
            setQuantityStr(text);
            setErrorMessage('');
          }}
          keyboardType="number-pad"
          mode="outlined"
          style={localStyles.input}
          theme={{
            colors: {
              primary: colors.primary,
              text: colors.text,
              placeholder: colors.placeholder,
            },
          }}
        />
        {!!errorMessage && <Text style={localStyles.error}>{errorMessage}</Text>}
      </Dialog.Content>
      <Dialog.Actions style={globalStyles.rowAlignEnd}>
        <Button color={colors.primary} onPress={handleOk}>
          OK
        </Button>
        <Button color={colors.primary} onPress={onCancel}>
          Отмена
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

const localStyles = StyleSheet.create({
  goodName: {
    marginBottom: 12,
  },
  input: {
    backgroundColor: 'transparent',
  },
  error: {
    color: '#B00020',
    marginTop: 4,
    fontSize: 12,
  },
});
