import { LargeText, MediumText } from '@lib/mobile-ui';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Dialog, MD2Theme, TextInput, useTheme } from 'react-native-paper';
import { StyleSheet, Text } from 'react-native';

import { IWaybillLine } from '../../../store/types';

interface IProps {
  visible: boolean;
  item?: IWaybillLine;
  // goodName: string;
  // aggregationCode: string;
  // EID: string;
  onDismissDialog: () => void;
  onOk: (quantity?: number) => void;
}

export const WaybillDialog = ({ visible = false, item, onDismissDialog, onOk }: IProps) => {
  const { colors } = useTheme<MD2Theme>();

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [quantity, setQuantity] = useState<string>(
    item?.checkedQuantity || item?.checkedQuantity === 0 ? item?.checkedQuantity?.toString() : '',
  );
  useEffect(() => {
    if (item?.checkedQuantity) {
      setQuantity(item?.checkedQuantity?.toString());
    } else {
      setQuantity('0');
    }
  }, [item?.checkedQuantity]);
  console.log('item?.checkedQuantity', item?.checkedQuantity);
  const checkWeightIsNaN = (text: string) => {
    let newValue = text.replace(',', '.');
    newValue = !newValue.includes('.') ? parseFloat(newValue).toString() : newValue;
    return Number.isNaN(parseFloat(newValue));
  };
  const handleOnOk = useCallback(() => {
    if (checkWeightIsNaN(quantity)) {
      setErrorMessage('Не числовой формат. Проверьте правильность введенных данных.');
    } else {
      onOk(Number(quantity));
    }
  }, [onOk, quantity]);

  return (
    <Dialog visible={visible} onDismiss={onDismissDialog}>
      <Dialog.Title style={localStyles.titleSize}>
        {item?.goodId ? item?.goodId || '' : item?.description ? item?.description : 'Позиция без товара'}
      </Dialog.Title>

      <>
        <Dialog.Content>
          {item?.EID ? <LargeText>Код маркировки: {item?.EID || ''}</LargeText> : null}
          {item?.added ? <MediumText style={localStyles.marginTop}>Код маркировки не из ЭТТН</MediumText> : null}
          {item?.aggregationCode ? (
            <LargeText style={localStyles.marginTop}>Код упаковки: {item?.aggregationCode || ''}</LargeText>
          ) : null}
          {item?.barcode ? <LargeText>Штрихкод: {item?.barcode || ''}</LargeText> : null}
          {item?.quantity ? <LargeText>Количество: {item?.quantity || ''}</LargeText> : null}
          {item?.checkedQuantity ? <LargeText>Отсканировано: {item?.checkedQuantity || ''}</LargeText> : null}
          <TextInput
            theme={{
              colors: {
                primary: colors.primary,
                text: colors.text,
                placeholder: colors.primary,
              },
            }}
            value={quantity || ''}
            onChangeText={(text) => setQuantity(text)}
            right={
              !!quantity && (
                <TextInput.Icon icon="close" size={20} style={localStyles.marginTop} onPress={() => setQuantity('')} />
              )
            }
            keyboardType="numeric"
            style={localStyles.height}
          />
          {!!errorMessage && <Text style={{ color: colors.notification }}>{errorMessage}</Text>}

          {/* <ItemSeparator /> */}
        </Dialog.Content>
        <Dialog.Actions style={localStyles.action}>
          <Button color={colors.primary} onPress={handleOnOk}>
            ОК
          </Button>
          <Button color={colors.primary} onPress={onDismissDialog}>
            Отмена
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
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  marginTop: { marginTop: 5 },

  height: { height: 40 },
});
