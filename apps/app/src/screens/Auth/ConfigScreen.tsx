import { IApiConfig } from '@lib/common-client-types';
import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, TextInput, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import SubTitle from '../../components/SubTitle';
import styles from '../../styles/global';

import { config } from './constants';

export type Props = {
  settings: IApiConfig | undefined;
  setSettings: (settings: IApiConfig) => void;
  showSettings: (visible: boolean) => void;
};

const ConfigScreen = (props: Props) => {
  const { settings, setSettings, showSettings } = props;
  const [serverName, setServerName] = useState(settings?.server || config.server);
  const [serverPort, setServerPort] = useState(settings?.port.toString() || config.port.toString());
  const [timeout, setTimeout] = useState(settings?.timeout?.toString() || config.timeout.toString());

  const { colors } = useTheme();

  const saveSettings = () => {
    /*     const match = serverName.match(/^(.*:\/\/)([A-Za-z0-9\-.]+)/);
    const protocol: string = match?.[1] || config.protocol;
    const server: string = match?.[2] || config.server; */

    const protocol: string = config.protocol;
    const server: string = serverName || config.protocol;

    const url: IApiConfig = {
      apiPath: config.apiPath,
      protocol,
      port: parseInt(serverPort, 10),
      timeout: parseInt(timeout, 10),
      server,
    };

    setSettings(url);
  };

  const hideSettings = () => {
    showSettings(false);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SubTitle>Настройка подключения</SubTitle>
      <TextInput
        value={serverName}
        onChangeText={setServerName}
        placeholder="Адрес сервера"
        style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
      />
      <TextInput
        value={serverPort}
        onChangeText={setServerPort}
        placeholder="Порт"
        style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
      />
      <TextInput
        value={timeout}
        onChangeText={setTimeout}
        placeholder="Варемя ожидания, м\с"
        style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
      />
      <View style={localStyles.buttonsView}>
        <Button
          onPress={saveSettings}
          icon="check"
          mode="contained"
          style={[styles.rectangularButton, localStyles.button]}
        >
          Принять
        </Button>
        <Button
          onPress={hideSettings}
          icon="cancel"
          mode="contained"
          style={[styles.rectangularButton, localStyles.button]}
        >
          Отмена
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const localStyles = StyleSheet.create({
  button: {
    flex: 1,
    marginLeft: 7,
  },
  buttonsView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export { ConfigScreen };
