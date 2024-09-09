import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';

import { MD2Theme, useTheme } from 'react-native-paper';

import Barcode from '@kichiyaki/react-native-barcode-generator';
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

  const html = `
  <html>
    <head>
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"
    />
    </head>
    <body style="text-align: center; margin-top: 20px">
     ${printText}</body>
  </html>
`;

  const print = useCallback(async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    await Print.printAsync({
      html,
    });
  }, [html]);

  return (
    <ViewShot style={localStyles.barcodeView}>
      {barcode ? (
        <Barcode
          format="EAN13"
          value={barcode}
          text={barcode}
          style={localStyles.marginTop5}
          background={colors.background}
          lineColor="black"
          height={40}
          width={2}
        />
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
  marginTop5: {
    marginTop: 5,
  },
  barcodeView: {
    alignItems: 'flex-start',
  },
  button: {
    marginHorizontal: -1,
  },
});
