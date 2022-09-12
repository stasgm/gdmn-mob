import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Text } from 'react-native';
import { Dialog, Button, TextInput } from 'react-native-paper';

interface IProps {
  visible: boolean;
  text: string;
  onChangeText: (text: string) => void;
  onOk: () => void;
  onCancel: () => void;
  okLabel?: string;
  errorMessage?: string;
  title: string;
}

const AppDialog = ({ visible, text, onChangeText, onOk, onCancel, errorMessage, okLabel = 'Ок', title }: IProps) => {
  const { colors } = useTheme();
  return (
    <Dialog visible={visible} onDismiss={onCancel}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>
        <TextInput
          theme={{
            colors: {
              primary: colors.primary,
              text: colors.text,
              placeholder: colors.primary,
            },
          }}
          value={text}
          onChangeText={(text) => onChangeText(text)}
          autoFocus
          right={
            !!text && (
              <TextInput.Icon name="close" size={20} style={{ marginTop: 14 }} onPress={() => onChangeText('')} />
            )
          }
        />
        {!!errorMessage && <Text style={{ color: colors.notification }}>{errorMessage}</Text>}
      </Dialog.Content>
      <Dialog.Actions style={{ borderColor: colors.primary }}>
        <Button labelStyle={{ color: colors.primary }} color={colors.primary} onPress={onCancel}>
          Отмена
        </Button>
        <Button labelStyle={{ color: colors.primary }} color={colors.primary} onPress={onOk}>
          {okLabel}
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default AppDialog;
