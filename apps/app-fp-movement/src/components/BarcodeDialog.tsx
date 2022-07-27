import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Text } from 'react-native';
import { Dialog, Button, TextInput } from 'react-native-paper';

interface IProps {
  visibleDialog: boolean;
  onDismissDialog: () => void;
  barcode: string;
  onChangeBarcode: (text: string) => void;
  onSearch: () => void;
  onDismiss: () => void;
  errorMessage: string;
}

const BarcodeDialog = ({
  visibleDialog,
  onDismissDialog,
  barcode,
  onChangeBarcode,
  onSearch,
  onDismiss,
  errorMessage,
}: IProps) => {
  const { colors } = useTheme();
  return (
    <Dialog visible={visibleDialog} onDismiss={onDismissDialog}>
      <Dialog.Title>Введите штрих-код</Dialog.Title>
      <Dialog.Content>
        <TextInput
          theme={{
            colors: {
              primary: colors.primary,
              text: colors.text,
              placeholder: colors.primary,
            },
          }}
          value={barcode}
          onChangeText={(text) => onChangeBarcode(text)}
        />
      </Dialog.Content>
      {errorMessage ? (
        <Dialog.Content>
          <Text>{errorMessage}</Text>
        </Dialog.Content>
      ) : null}
      <Dialog.Actions style={{ borderColor: colors.primary }}>
        <Button labelStyle={{ color: colors.primary }} color={colors.primary} onPress={onDismiss}>
          Отмена
        </Button>
        <Button labelStyle={{ color: colors.primary }} color={colors.primary} onPress={onSearch}>
          Добавить
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default BarcodeDialog;
