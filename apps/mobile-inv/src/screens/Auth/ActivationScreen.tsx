import { useTheme, useIsFocused } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';
import { View, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Text, Button, ActivityIndicator, IconButton, TextInput } from 'react-native-paper';

import { IResponse } from '../../../../common';
import SubTitle from '../../components/SubTitle';
import { timeout } from '../../helpers/utils';
import { IDataFetch } from '../../model/types';
import { useAuthStore, useServiceStore } from '../../store';
import styles from '../../styles/global';

const ActivationScreen = () => {
  const { actions: serviceActions, apiService } = useServiceStore();
  const { actions } = useAuthStore();
  const { colors } = useTheme();

  const [serverReq, setServerReq] = useState<IDataFetch>({
    isLoading: false,
    isError: false,
    status: undefined,
  });

  const [activationCode, setActivationCode] = useState('');
  const isFocused = useIsFocused();

  const sendActivationCode = useCallback(async () => {
    /* Запрос к серверу на проверку кода активации */
    setServerReq({ isError: false, isLoading: true, status: undefined });
    try {
      const resp = await timeout<IResponse<string>>(
        apiService.baseUrl.timeout,
        apiService.auth.verifyActivationCode(activationCode),
      );
      if (!resp.result) {
        setActivationCode('');
        setServerReq({ isError: true, isLoading: false, status: resp.error });
        return;
      }

      serviceActions.setDeviceId(resp.data);
      actions.setDeviceStatus(true); // Возможно нужно сделать перенаправление на первую страницу
    } catch (err) {
      setServerReq({ isLoading: false, isError: true, status: err.message });
    }
  }, [actions, activationCode, apiService.auth, apiService.baseUrl.timeout, serviceActions]);

  return (
    <>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <View style={styles.container}>
          <SubTitle>Активация устройства</SubTitle>
          <View
            style={{
              ...localStyles.statusBox,
              backgroundColor: colors.background,
            }}
          >
            {serverReq.isError && <Text style={localStyles.errorText}>Ошибка: {serverReq.status}</Text>}
            {serverReq.isLoading && <ActivityIndicator size="large" color="#70667D" />}
          </View>
          <TextInput
            // eslint-disable-next-line jsx-a11y/no-autofocus
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
            style={styles.rectangularButton}
          >
            Отправить
          </Button>
        </View>
      </KeyboardAvoidingView>
      <View style={styles.bottomButtons}>
        <IconButton
          icon="server"
          size={30}
          onPress={() => actions.disconnect()}
          style={{
            ...styles.circularButton,
            backgroundColor: colors.primary,
            borderColor: colors.primary,
          }}
          color={colors.background}
        />
      </View>
    </>
  );
};

const localStyles = StyleSheet.create({
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
