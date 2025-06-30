import { ItemSeparator, LargeText, MediumText } from '@lib/mobile-ui';
import React from 'react';
import { Button, Dialog, MD2Theme, useTheme } from 'react-native-paper';
import { StyleSheet } from 'react-native';

import { IWaybillLine } from '../../../store/types';

interface IProps {
  visible: boolean;
  item?: IWaybillLine;
  // goodName: string;
  // aggregationCode: string;
  // EID: string;
  onDismissDialog: () => void;
}

export const WaybillDialog = ({ visible = false, item, onDismissDialog }: IProps) => {
  const { colors } = useTheme<MD2Theme>();
  // const labelStyle = { color: colors.primary };

  return (
    <Dialog visible={visible} onDismiss={onDismissDialog}>
      <Dialog.Title style={localStyles.titleSize}>
        {item?.goodId ? item?.goodId || '' : 'Позиция без товара'}
      </Dialog.Title>

      <>
        <Dialog.Content>
          {/* <ItemSeparator /> */}
          {item?.EID ? <LargeText>Код маркировки: {item?.EID || ''}</LargeText> : null}
          {item?.added ? <MediumText style={localStyles.marginTop}>Код маркировки не из ЭТТН</MediumText> : null}
          {item?.aggregationCode ? (
            <LargeText style={localStyles.marginTop}>Код упаковки: {item?.aggregationCode || ''}</LargeText>
          ) : null}
          {/* <ItemSeparator /> */}
        </Dialog.Content>
        <Dialog.Actions style={localStyles.action}>
          <Button color={colors.primary} onPress={onDismissDialog}>
            ОК
          </Button>
        </Dialog.Actions>
      </>
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
  marginTop: { marginTop: 5 },
});
