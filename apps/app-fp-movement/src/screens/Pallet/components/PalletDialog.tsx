import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Dialog, Button, TextInput } from 'react-native-paper';
import { LargeText } from '@lib/mobile-ui';
import { barcodeToSvg } from '@adrianso/react-native-barcode-builder';

import * as Print from 'expo-print';

import { round } from '@lib/mobile-hooks';

import { IPalletHead } from '../../../store/types';

interface IProps {
  visible: boolean;
  onOk: (palletHead: IPalletHead) => void;
  onContinue: (palletHead: IPalletHead) => void;
  onCancel: () => void;
  palletHead: IPalletHead | undefined;
  storeMan: string;
  getBarcode: (palletHead: IPalletHead) => string;
  // type: 'add' | 'update';
}

const getHtml = (printedObject: IPalletHead, SVGBarcode: string) => {
  if (!SVGBarcode) {
    return;
  }

  return `
    <html>

    <head>
      <meta name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
      <script src="//code.jquery.com/jquery-latest.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.8.0/dist/JsBarcode.all.min.js"></script>
      <style>
        tr {
          style="padding-vertical: 10px; padding-horizontal: 10px;

        }
      </style>
    </head>

    <body style=" margin: 0; height: 100vh; position: relative;">

      <div style="text-align: center;  display: flex; flex-direction: column-reverse; position: absolute; bottom: 0;">
        <div style="font-size: 32px; font-weight: bold">${printedObject?.barcode || ''}</div>
        <div style="margin-top: 20px;">${SVGBarcode}</div>
        <div>
          <table border="1" style="text-align: center; font-size: 32px; font-weight: bold;">

            <tbody>
              <tr>
                <td>Товар</td>
                <td>${printedObject?.good.name || ''}</td>
              </tr>
              <tr>
                <td>Вес</td>
                <td>${printedObject?.weight || ''}</td>
              </tr>
              <tr>
                <td>Количество коробок</td>
                <td>${printedObject?.quantPack || ''}</td>
              </tr>
              <tr>
                <td>Дата</td>
                <td>${printedObject?.workDate ? new Date(printedObject?.workDate).toLocaleDateString() : '-'}</td>
              </tr>
              <tr>
                <td>Партия</td>
                <td>${printedObject?.numReceived || ''}</td>
              </tr>
               ${
                 printedObject?.toCell
                   ? `<tr>
                <td>Дата постановки</td>
                <td>${printedObject?.storeDate ? new Date(printedObject?.storeDate).toLocaleDateString() : '-'}</td>
              </tr>`
                   : ''
               }
             ${
               printedObject?.toCell
                 ? `<tr>
                <td>Ячейка</td>
                <td>${printedObject?.toCell || '-'}</td>
              </tr>`
                 : ''
             }
              <tr>
                <td>Кладовщик</td>
                <td>${printedObject?.storeMan || ''}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </body>

    </html>
  `;
};

export const print = async (printedObject: IPalletHead, SVGBarcode: string, selectedPrinter?: Print.Printer) => {
  // On iOS/android prints the given html. On web prints the HTML from the current page.
  await Print.printAsync({
    html: getHtml(printedObject, SVGBarcode),
    printerUrl: selectedPrinter?.url, // iOS only
  });
};

export const PalletDialog = ({ visible, onOk, onCancel, storeMan, palletHead, getBarcode, onContinue }: IProps) => {
  const { colors } = useTheme();

  const [selectedPrinter, _] = useState<Print.Printer>();

  const [quantPack, setQuantPack] = useState<string>('');

  const handlePressOk = useCallback(
    async (isForPrint = true) => {
      if (!palletHead) {
        return;
      }
      const newObj: IPalletHead = {
        ...palletHead,
        quantPack: Number(quantPack),
        weight: round(Number(quantPack) * (palletHead?.weight || 1), 3),
      };

      const brc = getBarcode(newObj);

      const newPalletHead: IPalletHead = {
        ...newObj,
        barcode: brc,
        storeMan,
      };

      const SVGBarcode =
        palletHead && palletHead.barcode
          ? barcodeToSvg({
              value: brc,
              width: 500,
              height: 160,
            })
          : '';

      onOk(newPalletHead);

      if (!isForPrint) {
        setQuantPack('');

        return;
      }

      await print(newPalletHead, SVGBarcode, selectedPrinter);
      setQuantPack('');
    },
    [getBarcode, palletHead, onOk, quantPack, selectedPrinter, storeMan],
  );

  const handlePressContinue = () => {
    if (!palletHead) {
      return;
    }
    onContinue(palletHead);
  };

  return (
    <Dialog visible={visible} onDismiss={onCancel}>
      <Dialog.Content>
        <View style={localStyles.titleView}>
          <LargeText style={localStyles.titleText}>Введите количество коробок</LargeText>
        </View>
        <TextInput
          theme={{
            colors: {
              primary: colors.primary,
              text: colors.text,
              placeholder: colors.primary,
            },
          }}
          value={quantPack}
          onChangeText={(text) => setQuantPack(text)}
          right={
            !!quantPack && (
              <TextInput.Icon icon="close" size={20} style={localStyles.marginTop} onPress={() => setQuantPack('')} />
            )
          }
          keyboardType="numeric"
          style={localStyles.height}
        />
      </Dialog.Content>
      <Dialog.Actions style={{ borderColor: colors.primary, flexDirection: 'column' }}>
        <Button
          labelStyle={{ color: colors.primary }}
          color={colors.primary}
          onPress={() => handlePressOk(false)} // disabled={okDisabled}
        >
          Подтвердить
        </Button>
        <Button
          labelStyle={{ color: colors.primary }}
          color={colors.primary}
          onPress={() => handlePressOk()} // disabled={okDisabled}
        >
          Подтвердить и распечатать
        </Button>
        <Button
          labelStyle={{ color: colors.primary }}
          color={colors.primary}
          onPress={onCancel}
          // disabled={cancelDisabled}
        >
          Отмена
        </Button>

        <Button
          labelStyle={{ color: colors.primary }}
          color={colors.primary}
          onPress={() => handlePressContinue()} // disabled={okDisabled}
        >
          Продолжить сканирование
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

const localStyles = StyleSheet.create({
  marginTop: { marginTop: 7 },
  titleView: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  titleText: { fontWeight: '600' },
  height: { height: 40 },
});
