import React from 'react';
import { Button, Dialog, useTheme } from 'react-native-paper';

import globalStyles from '../styles/global';

import { LargeText } from './AppText';

interface IProps {
  visible: boolean;
  title: string;
  text: string;
  onOk: () => void;
  onCancel: () => void;
  okLabel?: string;
  okDisabled?: boolean;
}

export const SimpleDialog = ({ visible, text, onOk, onCancel, okLabel = 'Да', okDisabled = false, title }: IProps) => {
  const { colors } = useTheme();

  return (
    <Dialog visible={visible} onDismiss={onCancel}>
      <Dialog.Title style={globalStyles.text18}>{title}</Dialog.Title>
      <Dialog.Content>
        <LargeText>{text}</LargeText>
      </Dialog.Content>
      <Dialog.Actions style={globalStyles.rowAlignEnd}>
        <Button color={colors.primary} onPress={onOk} disabled={okDisabled}>
          {okLabel}
        </Button>
        <Button color={colors.primary} onPress={onCancel}>
          Отмена
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};
