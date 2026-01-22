import { MediumText, globalStyles } from '@lib/mobile-ui';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Dialog, MD2Theme, useTheme } from 'react-native-paper';

import { IOrderLine } from '../../../store/types';

interface IProps {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  lines: IOrderLine[];
}

export const OrderCopyDialog = ({ visible, onOk, lines, onCancel }: IProps) => {
  const { colors } = useTheme<MD2Theme>();

  return (
    <Dialog visible={visible} onDismiss={onOk} dismissable={false}>
      <Dialog.Title style={globalStyles.text18}>Внимание!</Dialog.Title>
      <Dialog.Content>
        <MediumText style={[localStyles.text, localStyles.marginBottom]}>
          В справочнике отсутствуют следующие товары:
        </MediumText>
        {lines.map((line) => (
          <View style={localStyles.cell} key={line.id}>
            <MediumText style={localStyles.text}>
              - {line.good.name} {line.quantity}, уп.: {line.package?.name}
            </MediumText>
          </View>
        ))}
        <MediumText style={[localStyles.text, localStyles.marginTop]}>Копировать остальные позиции?</MediumText>
      </Dialog.Content>
      <Dialog.Actions style={globalStyles.rowAlignEnd}>
        <Button color={colors.primary} onPress={onOk}>
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
  text: { marginLeft: 2, width: '85%' },
  marginTop: { marginTop: 4 },
  cell: { alignItems: 'center', flexDirection: 'row', marginLeft: 10 },
  marginBottom: { marginBottom: 4 },
});
