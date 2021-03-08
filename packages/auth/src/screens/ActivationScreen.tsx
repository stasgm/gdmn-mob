import { useIsFocused } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Text, Button, ActivityIndicator, IconButton, TextInput, useTheme } from 'react-native-paper';

import { useAuth } from '../context/auth';
import globalStyles from '../styles/global';

const ActivationScreen = () => {
  const { colors } = useTheme();

  const {
    loading: { serverReq },
    disconnect,
    activate,
  } = useAuth(); // Переделать в пропсы

  const [activationCode, setActivationCode] = useState('');

  const isFocused = useIsFocused();

  const sendActivationCode = async () => {
    await activate(activationCode);
  };

  return (
    <>
      <KeyboardAvoidingView style={globalStyles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={globalStyles.container}>
          <Text>Активация устройства</Text>
          <View
            style={{
              ...styles.statusBox,
              backgroundColor: colors.background,
            }}
          >
            {serverReq.isError && <Text style={styles.errorText}>Ошибка: {serverReq.status}</Text>}
            {serverReq.isLoading && <ActivityIndicator size="large" color="#70667D" />}
          </View>
          <TextInput
            autoFocus={isFocused}
            placeholder="Введите код"
            keyboardType="number-pad"
            returnKeyType="done"
            autoCorrect={false}
            underlineColorAndroid="transparent"
            value={activationCode}
            onChangeText={setActivationCode}
          />
          <Button
            mode="contained"
            disabled={serverReq.isLoading}
            icon={'login'}
            onPress={sendActivationCode}
            style={globalStyles.rectangularButton}
          >
            Отправить
          </Button>
        </View>
      </KeyboardAvoidingView>
      <View style={globalStyles.bottomButtons}>
        <IconButton
          icon="server"
          size={30}
          onPress={() => disconnect()}
          style={{
            ...globalStyles.circularButton,
            backgroundColor: colors.primary,
            borderColor: colors.primary,
          }}
          color={colors.background}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  buttons: {
    width: '100%',
  },
  codeText: {
    borderColor: '#000000',
    fontSize: 22,
    fontWeight: 'bold',
    height: 30,
    marginTop: 15,
    textAlign: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#cc5933',
    fontSize: 18,
  },
  statusBox: {
    alignItems: 'center',
    height: 70,
    justifyContent: 'center',
  },
});

export { ActivationScreen };
