import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { MD2Theme, useTheme } from 'react-native-paper';

import Barcode, { barcodeToSvg } from '@adrianso/react-native-barcode-builder';
import * as Print from 'expo-print';

import ViewShot from 'react-native-view-shot';
import { MediumText, PrimeButton } from '@lib/mobile-ui';

interface IProps {
  barcode: string;
  isPrint?: boolean;
  printText?: string;
}

export const BarcodeImage = ({ barcode, isPrint = false, printText }: IProps) => {
  const { colors } = useTheme<MD2Theme>();

  const SVGBarcode = barcodeToSvg({
    value: barcode,
    width: 500,
    height: 200,
  });

  const html = `
  <html>
    <head>
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"
    />
    </head>
    <body style="text-align: center; margin-top: 20px">
      <h1 style="font-size: 30px; font-family: Helvetica Neue; font-weight: normal;">${printText}</h1>
      <div>${SVGBarcode}</div>
      <h1 style="font-size: 30px; font-family: Helvetica Neue; font-weight: normal;">${barcode}</h1>
    </body>
  </html>
`;

  const print = useCallback(async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    await Print.printAsync({
      html,
    });
  }, [html]);

  return (
    <ViewShot style={localStyles.containerBarcode}>
      {barcode ? (
        <View style={localStyles.barcodeView}>
          <Barcode
            value={barcode}
            style={{ ...localStyles.barcode, backgroundColor: colors.background }}
            lineColor="black"
          />
          <MediumText>{barcode}</MediumText>
        </View>
      ) : null}
      {isPrint && (
        <PrimeButton icon="printer-outline" onPress={print} outlined style={localStyles.button}>
          <MediumText>Печать</MediumText>
        </PrimeButton>
      )}
    </ViewShot>
  );
};

const localStyles = StyleSheet.create({
  barcode: {
    marginTop: 5,
    width: 140,
    height: 70,
  },
  barcodeView: {
    alignItems: 'center',
  },
  button: {
    marginHorizontal: -1,
  },
  containerBarcode: {
    alignItems: 'flex-start',
  },
});
