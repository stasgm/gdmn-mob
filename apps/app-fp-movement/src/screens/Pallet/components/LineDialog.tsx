import { globalStyles, LargeText } from '@lib/mobile-ui';
import React from 'react';
import { Button, Dialog, MD2Theme, useTheme } from 'react-native-paper';

// import globalStyles from '../styles/global';

interface IProps {
  visible: boolean;
  title: string;
  text: string;
  onPrint: () => void;
  onCellSet: () => void;
  onCancel: () => void;
  okLabel?: string;
  okDisabled?: boolean;
}

export const LineDialog = ({ visible, text, onPrint, onCellSet, onCancel, okDisabled = false, title }: IProps) => {
  const { colors } = useTheme<MD2Theme>();

  return (
    <Dialog visible={visible} onDismiss={onCancel}>
      <Dialog.Title style={globalStyles.text18}>{title}</Dialog.Title>
      <Dialog.Content>
        <LargeText>{text}</LargeText>
      </Dialog.Content>
      <Dialog.Actions style={globalStyles.columnAlignEnd}>
        <Button color={colors.primary} onPress={onPrint} disabled={okDisabled}>
          Распечатать код
        </Button>
        <Button color={colors.primary} onPress={onCellSet}>
          Поставить в ячейку
        </Button>
        <Button color={colors.primary} onPress={onCancel}>
          Отмена
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};
