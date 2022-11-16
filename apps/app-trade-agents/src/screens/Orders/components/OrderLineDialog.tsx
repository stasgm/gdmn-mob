import { ItemSeparator, LargeText, globalStyles as styles } from '@lib/mobile-ui';
import React from 'react';
import { Button, Dialog, useTheme } from 'react-native-paper';

import { IOrderLine } from '../../../store/types';

interface IProps {
  goodName: string;
  onDismissDialog: () => void;
  onEditLine: () => void;
  onAddLine: () => void;
  onDeleteLine: () => void;
  selectedLine?: IOrderLine;
}

export const OrderLineDialog = ({
  goodName,
  selectedLine,
  onDismissDialog,
  onEditLine,
  onAddLine,
  onDeleteLine,
}: IProps) => {
  const { colors } = useTheme();
  const labelStyle = { color: colors.primary };

  return (
    <Dialog visible={true} onDismiss={onDismissDialog}>
      <Dialog.Title style={styles.text18}>{goodName}</Dialog.Title>
      {selectedLine ? (
        <>
          <Dialog.Content>
            <LargeText>Количество: {selectedLine?.quantity} кг</LargeText>
            <LargeText>Упаковка: {selectedLine?.package ? selectedLine.package.name : 'без упаковки'}</LargeText>
            <ItemSeparator />
          </Dialog.Content>
          <Dialog.Actions style={styles.columnAlignEnd}>
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
          <Dialog.Actions style={styles.columnAlignEnd}>
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
