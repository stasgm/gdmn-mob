import { MediumText, globalStyles } from '@lib/mobile-ui';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Dialog, useTheme } from 'react-native-paper';

import { cellColors } from '../utils/constants';

interface IProps {
  visible: boolean;
  title: string;
  onOk: () => void;
}

export const InfoDialog = ({ visible, onOk, title }: IProps) => {
  const { colors } = useTheme();

  return (
    <Dialog visible={visible} onDismiss={onOk}>
      <Dialog.Title style={globalStyles.text18}>{title}</Dialog.Title>
      <Dialog.Content>
        <View style={localStyles.cell}>
          <View style={[localStyles.buttons, { backgroundColor: cellColors.free }]} />
          <MediumText style={localStyles.text}>свободна</MediumText>
        </View>
        <View style={localStyles.cell}>
          <View style={[localStyles.buttons, { backgroundColor: cellColors.barcode }]} />
          <MediumText style={localStyles.text}>занята</MediumText>
        </View>
        <View style={localStyles.cell}>
          <View style={[localStyles.buttons, { backgroundColor: cellColors.default }]} />
          <MediumText style={localStyles.text}>рекомендуемая</MediumText>
        </View>
        <View style={localStyles.cell}>
          <View style={[localStyles.buttons, { backgroundColor: colors.backdrop }]} />
          <MediumText style={localStyles.text}>недоступна</MediumText>
        </View>
        <View style={localStyles.cell}>
          <View style={[localStyles.buttons, { backgroundColor: colors.error }]} />
          <MediumText style={localStyles.text}>редактируемая</MediumText>
        </View>
      </Dialog.Content>
      <Dialog.Actions style={globalStyles.rowAlignEnd}>
        <Button color={colors.primary} onPress={onOk}>
          OK
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

const localStyles = StyleSheet.create({
  buttons: {
    padding: 4,
    borderRadius: 4,
    margin: 3,
    textAlign: 'center',
    height: 35,
    width: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { marginLeft: 2, width: '85%' },
  cell: { alignItems: 'center', flexDirection: 'row' },
});
