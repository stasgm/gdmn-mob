import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Dialog, MD2Theme, useTheme } from 'react-native-paper';

import { MediumText, globalStyles } from '@lib/mobile-ui';

import { ICellData } from '../store/app/types';
import { IReceiptLine } from '../store/types';

interface IProps {
  visible: boolean;
  cellData: ICellData | null;
  onConfirm: () => void;
  onCancel: () => void;
  lines?: IReceiptLine[];
}

export const CellInfoDialog = ({ visible, cellData, onConfirm, onCancel, lines = [] }: IProps) => {
  const { colors } = useTheme<MD2Theme>();

  const goods = cellData?.goods ?? [];

  const getGoodName = (barcode: string) => {
    const line = lines?.find((l) => l.id === barcode);
    return line?.good?.name ?? barcode;
  };

  return (
    <Dialog visible={visible} onDismiss={onCancel}>
      <Dialog.Title style={globalStyles.text18}>Ячейка {cellData?.name ?? ''}</Dialog.Title>
      <Dialog.Content>
        {goods.length > 0 ? (
          <>
            <MediumText style={localStyles.title}>В ячейке сейчас:</MediumText>
            {goods.map((g, idx) => (
              <View key={`${g.barcode}-${idx}`} style={localStyles.row}>
                <MediumText style={localStyles.barcode}>{getGoodName(g.barcode)}</MediumText>
                <MediumText style={localStyles.quantity}> × {g.quantity}</MediumText>
              </View>
            ))}
            <MediumText style={localStyles.question}>Положить сюда ещё один товар?</MediumText>
          </>
        ) : (
          <MediumText>Ячейка пуста</MediumText>
        )}
      </Dialog.Content>
      <Dialog.Actions style={globalStyles.rowAlignEnd}>
        {goods.length > 0 && (
          <Button color={colors.primary} onPress={onConfirm}>
            Да
          </Button>
        )}
        <Button color={colors.primary} onPress={onCancel}>
          {goods.length > 0 ? 'Отмена' : 'OK'}
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

const localStyles = StyleSheet.create({
  title: {
    marginBottom: 8,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    marginVertical: 2,
  },
  barcode: {
    flex: 1,
  },
  quantity: {
    fontWeight: '600',
  },
  question: {
    marginTop: 12,
  },
});
