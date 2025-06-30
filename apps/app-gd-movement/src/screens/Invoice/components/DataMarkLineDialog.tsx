import { ItemSeparator, LargeText } from '@lib/mobile-ui';
import React from 'react';
import { Button, Dialog, MD2Theme, useTheme } from 'react-native-paper';
import { StyleSheet } from 'react-native';

import { IMovementLine } from '../../../store/types';

interface IProps {
  goodName: string;
  goodValueName?: string;
  onDismissDialog: () => void;
  onEditLine: () => void;
  onAddLine: () => void;
  onDeleteLine: () => void;
  selectedLine?: IMovementLine;
}

export const DocLineDialog = ({
  goodName,
  goodValueName,
  selectedLine,
  onDismissDialog,
  onEditLine,
  onAddLine,
  onDeleteLine,
}: IProps) => {
  const { colors } = useTheme<MD2Theme>();
  const labelStyle = { color: colors.primary };

  return (
    <Dialog visible={true} onDismiss={onDismissDialog}>
      <Dialog.Title style={localStyles.titleSize}>{goodName}</Dialog.Title>
      {selectedLine ? (
        <>
          <Dialog.Content>
            <LargeText>
              Количество: {selectedLine?.quantity} {goodValueName || ''}
            </LargeText>
            <ItemSeparator />
          </Dialog.Content>
          <Dialog.Actions style={localStyles.action}>
            <Button labelStyle={labelStyle} color={colors.primary} onPress={onEditLine}>
              Редактировать позицию
            </Button>
            <Button labelStyle={labelStyle} color={colors.primary} onPress={onDeleteLine}>
              Удалить позицию
            </Button>
            <Button color={colors.primary} onPress={onDismissDialog}>
              Отмена
            </Button>
          </Dialog.Actions>
        </>
      ) : (
        <>
          <Dialog.Actions style={localStyles.action}>
            <Button labelStyle={labelStyle} color={colors.primary} onPress={onAddLine}>
              Добавить позицию
            </Button>
            <Button labelStyle={labelStyle} color={colors.primary} onPress={onDeleteLine}>
              Удалить все позиции
            </Button>
            <Button color={colors.primary} onPress={onDismissDialog}>
              Отмена
            </Button>
          </Dialog.Actions>
        </>
      )}
    </Dialog>
  );
};

const localStyles = StyleSheet.create({
  titleSize: {
    fontSize: 18,
    lineHeight: 18,
  },
  action: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
});
