import React from 'react';
import { StyleSheet } from 'react-native';

import { MD2Theme, useTheme } from 'react-native-paper';

import Barcode from '@kichiyaki/react-native-barcode-generator';

import ViewShot from 'react-native-view-shot';

interface IProps {
  barcode: string;
}

export const BarcodeImage = ({ barcode }: IProps) => {
  const { colors } = useTheme<MD2Theme>();

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
});
