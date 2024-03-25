import React from 'react';
import { ActivityIndicator, KeyboardTypeOptions, Text, View, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Dialog, Button, TextInput } from 'react-native-paper';

interface IProps {
  visible: boolean;
  text: string;
  onChangeText: (text: string) => void;
  onOk: () => void;
  onCancel: () => void;
  okLabel?: string;
  errorMessage?: string;
  title: string;
  okDisabled?: boolean;
  cancelDisabled?: boolean;
  keyboardType?: KeyboardTypeOptions;
  loadIcon?: boolean;
}

const AppDialog = ({
  visible,
  text,
  onChangeText,
  onOk,
  onCancel,
  errorMessage,
  okLabel = 'Ок',
  title,
  okDisabled = false,
  cancelDisabled = false,
  keyboardType = 'default',
  loadIcon,
}: IProps) => {
  const { colors } = useTheme();

  return (
    <Dialog visible={visible} onDismiss={onCancel}>
      <View style={localStyles.container}>
        <Dialog.Title>{title}</Dialog.Title>
        {loadIcon ? <ActivityIndicator size="small" color="#70667D" /> : <View style={localStyles.blank} />}
      </View>

      <Dialog.Content>
        <TextInput
          theme={{
            colors: {
              primary: colors.primary,
              text: colors.text,
              placeholder: colors.primary,
            },
          }}
          value={text}
          onChangeText={onChangeText}
          autoFocus
          right={
            !!text && (
              <TextInput.Icon icon="close" size={20} style={localStyles.textInput} onPress={() => onChangeText('')} />
            )
          }
          keyboardType={keyboardType ? keyboardType : 'default'}
        />
        {!!errorMessage && <Text style={{ color: colors.notification }}>{errorMessage}</Text>}
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
  container: {
    flexDirection: 'row',
    maxWidth: '100%',
    alignItems: 'center',
  },
  textInput: {
    marginTop: 14,
  },
  blank: {
    width: 20,
  },
});

export default AppDialog;
