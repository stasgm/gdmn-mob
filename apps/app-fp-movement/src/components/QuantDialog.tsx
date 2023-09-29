import React from 'react';
import { KeyboardTypeOptions, Text, View, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Dialog, Button, TextInput } from 'react-native-paper';
import { LargeText } from '@lib/mobile-ui';

interface IProps {
  visible: boolean;
  textPack: string;
  textPallet: string;
  onChangeTextPack: (text: string) => void;
  onChangeTextPallet: (text: string) => void;
  onOk: () => void;
  onCancel: () => void;
  okLabel?: string;
  errorMessage?: string;
  okDisabled?: boolean;
  cancelDisabled?: boolean;
  keyboardType?: KeyboardTypeOptions;
  isPack: boolean;
}

const QuantDialog = ({
  visible,
  textPack,
  textPallet,
  onChangeTextPack,
  onChangeTextPallet,
  onOk,
  onCancel,
  errorMessage,
  okLabel = 'Ок',
  okDisabled = false,
  cancelDisabled = false,
  keyboardType = 'default',
  isPack = true,
}: IProps) => {
  const { colors } = useTheme();

  return (
    <Dialog visible={visible} onDismiss={onCancel}>
      <Dialog.Content>
        <View style={localStyles.titleView}>
          <LargeText style={localStyles.titleText}>
            {isPack ? 'Количество коробок' : 'Количество коробок на поддоне'}
          </LargeText>
        </View>
        <TextInput
          theme={{
            colors: {
              primary: colors.primary,
              text: colors.text,
              placeholder: colors.primary,
            },
          }}
          value={textPack}
          onChangeText={(text) => onChangeTextPack(text)}
          autoFocus
          right={
            !!textPack && (
              <TextInput.Icon
                name="close"
                size={20}
                style={localStyles.marginTop}
                onPress={() => onChangeTextPack('')}
              />
            )
          }
          keyboardType={keyboardType ? keyboardType : 'default'}
          style={localStyles.height}
        />
        {!!errorMessage && <Text style={{ color: colors.notification }}>{errorMessage}</Text>}
        {!isPack && (
          <>
            <View style={localStyles.titleView}>
              <LargeText style={localStyles.titleText}>Количество поддонов</LargeText>
            </View>
            <TextInput
              theme={{
                colors: {
                  primary: colors.primary,
                  text: colors.text,
                  placeholder: colors.primary,
                },
              }}
              value={textPallet}
              onChangeText={(text) => onChangeTextPallet(text)}
              right={
                !!textPallet && (
                  <TextInput.Icon
                    name="close"
                    size={20}
                    style={localStyles.marginTop}
                    onPress={() => onChangeTextPallet('')}
                  />
                )
              }
              keyboardType={keyboardType ? keyboardType : 'default'}
              style={localStyles.height}
            />
          </>
        )}
      </Dialog.Content>
      <Dialog.Actions style={{ borderColor: colors.primary }}>
        <Button
          labelStyle={{ color: colors.primary }}
          color={colors.primary}
          onPress={onCancel}
          disabled={cancelDisabled}
        >
          Отмена
        </Button>
        <Button labelStyle={{ color: colors.primary }} color={colors.primary} onPress={onOk} disabled={okDisabled}>
          {okLabel}
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

export default QuantDialog;
